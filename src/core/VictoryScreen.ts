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
    rect.beginFill(0x02474e, 0.8);
    rect.drawRect(0, 0, 800, 400);
    rect.x = (appWidth - rect.width) / 2 - 90;
    rect.y = (appHeight - rect.height) / 2;
    rect.endFill();

    const style = new PIXI.TextStyle({
      fontFamily: 'Courier',
      fontSize: 96,
      fill: '#ff33ee',
    });

    const text = new PIXI.Text(`YOU WON ${winTotal} COINS!`, style);
    text.x = (appWidth - text.width) / 2 - 90;
    text.y = (appHeight - text.height) / 2;

    this.container.addChild(rect, text, this.overlay);
  }
}
