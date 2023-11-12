import Game from './core/Game';

document.addEventListener('keydown', (key) => {
  if (key.code === 'Enter') {
    document.querySelector('#hintText')?.remove();
    createNewGame();
  }
});
document.addEventListener('pointerup', clickStartOnce);

function clickStartOnce() {
  createNewGame();
  document.querySelector('#hintText')?.remove();
  document.removeEventListener('pointerup', clickStartOnce);
}

let gameHolder: Game;

function createNewGame() {
  if (gameHolder) gameHolder.app.destroy(true);
  const playerInfo = document.querySelector('.hide-on-start') as Element;
  playerInfo.className = '';
  gameHolder = new Game();
}
