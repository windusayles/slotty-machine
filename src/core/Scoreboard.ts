import * as PIXI from 'pixi.js';
import PlayButton from './PlayButton';

export default class Scoreboard {
  public container: PIXI.Container;
  public outOfMoney = false;
  private winAmountText: PIXI.Text;
  private winTotal: PIXI.Text;
  private wagerText: PIXI.Text;
  private winAmount: number = 0;
  private money: number = 10;
  private wager: number = 10;
  private spent: number = 0;

  constructor(app: PIXI.Application, playBtn: PlayButton) {
    this.container = new PIXI.Container();
    this.generate(app.screen.width, app.screen.height);
    this.handleWager(app, playBtn);
  }

  decrement() {
    if (!this.outOfMoney) {
      this.money -= this.wager;
      this.winTotal.text = `Total: ${this.money}`;
      this.spent -= this.wager;
    }
    if (this.money - this.wager < 0) {
      this.outOfMoney = true;
    }
  }

  increment(multiplier: number) {
    this.money += Math.floor(this.wager * multiplier);
    this.winTotal.text = `Total: ${this.money}`;
    this.winAmount += Math.floor(this.wager * multiplier);
    this.winAmountText.text = `Earned: ${this.winAmount}`;
    if (this.money >= this.wager) this.outOfMoney = false;
  }

  private generate(appWidth: number, appHeight: number) {
    const style = new PIXI.TextStyle({
      fontFamily: 'Courier',
      fontSize: 24,
      fill: '#ff33ee',
    });

    this.winTotal = new PIXI.Text(`Total: ${this.money}`, style);
    this.winTotal.y = 5;

    this.wagerText = new PIXI.Text(`Wager: ${this.wager}`, style);
    this.wagerText.y = this.winTotal.height + 10;

    this.winAmountText = new PIXI.Text(`Earned: ${this.winAmount}`, style);
    this.winAmountText.y = this.wagerText.y + this.wagerText.height + 5;

    this.wagerText.x = this.winTotal.x = this.winAmountText.x = 10;

    const rect = new PIXI.Graphics();
    rect.beginFill(0x02474e, 0.6);
    const rectHeight =
      this.winTotal.height +
      this.wagerText.height +
      this.winAmountText.height +
      25;
    rect.drawRect(0, 0, 160, rectHeight);
    rect.endFill();

    this.container.x = appWidth - rect.width - 150;
    this.container.y = appHeight / 2 - 25;
    this.container.addChild(
      rect,
      this.winTotal,
      this.wagerText,
      this.winAmountText
    );
  }

  private handleWager(app: PIXI.Application, playBtn: PlayButton) {
    document.addEventListener('keydown', (key) => {
      if (key.code === 'ArrowUp' && this.wager < this.money) {
        this.wager += 1;
        this.generate(app.screen.width, app.screen.height);
      } else if (key.code === 'ArrowDown' && this.wager > 1) {
        this.wager -= 1;
        if (this.outOfMoney === true && this.wager <= this.money) {
          playBtn.setEnabled();
          this.outOfMoney = false;
        }
        this.generate(app.screen.width, app.screen.height);
      }
    });
  }
}
