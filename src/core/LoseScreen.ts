import * as PIXI from 'pixi.js';

export default class LoseScreen {
  public container: PIXI.Container;
  private overlay: PIXI.Graphics;

  constructor(app: PIXI.Application) {
    this.container = new PIXI.Container();
    this.generate(app.screen.width, app.screen.height);
  }

  show() {
    this.container.visible = true;
    const id = window.setTimeout(this.hide.bind(this), 10000);

    document.addEventListener('keydown', (key) => {
      if (key.code === 'Enter') {
        window.clearTimeout(id);
      }
    });
  }

  hide() {
    window.location.reload();
  }

  private generate(appWidth: number, appHeight: number) {
    this.container.visible = false;

    this.overlay = new PIXI.Graphics();
    this.overlay.beginFill(0x000000, 0.6);
    this.overlay.drawRect(0, 0, appWidth, appHeight);
    this.overlay.endFill();

    this.overlay.interactive = false;
    this.overlay.buttonMode = false;
    this.overlay.cursor = 'none';

    const rect = new PIXI.Graphics();
    rect.beginFill(0xff00ff, 1);
    rect.drawRect(0, 0, appWidth - 50, appHeight - 50);
    rect.x = 25;
    rect.y = 25;
    rect.endFill();

    const style = new PIXI.TextStyle({
      fontFamily: 'Courier',
      fontSize: 96,
      fill: '#eeeeee',
    });

    const text = new PIXI.Text('Aw, you lost.\n Try again!', style);
    if (text.width > rect.width - 50) {
      const newWidth = rect.width - 50;
      const ratio = newWidth / text.width;
      const newHeight = text.height * ratio;
      text.width = newWidth;
      text.height = newHeight;
    }

    text.x = (appWidth - text.width) / 2;
    text.y = (appHeight - text.height) / 2;

    this.container.addChild(rect, text, this.overlay);
  }
}
