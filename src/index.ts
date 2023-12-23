import Game from './core/Game';

document.addEventListener('keydown', (key) => {
  if (key.code === 'Enter') {
    document.querySelector('#hintText')?.remove();
    document.removeEventListener('pointerup', clickStartOnce);
    createNewGame();
  }
});

document.addEventListener('pointerup', clickStartOnce);

function clickStartOnce() {
  createNewGame();
  document.removeEventListener('pointerup', clickStartOnce);
}

let currentGame: Game;

function createNewGame() {
  if (currentGame) currentGame.app.destroy(true, { children: true });
  const welcome = document.querySelector('#welcome') as Element;
  welcome.className = 'hide';

  currentGame = new Game();
}
