import { createNew } from 'typescript';
import Game from './core/Game';

document.addEventListener('keydown', (key) => {
  switch (key.code) {
    case 'ArrowDown':
    case 'ArrowUp':
    case 'Space':
      createNewGame();
      break;
  
    default:
      break;
  }
});

let gameHolder: Game;

function createNewGame() {
  if (gameHolder) gameHolder.app.destroy(true);
  
  gameHolder = new Game();
}
