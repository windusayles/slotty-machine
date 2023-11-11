import * as PIXI from 'pixi.js';
import { WinLines } from './ReelsContainer';

export default class WinLineScreen {
  public container: PIXI.Container;
  private overlay: PIXI.Graphics;

  constructor(app: PIXI.Application, winResult: WinLines) {
    this.container = new PIXI.Container();
    this.generate(app.screen.width, app.screen.height, winResult);
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

  generate(appWidth: number, appHeight: number, winResult: WinLines) {
    this.container.visible = false;

    this.overlay = new PIXI.Graphics();
    this.overlay.beginFill(0xffffff, 0.001);
    this.overlay.drawRect(0, 0, appWidth, appHeight);
    this.overlay.endFill();
    this.overlay.interactive = false;
    this.overlay.buttonMode = false;
    this.overlay.cursor = 'default';
    const childrenToAdd = [];

    if (winResult.top) {
      const top = new PIXI.Graphics();
      top.beginFill(0xffff66, 0.01);
      top.lineStyle(5, 0xffff66, 0.8);
      top.drawRect(0, 0, 1400, 380);
      top.x = (appWidth - top.width) / 2;
      top.y = 40;
      top.endFill();
      childrenToAdd.push(top);
    }
    if (winResult.middle) {
      const middle = new PIXI.Graphics();
      middle.beginFill(0xffff66, 0.01);
      middle.lineStyle(5, 0xffff66, 0.8);
      middle.drawRect(0, 0, 1400, 380);
      middle.x = (appWidth - middle.width) / 2;
      middle.y = (appHeight - middle.height) / 2 + 3;
      middle.endFill();
      childrenToAdd.push(middle);
    }
    if (winResult.bottom) {
      const bottom = new PIXI.Graphics();
      bottom.beginFill(0xffff66, 0.01);
      bottom.lineStyle(5, 0xffff66, 0.8);
      bottom.drawRect(0, 0, 1400, 380);
      bottom.x = (appWidth - bottom.width) / 2;
      bottom.y = appHeight - bottom.height - 34;
      bottom.endFill();
      childrenToAdd.push(bottom);
    }
    if (winResult.left) {
      const left = new PIXI.Graphics();
      left.beginFill(0xffff66, 0.01);
      left.lineStyle(5, 0xffff66, 0.8);
      left.drawRect(0, 0, 200, 1300);
      left.x = 85;
      left.y = 40;
      left.endFill();
      childrenToAdd.push(left);
    }
    if (winResult.center) {
      const center = new PIXI.Graphics();
      center.beginFill(0xffff66, 0.01);
      center.lineStyle(5, 0xffff66, 0.8);
      center.drawRect(0, 0, 200, 1300);
      center.x = 385;
      center.y = 40;
      center.endFill();
      childrenToAdd.push(center);
    }
    if (winResult.right) {
      const right = new PIXI.Graphics();
      right.beginFill(0xffff66, 0.01);
      right.lineStyle(5, 0xffff66, 0.8);
      right.drawRect(0, 0, 200, 1300);
      right.x = 685;
      right.y = 40;
      right.endFill();
      childrenToAdd.push(right);
    }
    if (winResult.right2) {
      const right = new PIXI.Graphics();
      right.beginFill(0xffff66, 0.01);
      right.lineStyle(5, 0xffff66, 0.8);
      right.drawRect(0, 0, 200, 1300);
      right.x = 985;
      right.y = 40;
      right.endFill();
      childrenToAdd.push(right);
    }
    if (winResult.right3) {
      const right = new PIXI.Graphics();
      right.beginFill(0xffff66, 0.01);
      right.lineStyle(5, 0xffff66, 0.8);
      right.drawRect(0, 0, 200, 1300);
      right.x = 1285;
      right.y = 40;
      right.endFill();
      childrenToAdd.push(right);
    }
    if (winResult.backSlash) {
      const backSlash = new PIXI.Graphics();
      backSlash.beginFill(0xffff66, 0.01);
      backSlash.lineStyle(5, 0xffff66, 0.8);
      backSlash.drawPolygon([310, 80, 335, 50, 1100, 1300, 1075, 1330]);
      backSlash.endFill();
      childrenToAdd.push(backSlash);
    }
    if (winResult.slash) {
      const slash = new PIXI.Graphics();
      slash.beginFill(0xffff66, 0.01);
      slash.lineStyle(5, 0xffff66, 0.8);
      slash.drawPolygon([1075, 50, 1100, 80, 340, 1330, 315, 1300]);
      slash.endFill();
      childrenToAdd.push(slash);
    }

    this.container.addChild(...childrenToAdd, this.overlay);
    this.show();
  }
}
