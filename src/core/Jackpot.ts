import * as PIXI from 'pixi.js';
import { animations as kinkAnims } from '../assets/kinkIncSpriteSheet.json';

interface Tile {
  isSelected: boolean;
  title: string;
  sprite: PIXI.Sprite;
}

export default class JackpotScreen {
  public container: PIXI.Container;
  private overlay: PIXI.Graphics;

  constructor(app: PIXI.Application) {
    this.container = new PIXI.Container();
    this.generate(app.screen.width, app.screen.height);
    this.playConcentration(app);
  }

  show() {
    this.container.visible = true;
    const id = window.setTimeout(this.hide.bind(this), 300000); // 5 minutes
    const handler = () => {
      window.clearTimeout(id);
      this.hide();
    };
  }

  hide() {
    this.container.visible = false;
  }

  private generate(appWidth: number, appHeight: number) {
    this.container.visible = false;

    this.overlay = new PIXI.Graphics();
    this.overlay.beginFill(0xffffff, 0.001);
    this.overlay.drawRect(0, 0, appWidth, appHeight);
    this.overlay.endFill();
    this.overlay.interactive = true;
    this.overlay.buttonMode = true;
    this.overlay.cursor = 'default';

    const rect = new PIXI.Graphics();
    rect.beginFill(0x02474e, 1);
    rect.drawRect(0, 0, appWidth - 50, appHeight - 50);
    rect.x = 25;
    rect.y = 25;
    rect.endFill();

    // const style = new PIXI.TextStyle({
    //   fontFamily: 'Courier',
    //   fontSize: 96,
    //   fill: '#ff33ee',
    // });

    // const text = new PIXI.Text('JACKPOT, BABY!', style);
    // text.x = (appWidth - text.width) / 2;
    // text.y = (appHeight - text.height) / 2;

    // add back text between rect and overlay
    this.container.addChild(rect, this.overlay);
  }

  public playConcentration(app: PIXI.Application) {
    const texturePool: string[] = [];
    let animationCount = 0;
    Object.values(kinkAnims).forEach((list) => {
      let scenes = list.length;
      animationCount += scenes;
      while (scenes) {
        texturePool.push(list[--scenes]);
      }
    });
    let firstTile: Tile = {
      isSelected: false,
      title: '',
      sprite: null as unknown as PIXI.Sprite,
    };
    let secondTile: Tile = {
      isSelected: false,
      title: '',
      sprite: null as unknown as PIXI.Sprite,
    };
    let canPick = true;

    /**
     * chosenTiles is an array of index pairs to pick from texturePool
     */
    let chosenTiles: number[] = [];
    while (chosenTiles.length < 24) {
      //choose 12 random indices
      const randIndex = Math.floor(Math.random() * animationCount);
      if (chosenTiles.indexOf(randIndex) === -1) {
        chosenTiles.push(randIndex, randIndex);
        // choose below list for faster testing
        // chosenTiles.push(
        //   randIndex,
        //   randIndex,
        //   randIndex,
        //   randIndex,
        //   randIndex,
        //   randIndex,
        //   randIndex,
        //   randIndex,
        //   randIndex,
        //   randIndex,
        //   randIndex,
        //   randIndex,
        //   randIndex,
        //   randIndex,
        //   randIndex,
        //   randIndex,
        //   randIndex,
        //   randIndex,
        //   randIndex,
        //   randIndex,
        //   randIndex,
        //   randIndex,
        //   randIndex,
        //   randIndex
        // );
      }
    }

    for (let i = 0; i < 48; i++) {
      //shuffle
      const from = Math.floor(Math.random() * 24);
      const to = Math.floor(Math.random() * 24);
      const tmp: number = chosenTiles[from];
      chosenTiles[from] = chosenTiles[to];
      chosenTiles[to] = tmp;
    }

    for (let i = 0; i < 6; i++) {
      for (let j = 0; j < 4; j++) {
        const index = chosenTiles[i * 4 + j];
        const sprite = new PIXI.Sprite(
          app.loader.resources.kinkInc!.textures![texturePool[index]]
        );
        const tile: Tile = {
          isSelected: false,
          title: texturePool[index],
          sprite,
        };
        sprite.buttonMode = true;
        sprite.interactive = true;
        sprite.width = 100;
        sprite.height = 200;
        sprite.position.x = 400 + i * 110;
        sprite.position.y = 50 + j * 210;
        sprite.tint = 0x000000;
        sprite.alpha = 0.5;

        this.container.addChild(sprite);

        const listenerFunction = () => {
          console.log(sprite._texture.textureCacheIds[0]); // for easily identifying who we clicked on in dev mode
          if (canPick) {
            if (!tile.isSelected) {
              sprite.tint = 0xffffff;
              sprite.alpha = 1;
              tile.isSelected = true;
              if (!firstTile.title) {
                firstTile = tile;
              } else {
                secondTile = tile;
                canPick = false;
                if (firstTile.title && firstTile.title === secondTile.title) {
                  setTimeout((container = this.container) => {
                    container.removeChild(firstTile.sprite);
                    container.removeChild(secondTile.sprite);
                    firstTile = {} as unknown as Tile;
                    secondTile = {} as unknown as Tile;
                    canPick = true;
                    // only 2 graphics were in at start,
                    // this should be a final win condition
                    if (container.children.length === 2) {
                      this.hide();
                      const htmlContent = document.querySelector(
                        '#details'
                      ) as HTMLElement;
                      htmlContent.innerHTML = `<h1>You friggin did it, go get your reward!</h1>`;
                      htmlContent.className = '';
                      app.destroy();
                    }
                  }, 1000);
                } else {
                  setTimeout(function () {
                    firstTile.isSelected = false;
                    secondTile.isSelected = false;
                    firstTile.sprite.tint = 0x000000;
                    firstTile.sprite.alpha = 0.5;
                    secondTile.sprite.tint = 0x000000;
                    secondTile.sprite.alpha = 0.5;
                    firstTile = {} as unknown as Tile;
                    secondTile = {} as unknown as Tile;
                    canPick = true;
                  }, 1000);
                }
              }
            }
          }
        };

        sprite.on('mousedown', listenerFunction);
      }
    }
  }
}
