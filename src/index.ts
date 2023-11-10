import Game from './core/Game';

document.addEventListener('keydown', (key) => {
  if (key.code === 'Enter') {
    document.querySelector('#hintText')?.remove();
    createNewGame();
  }
});

let gameHolder: Game;

function createNewGame() {
  if (gameHolder) gameHolder.app.destroy(true);
  
  gameHolder = new Game();
}
