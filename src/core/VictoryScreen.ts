import * as PIXI from 'pixi.js';

export default class VictoryScreen {
  public container: PIXI.Container;
  private overlay: PIXI.Graphics;

  constructor(app: PIXI.Application, winTotal: number) {
    this.container = new PIXI.Container();
    this.generate(app.screen.width, app.screen.height, winTotal);
  }

  show() {
    this.container.visible = true;
    const id = window.setTimeout(this.hide.bind(this), 3000);
    const handler = () => {
      window.clearTimeout(id);
      this.hide();
    };
    this.overlay.addListener('pointerdown', handler.bind(this));
  }

  hide() {
    this.container.visible = false;
  }

  private generate(appWidth: number, appHeight: number, winTotal: number) {
    this.container.visible = false;

    this.overlay = new PIXI.Graphics();
    this.overlay.beginFill(0xffffff, 0.001);
    this.overlay.drawRect(0, 0, appWidth, appHeight);
    this.overlay.endFill();
    this.overlay.interactive = true;
    this.overlay.buttonMode = true;
    this.overlay.cursor = 'default';

    const rect = new PIXI.Graphics();
    rect.beginFill(0x02474e, 0.85);
    rect.drawRect(0, 0, 300, 200);
    rect.x = appWidth - rect.width - 25;
    rect.y = 10;
    rect.endFill();

    const style = new PIXI.TextStyle({
      fontFamily: 'Courier',
      fontSize: 40,
      fill: '#ff33ee',
    });

    const text = new PIXI.Text(
      `${winTotal.toString().length > 1 ? ' ' : ''}YOU WON \n${winTotal} COIN${
        winTotal === 1 ? '' : 'S'
      }!`,
      style
    );
    text.x = appWidth - rect.width - 25 + (rect.width - text.width) / 2;
    text.y = 10 + (rect.height - text.height) / 2;

    this.container.addChild(rect, text, this.overlay);
  }
}
