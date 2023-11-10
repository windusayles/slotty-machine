import { createNew } from 'typescript';
import Game from './core/Game';

document.addEventListener('keydown', (key) => {
  if (key.code === 'Enter') createNewGame();
  const hintText = document.querySelector('#hintText');
  hintText?.remove();
});

let gameHolder: Game;

function createNewGame() {
  if (gameHolder) gameHolder.app.destroy(true);
  
  gameHolder = new Game();
}
