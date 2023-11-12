# A slotty game

A simple slot machine game for my Burning Man camp. Credit for the base of this Pixi work goes to [asiryk](https://github.com/asiryk/slot-game), which I forked, but I needed a repo I could make private.

### [Live Demo](https://windusayles.github.io/slotty-machine/ 'Slut Machine')

---

#### What you need to run this code

1. Node (16.x)
2. npm (8.x)

#### How to run this code

1. Clone this repository
2. Open command line in the cloned folder,
   - To install dependencies, run `npm install`
   - To run the application for development, run `npm run serve`
3. Open [localhost:4200](http://localhost:4200/) in the browser

---

### Features

1. Winning:
   - Vertically
     - 3 Same symbols in Column
     - 1-2 Same symbols and others Wild
     - _**Note:**_ 3 Wilds is TOO wild and gives no points
   - Horizontally
     - 5 Same symbols in Row
     - 1-4 Same symbols and others Wild
     - **Note:** 5 Wilds is WAY too wild and will reset the game
2. Controls:
   - Return: Start new game, can be activated at any time
   - Space bar: Activates lever to spin reels; inactive when lever is inactive
   - Up/Down arrows: Increase/Decrease the wager amount while a game is active; amount is set between 1 and current money
