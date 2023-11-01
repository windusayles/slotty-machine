import * as PIXI from 'pixi.js';

export default class Coinsboard {
  public container: PIXI.Container;
  public outOfMoney = false;
  private winAmountText: PIXI.Text;
  private winTotal: PIXI.Text;
  private spentText: PIXI.Text;
  private winAmount: number = 0;
  private money: number = 10;
  private wager: number = 1;
  private spent: number = 0;

  constructor(app: PIXI.Application) {
    this.container = new PIXI.Container();
    this.generate(app.screen.width, app.screen.height);
  }

  decrement() {
    if (!this.outOfMoney) {
      this.money -= this.wager;
      this.winTotal.text = `Total: ${this.money}`;
      this.spent -= this.wager;
      this.spentText.text = `Spent: ${this.spent * -1}`;
    }
    if (this.money - this.wager < 0) {
      this.outOfMoney = true;
    }
  }

  increment(multiplier: number) {
    this.money += this.wager * multiplier;
    this.winTotal.text = `Total: ${this.money}`;
    this.winAmount += this.wager * multiplier;
    this.winAmountText.text = `Earned: ${this.winAmount}`;
    if (this.outOfMoney) this.outOfMoney = false;
  }

  private generate(appWidth: number, appHeight: number) {
    const style = new PIXI.TextStyle({
      fontFamily: 'Courier',
      fontSize: 24,
      fill: '#ff33ee',
    });

    this.winTotal = new PIXI.Text(`Total: ${this.money}`, style);
    this.winTotal.y = 5;

    // const wagerText = new PIXI.Text(`Wager: ${this.wager}`, style);
    this.spentText = new PIXI.Text(`Spent: ${this.spent * -1}`, style);
    this.spentText.y = this.winTotal.height + 10;

    this.winAmountText = new PIXI.Text(`Earned: ${this.winAmount}`, style);
    this.winAmountText.y = this.spentText.y + this.spentText.height + 5;

    this.spentText.x = this.winTotal.x = this.winAmountText.x = 10;

    const rect = new PIXI.Graphics();
    rect.beginFill(0x02474e, 0.6);
    const rectHeight =
      this.winTotal.height +
      this.spentText.height +
      this.winAmountText.height +
      25;
    rect.drawRect(0, 0, 160, rectHeight);
    rect.endFill();

    this.container.x = appWidth - rect.width - 150;
    this.container.y = appHeight / 2 - 25;
    this.container.addChild(
      rect,
      this.winTotal,
      this.spentText,
      this.winAmountText
    );
  }
}
