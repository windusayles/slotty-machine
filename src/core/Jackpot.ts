import * as PIXI from 'pixi.js';

export default class JackpotScreen {
  public container: PIXI.Container;
  private overlay: PIXI.Graphics;

  constructor(app: PIXI.Application, winTotal: number) {
    this.container = new PIXI.Container();
    this.generate(app.screen.width, app.screen.height);
  }

  show() {
    this.container.visible = true;
    const id = window.setTimeout(this.hide.bind(this), 300000); // 5 minutes
    const handler = () => {
      window.clearTimeout(id);
      this.hide();
    };
  }

  hide() {
    this.container.visible = false;
  }

  private generate(appWidth: number, appHeight: number) {
    this.container.visible = false;

    this.overlay = new PIXI.Graphics();
    this.overlay.beginFill(0xffffff, 0.001);
    this.overlay.drawRect(0, 0, appWidth, appHeight);
    this.overlay.endFill();
    this.overlay.interactive = true;
    this.overlay.buttonMode = true;
    this.overlay.cursor = 'default';

    const rect = new PIXI.Graphics();
    rect.beginFill(0x02474e, 1);
    rect.drawRect(0, 0, appWidth - 50, appHeight - 50);
    rect.x = 25;
    rect.y = 25;
    rect.endFill();

    const style = new PIXI.TextStyle({
      fontFamily: 'Courier',
      fontSize: 96,
      fill: '#ff33ee',
    });

    const text = new PIXI.Text('JACKPOT, BABY!', style);
    text.x = (appWidth - text.width) / 2;
    text.y = (appHeight - text.height) / 2;

    this.container.addChild(rect, text, this.overlay);
  }
}
