import * as PIXI from 'pixi.js';
import Loader from './Loader';
import PlayButton from './PlayButton';
// import Background from './Background';
import ReelsContainer, { WinLines } from './ReelsContainer';
import Scoreboard from './Scoreboard';
import VictoryScreen from './VictoryScreen';
import WinLineScreen from './WinLineScreen';
import LoseScreen from './LoseScreen';
import MemoryScreen from './Memory';

export default class Game {
  public app: PIXI.Application;
  public playBtn: PlayButton;
  private reelsContainer: ReelsContainer;
  private scoreboard: Scoreboard;
  private victoryScreen: VictoryScreen;
  private winLineScreen: WinLineScreen;
  private loseScreen: LoseScreen;
  private memoryScreen: MemoryScreen;

  constructor() {
    this.app = new PIXI.Application({
      width: document.body.clientWidth,
      height: document.body.clientHeight,
      // full screen TV values below
      // width: 1920,
      // height: 1080,
      backgroundAlpha: 0,
    });
    // before we turn on app resize, all hardcoded values for image sizes needs to be set as a percentage of app height/width
    // this.app.resizeTo = window;
    window.document.body.appendChild(this.app.view);
    new Loader(this.app, this.init.bind(this));
  }

  private init() {
    // this.createScene();
    this.createPlayButton();
    this.createReels();
    this.createScoreboard();
    // this.createVictoryScreen();
    this.createLoseScreen();
    this.createMemoryScreen();
  }

  // private createScene() {
  //   const bg = new Background(this.app.loader);
  //   this.app.stage.addChild(bg.sprite);
  // }

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

  private createMemoryScreen() {
    this.memoryScreen = new MemoryScreen(this.app);
    this.app.stage.addChild(this.memoryScreen.container);
  }

  handleStart() {
    this.scoreboard.decrement();
    this.playBtn.setDisabled();
    this.reelsContainer.spin().then(this.processSpinResult.bind(this));
  }

  private processSpinResult(spinResult: WinLines) {
    this.scoreboard.increment(spinResult.winTotal);
    if (this.scoreboard.hitTheJackpot) {
      this.playMemoryGame();
    } else {
      if (spinResult.winTotal) {
        this.createVictoryScreen(spinResult.winTotal * this.scoreboard.wager);
        this.victoryScreen.show();
        // add a highlight for each win line
        // this.createWinLineScreen(spinResult);
      }

      if (!this.scoreboard.outOfMoney) {
        this.playBtn.setEnabled();
      } else {
        this.loseScreen.show();
      }
    }
  }

  private playMemoryGame() {
    this.playBtn.setDisabled();
    this.memoryScreen.show();
    this.reelsContainer.container.visible = false;
    this.scoreboard.container.visible = false;
    this.playBtn.hide();
  }
}
