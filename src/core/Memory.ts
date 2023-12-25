import * as PIXI from 'pixi.js';
import { animations as kinkAnims } from '../assets/kinkAnim.json';

interface Tile {
  isSelected: boolean;
  title: string;
  sprite: PIXI.Sprite;
}

export default class MemoryScreen {
  public container: PIXI.Container;
  private overlay: PIXI.Graphics;

  constructor(app: PIXI.Application) {
    this.container = new PIXI.Container();
    this.generate(app.screen.width, app.screen.height);
    this.setupMemoryGame(app);
  }

  show() {
    this.container.visible = true;
    this.initMemoryKeyboardControls();
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

    this.container.addChild(rect, this.overlay);
  }

  public setupMemoryGame(app: PIXI.Application) {
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

    //shuffle
    for (let i = 0; i < 48; i++) {
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

        const dynamicWidth = (app.screen.width - 100) / 6;
        const dynamicHeight = (app.screen.height - 100) / 4;
        const ratio = app.screen.width / app.screen.height;

        if (ratio <= 0.75) {
          sprite.width = dynamicWidth - 10;
          sprite.height = sprite.width * 2;
        } else {
          sprite.height = dynamicHeight - 10;
          sprite.width = sprite.height / 2;
        }
        sprite.position.x =
          (app.screen.width - sprite.width * 6) / 2 +
          i * (sprite.width + 10) -
          25;
        sprite.position.y =
          (app.screen.height - sprite.height * 4) / 2 +
          j * (sprite.height + 10) -
          25;
        sprite.tint = 0x000000;
        sprite.alpha = 0.5;

        this.container.addChild(sprite);

        const highlight = (input: string) => {
          if (!tile.isSelected) {
            if (input !== 'exit') {
              // add highlight to sprite
              sprite.alpha = 0.65;
            } else {
              // remove highlight
              sprite.alpha = 0.5;
            }
          }
        };

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
                      // remove canvas/game
                      const canvas = document.body.children[2];
                      document.body.removeChild(canvas);

                      const htmlContent = document.querySelector(
                        '#details'
                      ) as HTMLElement;
                      htmlContent.innerHTML = `<h1>You friggin did it, go get your reward!</h1>`;
                      htmlContent.className = 'flex-center';
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
        sprite.on('pointerover', () => {
          const name = sprite._texture.textureCacheIds[0];
          highlight(name);
        });
        sprite.on('pointerout', () => highlight('exit'));
      }
    }
  }

  private initMemoryKeyboardControls() {}
}
