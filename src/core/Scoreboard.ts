import * as PIXI from 'pixi.js';
import PlayButton from './PlayButton';

export default class Scoreboard {
  public container: PIXI.Container;
  public outOfMoney = false;
  private winTotal: PIXI.Text;
  private wagerText: PIXI.Text;
  private money: number = 10;
  public wager: number = 10;
  private playBtn: PlayButton;

  constructor(app: PIXI.Application, playBtn: PlayButton) {
    this.container = new PIXI.Container();
    this.playBtn = playBtn;
    this.generate(app.screen.width, app.screen.height);
    this.handleWager(app);
  }

  decrement() {
    if (!this.outOfMoney) {
      this.money -= this.wager;
      this.winTotal.text = `Total: ${this.money}`;
    }
  }

  increment(multiplier: number) {
    if (!multiplier) {
      if (this.wager > this.money && this.money !== 0) {
        this.wager = this.money;
        this.wagerText.text = `Wager: ${this.wager}`;
      }
    } else {
      this.money += Math.floor(this.wager * multiplier);
      this.winTotal.text = `Total: ${this.money}`;
      if (this.wager > this.money) {
        this.wager = this.money;
        this.playBtn.setEnabled();
        this.wagerText.text = `Wager: ${this.wager}`;
      }
    }
    if (this.money >= this.wager && this.money) {
      this.outOfMoney = false;
    } else {
      this.outOfMoney = true;
    }
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

    this.wagerText.x = this.winTotal.x = 10;

    const rect = new PIXI.Graphics();
    rect.beginFill(0x02474e, 0.6);
    const rectHeight =
      this.winTotal.height +
      this.wagerText.height +
      // this.winAmountText.height +
      25;
    rect.drawRect(0, 0, 160, rectHeight);
    rect.endFill();

    this.container.x = appWidth - rect.width - 150;
    this.container.y = appHeight / 2 - 25;
    this.container.addChild(rect, this.winTotal, this.wagerText);
  }

  private handleWager(app: PIXI.Application) {
    document.addEventListener('keydown', (key) => {
      if (key.code === 'ArrowUp' && this.wager < this.money) {
        this.wager += 1;
        this.generate(app.screen.width, app.screen.height);
      } else if (key.code === 'ArrowDown' && this.wager > 1) {
        this.wager -= 1;
        if (this.outOfMoney === true && this.wager <= this.money) {
          this.outOfMoney = false;
          this.playBtn.setEnabled();
        }
        this.generate(app.screen.width, app.screen.height);
      }
    });
  }
}
