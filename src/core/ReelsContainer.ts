import * as PIXI from 'pixi.js';
import Reel from './Reel';

export default class ReelsContainer {
    public readonly reels: Array<Reel> = [];
    public readonly container: PIXI.Container;

    constructor(app: PIXI.Application) {
        const REEL_OFFSET_LEFT = 280;
        const NUMBER_OF_REELS = 3;
        this.container = new PIXI.Container();

        for (let i = 0; i < NUMBER_OF_REELS; i++) {
            const reel = new Reel(app, i);
            this.reels.push(reel);
            this.container.addChild(reel.container);
        }

        this.container.x = REEL_OFFSET_LEFT;
    }

    async spin() {
        // Overall time of spinning = shiftingDelay * this.reels.length
        //
        const shiftingDelay = 500;
        const start = Date.now();
        const reelsToSpin = [...this.reels];
        
        for await (let value of this.infiniteSpinning(reelsToSpin)) {
            const shiftingWaitTime = (this.reels.length - reelsToSpin.length + 1) * shiftingDelay;
            
            if (Date.now() >= start + shiftingWaitTime) {
                reelsToSpin.shift();
            }

            if (!reelsToSpin.length) break;
        }

        // reel.sprites[2] - Middle visible symbol of the reel
        // we can check for multiple win conditions, and return if any are true, OR set different weights for certain wins, and display the total.
        // checkForWin needs to return 0 if no wins, a
        // TODO
        return this.checkForWin(this.reels.map(reel => reel.sprites[2]));
    }

    private async* infiniteSpinning(reelsToSpin: Array<Reel>) {
        while (true) {
            const spinningPromises = reelsToSpin.map(reel => reel.spinOneTime());
            await Promise.all(spinningPromises);
            this.blessRNG();
            yield;
        }
    }

    private checkForWin(symbols: Array<PIXI.Sprite>): number {
        // Set of strings: 'SYM1', 'SYM2', ...
        //
        const combination: Set<string> = new Set();
        symbols.forEach(symbol => combination.add(symbol.texture.textureCacheIds[0].split('.')[0]));
        // always win, for dev testing
        // return true;

        // all match, so combo size is 1, and does not have wild card bc all 3 wild card
        // if (combination.size === 1 && !combination.has('SYM1')) return true;

        // wild card win is triple, not double
        if (combination.size === 1 && !combination.has('SYM1')) return 3;
        return combination.size === 2 && combination.has('SYM1') ? 2 : 0;
    }

    private blessRNG() {
        this.reels.forEach(reel => {
            reel.sprites[0].texture = reel.textures[Math.floor(Math.random() * reel.textures.length)];
        });
    }
}
