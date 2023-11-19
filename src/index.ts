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
  document.removeEventListener('pointerup', clickStartOnce);
}

let gameHolder: Game;

function createNewGame() {
  if (gameHolder) gameHolder.app.destroy(true);
  const details = document.querySelector('#details') as Element;
  details.className = 'hide';

  const playerInfo = document.querySelector('#playerInfo') as Element;
  playerInfo.className = '';
  gameHolder = new Game();
}
