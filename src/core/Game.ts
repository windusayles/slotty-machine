import * as PIXI from 'pixi.js';
import Loader from './Loader';
import PlayButton from './PlayButton';
import Background from './Background';
import ReelsContainer, { WinLines } from './ReelsContainer';
import Scoreboard from './Scoreboard';
import VictoryScreen from './VictoryScreen';
import WinLineScreen from './WinLineScreen';
import LoseScreen from './LoseScreen';

export default class Game {
  public app: PIXI.Application;
  public playBtn: PlayButton;
  private reelsContainer: ReelsContainer;
  private scoreboard: Scoreboard;
  private victoryScreen: VictoryScreen;
  private winLineScreen: WinLineScreen;
  private loseScreen: LoseScreen;

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
    // this.createVictoryScreen();
    this.createLoseScreen();
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
    this.scoreboard = new Scoreboard(this.app, this.playBtn);
    this.app.stage.addChild(this.scoreboard.container);
  }

  private createVictoryScreen(winTotal: number) {
    this.victoryScreen = new VictoryScreen(this.app, winTotal);
    this.app.stage.addChild(this.victoryScreen.container);
  }

  private createWinLineScreen(winResult: WinLines) {
    // winResult = {
    //   top: 1,
    //   middle: 1,
    //   bottom: 1,
    //   left: 1,
    //   center: 1,
    //   right: 1,
    //   right2: 1,
    //   right3: 1,
    //   // backSlash: 1,
    //   // slash: 1,
    //   winTotal: 0,
    // };
    this.winLineScreen = new WinLineScreen(this.app, winResult);
    this.app.stage.addChild(this.winLineScreen.container);
  }

  private createLoseScreen() {
    this.loseScreen = new LoseScreen(this.app);
    this.app.stage.addChild(this.loseScreen.container);
  }

  handleStart() {
    this.scoreboard.decrement();
    this.playBtn.setDisabled();
    this.reelsContainer.spin().then(this.processSpinResult.bind(this));
  }

  private processSpinResult(spinResult: WinLines) {
    if (spinResult.winTotal) {
      this.scoreboard.increment(spinResult.winTotal);
      this.createVictoryScreen(spinResult.winTotal * this.scoreboard.wager);
      this.victoryScreen.show();
      // add a highlight for each win line
      this.createWinLineScreen(spinResult);
    }

    if (!this.scoreboard.outOfMoney) {
      this.playBtn.setEnabled();
    } else {
      this.loseScreen.show();
    }
  }
}
