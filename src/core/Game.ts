import * as PIXI from 'pixi.js';
import Loader from './Loader';
import PlayButton from './PlayButton';
import Background from './Background';
import ReelsContainer from './ReelsContainer';
import Scoreboard from './Scoreboard';
import VictoryScreen from './VictoryScreen';

export default class Game {
    public app: PIXI.Application;
    private playBtn: PlayButton;
    private reelsContainer: ReelsContainer;
    private scoreboard: Scoreboard;
    private victoryScreen: VictoryScreen;

    constructor() {
        this.app = new PIXI.Application({ width: 1590, height: 1380 });
        window.document.body.appendChild(this.app.view);
        new Loader(this.app, this.init.bind(this));
    }

    private init() {
        this.createScene();
        this.createPlayButton();
        this.createReels();
        this.createScoreboard();
        this.createVictoryScreen();
    }

    private createScene() {
        const bg = new Background(this.app.loader);
        this.app.stage.addChild(bg.sprite);
    }

    private createPlayButton() {
        this.playBtn = new PlayButton(this.app, this.handleStart.bind(this));
        this.app.stage.addChild(this.playBtn.sprite);
    }

    private createReels() {
        this.reelsContainer = new ReelsContainer(this.app);
        this.app.stage.addChild(this.reelsContainer.container);
    }

    private createScoreboard() {
        this.scoreboard = new Scoreboard(this.app);
        this.app.stage.addChild(this.scoreboard.container);
    }

    private createVictoryScreen() {
        this.victoryScreen = new VictoryScreen(this.app);
        this.app.stage.addChild(this.victoryScreen.container);
    }

    handleStart() {
        this.scoreboard.decrement();
        this.playBtn.setDisabled();
        this.reelsContainer.spin()
            .then(this.processSpinResult.bind(this));
    }

    private processSpinResult(isWin: number) {
        // this method needs to accept more complex scenarios, not just win or lose (true/false)
        if (isWin) {
            // increment by how much?
            let multiplier = isWin;

            this.scoreboard.increment(multiplier);
            this.victoryScreen.show();
        }

        if (!this.scoreboard.outOfMoney) this.playBtn.setEnabled();
    }
}
