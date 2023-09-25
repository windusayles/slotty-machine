# A slotty game
A simple slot machine game for my Burning Man camp.  Credit for the base of this Pixi work goes to [asiryk](https://github.com/asiryk/slot-game), which I forked, but I needed a repo I could make private.

### [Live Demo](https://windusayles.github.io/slotty-machine/ "Slut Machine")

---

#### What you need to run this code
1. Node (16.x)
2. npm (8.x)

#### How to run this code
1. Clone this repository
2. Open command line in the cloned folder,
   - To install dependencies, run ```npm install```
   - To run the application for development, run ```npm run serve```
3. Open [localhost:4200](http://localhost:4200/) in the browser

---

### Features
1. Winning: (3 symbols in a middle horizontal row)
   - 3 Same symbols
   - 2 Same symbols and 1 Wild
   - 2 Wilds and 1 any symbol
   - _**Note:**_ 3 Wilds counts as an extra half win
