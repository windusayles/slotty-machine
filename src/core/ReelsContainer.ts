import * as PIXI from 'pixi.js';
import Reel from './Reel';
import { animations } from '../assets/atlas.json';

export interface WinLines {
  top: number;
  middle: number;
  bottom: number;
  left: number;
  center: number;
  right: number;
  right2: number;
  right3: number;
  // backSlash: number;
  // slash: number;
  winTotal: number;
  [key: string]: number;
}

export default class ReelsContainer {
  public readonly reels: Array<Reel> = [];
  public readonly container: PIXI.Container;

  constructor(app: PIXI.Application) {
    const REEL_OFFSET_LEFT = 70;
    const NUMBER_OF_REELS = 5;
    this.container = new PIXI.Container();

    // create the set of textures here and pass in to new Reel so it has the same list, but we can have a new list with each game

    // logic should work for 100 and 7 the same
    // keep SYM1 as wild card
    const tempTextures = [...animations.SYM];
    tempTextures.splice(0, 1);
    const texturesToAdd: PIXI.Texture[] = [
      app.loader.resources.atlas!.textures!['SYM1.png'],
    ];
    // total textures minus the 1 wild
    let totalTextures = 2;

    while (totalTextures > 0) {
      const index = Math.floor(Math.random() * tempTextures.length);
      texturesToAdd.push(
        app.loader.resources.atlas!.textures![tempTextures[index]]
      );
      tempTextures.splice(index, 1);

      totalTextures -= 1;
    }

    for (let i = 0; i < NUMBER_OF_REELS; i++) {
      const reel = new Reel(app, i, texturesToAdd);
      this.reels.push(reel);
      this.container.addChild(reel.container);
    }

    this.container.x = REEL_OFFSET_LEFT;
  }

  async spin() {
    // Overall time of spinning = shiftingDelay * reelsLen
    //
    const shiftingDelay = 500;
    const start = Date.now();
    const reelsToSpin = [...this.reels];
    const reelsLen = this.reels.length;

    for await (let value of this.infiniteSpinning(reelsToSpin)) {
      const shiftingWaitTime =
        (reelsLen - reelsToSpin.length + 1) * shiftingDelay;

      if (Date.now() >= start + shiftingWaitTime) {
        reelsToSpin.shift();
      }

      if (!reelsToSpin.length) break;
    }

    /**
     * lose the first item of each reel bc it's offscreen
     * (index starts at 1 in loop, not 0)
     * the reels (vertical) are used to check horiztonal and vertical win lines
     */
    const onScreenReels = this.reels.map((reel) => {
      const newArray = [];
      for (let i = 1; i < reel.sprites.length; i++) {
        newArray.push(reel.sprites[i]);
      }
      return newArray;
    });
    // create diagonals if we have square grid
    if (reelsLen === this.reels[0].sprites.length - 1 && reelsLen % 2 === 1) {
      console.log(
        'ADDING DIAGONAL WIN LINES TO CHECK',
        'oddly, this does not need to be called in order to check'
      );
      const backSlash = [],
        slashDiag = [];
      for (let i = 0; i < reelsLen; i++) {
        backSlash.push(this.reels[i].sprites[i + 1]);
        slashDiag.push(this.reels[reelsLen - 1 - i].sprites[i + 1]);
      }
      onScreenReels.push(backSlash, slashDiag);
    }

    const winLines: WinLines = {
      top: 0,
      middle: 0,
      bottom: 0,
      left: 0,
      center: 0,
      right: 0,
      right2: 0,
      right3: 0,
      // backSlash: 0,
      // slash: 0,
      winTotal: 0,
    };
    const lineOrder = [
      'top',
      'middle',
      'bottom',
      'left',
      'center',
      'right',
      'right2',
      'right3',
      // 'backSlash',
      // 'slash',
    ];
    // check for wins in top, mid, & bottom
    for (let i = 0; i < this.reels[0].sprites.length - 1; i++) {
      winLines[lineOrder[i]] += this.checkForWin(
        this.reels.map((reel) => reel.sprites[i + 1])
      );
    }
    // check for wins in vertical and possible diagonals
    for (let i = 0; i < onScreenReels.length; i++) {
      winLines[lineOrder[3 + i]] += this.checkForWin(onScreenReels[i])
        ? 0.2 // reduce weight of easier wins
        : 0;
    }
    // sum all wins for a single win value
    for (const entry of lineOrder) {
      winLines.winTotal += winLines[entry];
    }
    console.log({ winLines });

    return winLines;
  }

  private async *infiniteSpinning(reelsToSpin: Array<Reel>) {
    while (true) {
      const spinningPromises = reelsToSpin.map((reel) => reel.spinOneTime());
      await Promise.all(spinningPromises);
      this.blessRNG();
      yield;
    }
  }

  private checkForWin(symbols: Array<PIXI.Sprite>): number {
    // Set of strings: 'SYM1', 'SYM2', ...
    const combination: Set<string> = new Set();
    symbols.forEach((symbol) =>
      combination.add(symbol.texture.textureCacheIds[0].split('.')[0])
    );

    // all three wild card is now TOO wild, no points
    if (combination.size === 1 && combination.has('SYM1')) return 0;

    if (combination.size === 1 && !combination.has('SYM1')) return 1;

    return combination.size === 2 && combination.has('SYM1') ? 1 : 0;
  }

  private blessRNG() {
    this.reels.forEach((reel) => {
      reel.sprites[0].texture =
        reel.textures[Math.floor(Math.random() * reel.textures.length)];
    });
  }
}
