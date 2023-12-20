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

### Instructions

1. Winning:
   - Wager Multiplier
     - Your wager amount will deduct from Total
     - Win amount is 10x, 5x, 2x, or 1x wager amount
   - Vertically
     - 3 Same symbols in Column is minimum win, 1x
     - No wild bonus
   - Horizontally
     - 7 Same symbols in Row is best win, 10x
     - 1-6 Same symbols and others Wild is next best win, 5x
     - A mix of Wild(s) and only 2 other symbols is minor win, 2x
     - A mix of Wild(s) and only 3 other symbols is a minimum win, 1x
     - **Note:** 7 Wilds is WAY too wild and will reset the game
2. Controls:
   - Return: Start new game, can be activated at any time
   - Space bar: Activates lever to spin reels; inactive when lever is inactive
   - W/S keys: Increase/Decrease the wager amount while a game is active; amount is constrained between 1 and current Total
