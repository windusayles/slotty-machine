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
        // checkForWin needs to return 0 if no wins,
        let winTotal = 0;

        // the map returns an array of the 3rd item in each of three vertical reels,
        // 3rd because 1st is offscreen.
        winTotal += this.checkForWin(this.reels.map(reel => reel.sprites[2]));

        // a win from top or bottom row counts for half, same as all vertical wins
        winTotal += (this.checkForWin(this.reels.map(reel => reel.sprites[1])));
        winTotal += (this.checkForWin(this.reels.map(reel => reel.sprites[3])));

        // lose the first item bc it's offscreen
        const onScreenReels = this.reels.map(reel => {
            const newArray = [];
            for (let i = 1; i < reel.sprites.length; i++) {
                newArray.push(reel.sprites[i]);
            }
            return newArray;
        })
        // add both diagonals manually
        onScreenReels.push([this.reels[0].sprites[1], this.reels[1].sprites[2], this.reels[2].sprites[3]]);
        onScreenReels.push([this.reels[0].sprites[3], this.reels[1].sprites[2], this.reels[2].sprites[1]]);

        winTotal += (this.checkForWin(onScreenReels[0]));
        winTotal += (this.checkForWin(onScreenReels[1]));
        winTotal += (this.checkForWin(onScreenReels[2]));
        winTotal += (this.checkForWin(onScreenReels[3]));
        winTotal += (this.checkForWin(onScreenReels[4]));
        console.log(winTotal);

        return winTotal;
        // return this.checkForWin(this.reels.map(reel => reel.sprites[2]));
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
        const combination: Set<string> = new Set();
        symbols.forEach(symbol => combination.add(symbol.texture.textureCacheIds[0].split('.')[0]));

        // all match, so combo size is 1, and does not have wild card bc all 3 wild card
        // if (combination.size === 1 && !combination.has('SYM1')) return 0;

        // all wild card win is doubled
        if (combination.size === 1 && !combination.has('SYM1')) return 2;

        return combination.size === 2 && combination.has('SYM1') ? 1 : 0;
    }

    private blessRNG() {
        this.reels.forEach(reel => {
            reel.sprites[0].texture = reel.textures[Math.floor(Math.random() * reel.textures.length)];
        });
    }
}
