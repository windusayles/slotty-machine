import * as PIXI from 'pixi.js';

export default class Coinsboard {
    public container: PIXI.Container;
    public outOfMoney = false;
    private winAmountText: PIXI.Text;
    private winTotal: PIXI.Text;
    private winAmount: number = 0;
    private money: number = 10;
    private wager: number = 1;

    constructor(app: PIXI.Application) {
        this.container = new PIXI.Container();
        this.generate(app.screen.width, app.screen.height);
    }

    decrement() {
        if (!this.outOfMoney) {
            this.money -= this.wager;
            this.winTotal.text = `Coins: ${this.money}`;
        }
        if (this.money - this.wager < 0) {
            this.outOfMoney = true;
        }
    }

    increment(multiplier: number) {
        this.money += this.wager * multiplier;
        this.winTotal.text = `Coins: ${this.money}`;
        this.winAmount += this.wager;
        this.winAmountText.text = `Total: ${this.winAmount}`;
        if (this.outOfMoney) this.outOfMoney = false;
    }

    private generate(appWidth: number, appHeight: number) {
        const style = new PIXI.TextStyle({
            fontFamily: 'Courier',
            fontSize: 24,
            fill: '#ff33ee',
        });

        this.winTotal = new PIXI.Text(`Coins: ${this.money}`, style);
        this.winTotal.y = 5;

        const wagerText = new PIXI.Text(`Wager: ${this.wager}`, style);
        wagerText.y = this.winTotal.height + 10;

        this.winAmountText = new PIXI.Text(`Total: ${this.winAmount}`, style);
        this.winAmountText.y = wagerText.y + wagerText.height + 5;

        wagerText.x = this.winTotal.x = this.winAmountText.x = 10;

        const rect = new PIXI.Graphics();
        rect.beginFill(0x02474E, 0.6);
        const rectHeight = this.winTotal.height + wagerText.height + this.winAmountText.height + 25;
        rect.drawRect(0, 0, 160, rectHeight);
        rect.endFill();

        this.container.x = appWidth - rect.width - 150;
        this.container.y = appHeight / 2 - 25;
        this.container.addChild(rect, this.winTotal, wagerText, this.winAmountText);
    }
}
