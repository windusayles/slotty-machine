import * as PIXI from 'pixi.js';

export default class Reel {
  public readonly container: PIXI.Container;
  public availableSprites: Array<PIXI.Sprite> = [];
  public sprites: Array<PIXI.Sprite> = [];
  private readonly appHeight: number;
  private readonly ticker: PIXI.Ticker;

  constructor(
    app: PIXI.Application,
    position: number,
    availableSprites: PIXI.Sprite[]
  ) {
    this.appHeight = app.screen.height;
    this.ticker = app.ticker;
    this.container = new PIXI.Container();
    this.availableSprites = availableSprites;
    this.generate(position);
  }

  private generate(position: number) {
    const REEL_WIDTH = this.availableSprites[1].width + 20;
    const REEL_OFFSET_BETWEEN = 0;
    const NUMBER_OF_ROWS = 3; // +1 offscreen above
    this.container.x = position * REEL_WIDTH;

    for (let i = 0; i < NUMBER_OF_ROWS + 1; i++) {
      const symbol = this.availableSprites[i];

      const widthDiff = REEL_WIDTH - symbol.width;
      symbol.x = position * REEL_OFFSET_BETWEEN + widthDiff / 2;

      const yOffset = (this.appHeight - symbol.height * 3) / 3;
      const cellHeight = symbol.height + yOffset;
      const paddingTop = yOffset / 2;
      symbol.y = (i - 1) * cellHeight + paddingTop;
      this.sprites.push(symbol);
      this.container.addChild(symbol);
    }
  }

  spinOneTime() {
    let speed = 100;
    let doneRunning = false;
    let yOffset = (this.appHeight - this.sprites[0].height * 3) / 3 / 2;

    return new Promise<void>((resolve) => {
      const tick = () => {
        for (let i = this.sprites.length - 1; i >= 0; i--) {
          const symbol = this.sprites[i];

          if (symbol.y + speed > this.appHeight + yOffset) {
            doneRunning = true;
            speed = this.appHeight - symbol.y + yOffset;
            symbol.y = -(symbol.height + yOffset);
          } else {
            symbol.y += speed;
          }

          if (i === 0 && doneRunning) {
            let t = this.sprites.pop();
            if (t) this.sprites.unshift(t);
            this.ticker.remove(tick);
            resolve();
          }
        }
      };

      this.ticker.add(tick);
    });
  }
}
