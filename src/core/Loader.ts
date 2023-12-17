import * as PIXI from 'pixi.js';

export default class Loader {
  public loader: PIXI.Loader;
  private loadingScreen: PIXI.Text;

  constructor(app: PIXI.Application, onAssetsLoaded: () => void) {
    this.loader = app.loader;
    this.loadAssets();
    this.loader.load(() => {
      app.stage.removeChild(this.loadingScreen);
      onAssetsLoaded();
    });
    this.generateLoadingScreen(app.screen.width, app.screen.height);
    app.stage.addChild(this.loadingScreen);
  }

  private loadAssets() {
    this.loader.add('atlas', './assets/atlas.json');
    this.loader.add('Assa1', './assets/kinkInc/Assa1.png');
    this.loader.add('Assa2', './assets/kinkInc/Assa2.png');
    this.loader.add('Dick1', './assets/kinkInc/Dick1.png');
    this.loader.add('Dick2', './assets/kinkInc/Dick2.png');
    this.loader.add('Dick3', './assets/kinkInc/Dick3.png');
    this.loader.add('Doll1', './assets/kinkInc/Doll1.png');
    this.loader.add('Doll2', './assets/kinkInc/Doll2.png');
  }

  private generateLoadingScreen(appWidth: number, appHeight: number) {
    const style = new PIXI.TextStyle({
      fontFamily: 'Arial',
      fontSize: 36,
      fontWeight: 'bold',
      fill: '#ffffff',
    });
    const playText = new PIXI.Text('Loading Sluts ...', style);
    playText.x = (appWidth - playText.width) / 2;
    playText.y = (appHeight - playText.height) / 2;
    this.loadingScreen = playText;
  }
}
