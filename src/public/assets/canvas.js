"use strict";

const DUMMY_GRID_SIZE = newGame();
const game = new Board(DUMMY_GRID_SIZE);
const playerGuesses = create2dArray(DUMMY_GRID_SIZE);
const activeCell = {x: null, y: null};

const tower = document.getElementById("tower");
const tDraw = tower.getContext("2d");
const clickInfo = document.getElementById("click");
render();

window.onresize = function () {
   render();
}

window.onkeyup = function(e) {
   if (activeCell.x !== null && activeCell.y !== null) {
      const key = Number(e.key);
      if (key > 0 && key <= DUMMY_GRID_SIZE) {
         if (activeCell.x > 0 && activeCell.x <= DUMMY_GRID_SIZE && activeCell.y > 0 && activeCell.y <= DUMMY_GRID_SIZE) {
            updateBoard(key, activeCell.x, activeCell.y);
            activeCell.x = null;
            activeCell.y = null;
            render();
            document.getElementById("click2").textContent = ` | active cell: none`;
         }
      } else if (e.key === "Backspace" || e.key === "Delete") {
         if (activeCell.x > 0 && activeCell.x <= DUMMY_GRID_SIZE && activeCell.y > 0 && activeCell.y <= DUMMY_GRID_SIZE) {
            updateBoard(null, activeCell.x, activeCell.y);
            activeCell.x = null;
            activeCell.y = null;
            render();
            document.getElementById("click2").textContent = ` | active cell: none`;
         }
      } else if (DUMMY_GRID_SIZE === 10 && key === 0) {
         if (activeCell.x > 0 && activeCell.x <= DUMMY_GRID_SIZE && activeCell.y > 0 && activeCell.y <= DUMMY_GRID_SIZE) {
            updateBoard(10, activeCell.x, activeCell.y);
            activeCell.x = null;
            activeCell.y = null;
            render();
            document.getElementById("click2").textContent = ` | active cell: none`;
         }
      }

      if (deepCompare(game.gameBoard, playerGuesses)) {
         victory();
      }
   }
}

tower.onclick = function(e) {
   const clickedCell = calculateClickCoords(e);
   clearCanvas();
   drawGrid(DUMMY_GRID_SIZE);
   renderClues();

   if (deepCompare(game.gameBoard, playerGuesses)) {
      victory();
   }

   if (clickedCell.x > 0 && clickedCell.x <= DUMMY_GRID_SIZE && clickedCell.y > 0 && clickedCell.y <= DUMMY_GRID_SIZE) {
      activateCell(clickedCell, DUMMY_GRID_SIZE, true);
   } else {
      activateCell(activeCell, DUMMY_GRID_SIZE);
   }

   drawNumbers();
}

function resizeCanvas() {
   tower.width = document.getElementsByTagName("body")[0].clientWidth;
   tower.height = document.getElementsByTagName("body")[0].clientWidth;
}

function drawGrid(numCells) {
   const cellPixels = tower.width / (numCells + 2);

   for (let i = 1; i < numCells + 2; i++) {
      const stepSize = cellPixels * i;

      tDraw.beginPath();
      tDraw.moveTo(stepSize, cellPixels);
      tDraw.lineTo(stepSize, tower.width - cellPixels);
      tDraw.stroke();

      tDraw.beginPath();
      tDraw.moveTo(cellPixels, stepSize);
      tDraw.lineTo(tower.width - cellPixels, stepSize);
      tDraw.stroke();
   }
}

function calculateClickCoords(e) {
   const rect = tower.getBoundingClientRect();

   const x = e.clientX - rect.left;
   const y = e.clientY - rect.top;

   const cellPixels = tower.width / (DUMMY_GRID_SIZE + 2);
   const cellX = Math.floor(x/cellPixels);
   const cellY = Math.floor(y/cellPixels);

   clickInfo.textContent = `x: ${x}, y: ${y} | last clicked cell: (${cellX}, ${cellY})`;

   return {x: cellX, y: cellY};
}

function activateCell(cellCoords, numCells, fromClick) {
   if (cellCoords.x === null) {
      return;
   }

   if (fromClick && cellCoords.x === activeCell.x && cellCoords.y === activeCell.y) {
      activeCell.x = null;
      activeCell.y = null;

      document.getElementById("click2").textContent = ` | active cell: none`;

      render();
      return;
   }

   activeCell.x = cellCoords.x;
   activeCell.y = cellCoords.y;

   document.getElementById("click2").textContent = ` | active cell: (${activeCell.x}, ${activeCell.y})`;

   highlightCell(cellCoords, numCells, "#cccccc");
}

function highlightCell(cellCoords, numCells, color) {
   const cellPixels = tower.width / (numCells + 2);
   const x = cellCoords.x * cellPixels;
   const y = cellCoords.y * cellPixels;

   tDraw.fillStyle = color;
   tDraw.fillRect(x, y, cellPixels, cellPixels);
}

function clearCanvas() {
   tDraw.clearRect(0, 0, tower.width, tower.width);
}

function create2dArray(size) {
   const arr = new Array(size);

   for (let i = 0; i < size; i++) {
      arr[i] = new Array(size);
   }

   return arr;
}

// textObj {text, color, x, y}, size computed by function
function drawTextToCell(textObj, numCells) {
   const fontSize = tower.width / (2 * (numCells + 2));
   tDraw.font = `${fontSize}px Arial`;
   tDraw.fillStyle = textObj.color;
   tDraw.textAlign = "center";

   const x = (tower.width / (numCells + 2)) * (textObj.x + 0.5);
   const y = (tower.width / (numCells + 2)) * (textObj.y + 0.65);

   tDraw.fillText(textObj.text, x, y);
}

function drawNumbers() {
   for (let i = 0; i < playerGuesses.length; i++) {
      for (let j = 0; j < playerGuesses[i].length; j++) {
         if (typeof playerGuesses[j][i] === "number") {
            if (isDupe(j, i)) {
               placeNum(playerGuesses[j][i], "red", i + 1, j + 1);
            } else {
               placeNum(playerGuesses[j][i], "black", i + 1, j + 1);
            }
         }
      }
   }
}

function placeNum(num, color, x, y) {
   if (x > DUMMY_GRID_SIZE + 1 || y > DUMMY_GRID_SIZE + 1) {
      console.log("Attempted to draw number outside of the grid!");
      console.log(`Grid size: ${DUMMY_GRID_SIZE}, x: ${x}, y: ${y}`);
      return;
   }

   drawTextToCell({
      text: num,
      color: color,
      x: x,
      y: y
   }, DUMMY_GRID_SIZE);
}

function render() {
   resizeCanvas();
   clearCanvas();
   drawGrid(DUMMY_GRID_SIZE);
   renderClues();

   if (deepCompare(game.gameBoard, playerGuesses)) {
      victory();
   }

   activateCell(activeCell, DUMMY_GRID_SIZE);
   drawNumbers();
}

function updateBoard(guess, x, y) {
   playerGuesses[y - 1][x - 1] = guess;
}

function isDupe(x, y) {
   const value = playerGuesses[x][y];

   if (typeof value !== "number") {
      return false;
   }

   for (let i = 0; i < DUMMY_GRID_SIZE; i++) {
      if (playerGuesses[i][y] === value && i !== x) {
         return true;
      }

      if (playerGuesses[x][i] === value && i !== y) {
         return true;
      }
   }

   return false;
}

function renderClues() {
   for (let i = 0; i < DUMMY_GRID_SIZE; i++) {
      placeNum(game.clues[i], "gray", i + 1, 0);
      placeNum(game.clues[i + DUMMY_GRID_SIZE], "gray", DUMMY_GRID_SIZE + 1, i + 1);
      placeNum(game.clues[i + (2 * DUMMY_GRID_SIZE)], "gray", DUMMY_GRID_SIZE - i, DUMMY_GRID_SIZE + 1);
      placeNum(game.clues[i + (3 * DUMMY_GRID_SIZE)], "gray", 0, DUMMY_GRID_SIZE - i);
   }
}

function newGame() {
   let boardSize = Number(prompt("What size game board would you like?  (Enter between 4 and 10)"));

   if (typeof boardSize === "number" && boardSize >= 4 && boardSize <= 10) {
      return boardSize;
   } else {
      return newGame();
   }
}

function deepCompare(item1, item2) {
   let same = true;

   if (item1.length !== item2.length) {
      return false;
   }

   if (Array.isArray(item1) && Array.isArray(item2)) {
      for (let i = 0; i < item1.length; i++) {
         if (!item2[i]) {
            return false;
         }

         same = deepCompare(item1[i], item2[i]);

         if (!same) {
            return false;
         }
      }
   } else {
      item1 === item2 ? same = true : same = false;
   }

   return same;
}

function victory() {
   for (let i = 0; i < DUMMY_GRID_SIZE; i++) {
      for (let j = 0; j < DUMMY_GRID_SIZE; j++) {
         highlightCell({x: i + 1, y: j + 1}, DUMMY_GRID_SIZE, "#ccffcc");
      }
   }

   drawGrid(DUMMY_GRID_SIZE);
   drawNumbers();
}

function validateTopClue(clueNum, clueValue) {
   let visible = 0;
}