import * as PIXI from 'pixi.js';
import Reel from './Reel';
import { animations } from '../assets/atlas.json';

export interface WinLines {
  rowTop: number;
  rowMid: number;
  rowBot: number;
  col1: number;
  col2: number;
  col3: number;
  col4: number;
  col5: number;
  col6: number;
  col7: number;
  // backSlash: number;
  // slash: number;
  winTotal: number;
  [key: string]: number;
}

export default class ReelsContainer {
  public readonly reels: Array<Reel> = [];
  public readonly container: PIXI.Container;
  private texturesToAdd: PIXI.Texture[];
  private REEL_OFFSET_LEFT = 50;
  private NUMBER_OF_REELS = 7;

  constructor(app: PIXI.Application) {
    this.texturesToAdd = [app.loader.resources.atlas!.textures!['SYM1.png']];
    this.container = new PIXI.Container();
    this.initTextures(app, this.texturesToAdd);
  }

  private initTextures(app: PIXI.Application, texturesToAdd: PIXI.Texture[]) {
    // logic should work for 100 and 7 the same
    // keep SYM1 as wild card
    const texturePool = [...animations.SYM];
    texturePool.splice(0, 1);
    texturePool.push(...animations.kinkInc);

    // total number of CHARACTERS minus the 1 WILD and any others added at top
    let addTextures = 3;

    while (addTextures > 0) {
      const index = Math.floor(Math.random() * texturePool.length);
      if (index > 5) {
        texturesToAdd.push(app.loader.resources[texturePool[index]]!.texture!);
      } else {
        texturesToAdd.push(
          app.loader.resources.atlas!.textures![texturePool[index]]
        );
      }
      addTextures -= 1;
    }

    for (let i = 0; i < this.NUMBER_OF_REELS; i++) {
      const availableSprites: Array<PIXI.Sprite> = [];

      for (let count = 0; count < 4; count++) {
        const sprite = new PIXI.Sprite(
          texturesToAdd[Math.floor(Math.random() * texturesToAdd.length)]
        );
        sprite.height = 340;
        sprite.width = 170;
        availableSprites.push(sprite);
      }

      const reel = new Reel(app, i, availableSprites);
      this.reels.push(reel);
      this.container.addChild(reel.container);
    }

    this.container.x = this.REEL_OFFSET_LEFT;
  }

  async spin() {
    const shiftingDelay = 180; // time for individual reel to spin
    const start = Date.now();
    const reelsToSpin = [...this.reels];
    const reelsLen = this.reels.length;

    for await (let value of this.infiniteSpinning(reelsToSpin)) {
      // add extra long spin for final
      const finalReel = reelsToSpin.length === 1 ? 420 : 0;
      const shiftingWaitTime =
        (reelsLen - reelsToSpin.length + 1) * shiftingDelay + finalReel;

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
    /**
     * create diagonals if we have square grid
     * if (reelsLen === this.reels[0].sprites.length - 1 && reelsLen % 2 === 1) {
     * console.log(
     *   'ADDING DIAGONAL WIN LINES TO CHECK',
     *   'oddly, this does not need to be called in order to check'
     *   );
     *   const backSlash = [],
     *   slashDiag = [];
     *   for (let i = 0; i < reelsLen; i++) {
     *     backSlash.push(this.reels[i].sprites[i + 1]);
     *     slashDiag.push(this.reels[reelsLen - 1 - i].sprites[i + 1]);
     *   }
     *   onScreenReels.push(backSlash, slashDiag);
     * }
     */

    const winLines: WinLines = {
      rowTop: 0,
      rowMid: 0,
      rowBot: 0,
      col1: 0,
      col2: 0,
      col3: 0,
      col4: 0,
      col5: 0,
      col6: 0,
      col7: 0,
      // backSlash: 0,
      // slash: 0,
      winTotal: 0,
    };
    const lineOrder = [
      'rowTop',
      'rowMid',
      'rowBot',
      'col1',
      'col2',
      'col3',
      'col4',
      'col5',
      'col6',
      'col7',
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
      winLines[lineOrder[3 + i]] += this.checkForWin(onScreenReels[i]);
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
      // this.blessRNG(); // I believe this sets the offscreen row as as something random. why?
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
    // if (combination.size === 1 && combination.has('SYM1') && symbols.length > 3) {
    //   console.log({ symbols });
    //   if (symbols.length === 3) return 0;
    //   if (symbols.length > 4) {
    //     window.alert('WAY TOO WILD');
    //     window.location.reload();
    //   }
    // }

    if (symbols.length === 3) {
      if (combination.size === 1 && !combination.has('SYM1')) return 1;
      return 0;
    }

    if (combination.size === 1 && !combination.has('SYM1')) return 10;
    if (combination.size === 2 && combination.has('SYM1')) return 5;

    // with 7, let's add partial wins if we get close
    if (combination.size === 2) return 2;
    if (combination.size === 3 && combination.has('SYM1')) return 1;

    return 0;
  }

  // private blessRNG() {
  //   this.reels.forEach((reel) => {
  //     reel.sprites[0] = new PIXI.Sprite(
  //       this.texturesToAdd[
  //         Math.floor(Math.random() * this.texturesToAdd.length)
  //       ]
  //     );
  //   });
  // }
}
