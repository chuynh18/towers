"use strict";

const DUMMY_GRID_SIZE = 5;
const playerGuesses = create2dArray(DUMMY_GRID_SIZE);
const activeCell = {x: null, y: null};

const tower = document.getElementById("tower");
const tDraw = tower.getContext("2d");
const clickInfo = document.getElementById("click");
resizeCanvas();
drawGrid(DUMMY_GRID_SIZE);

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
      }
   }
}

tower.onclick = function(e) {
   const clickedCell = calculateClickCoords(e);
   clearCanvas();
   drawGrid(DUMMY_GRID_SIZE);

   if (clickedCell.x > 0 && clickedCell.x <= DUMMY_GRID_SIZE && clickedCell.y > 0 && clickedCell.y <= DUMMY_GRID_SIZE) {
      activateClickedCell(clickedCell, DUMMY_GRID_SIZE, true);
   } else {
      activateClickedCell(activeCell, DUMMY_GRID_SIZE);
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

function activateClickedCell(cellCoords, numCells, fromClick) {
   if (cellCoords.x === null) {
      return;
   }

   if (fromClick && cellCoords.x === activeCell.x && cellCoords.y === activeCell.y) {
      activeCell.x = null;
      activeCell.y = null;

      document.getElementById("click2").textContent = ` | active cell: none`;

      clearCanvas();
      drawGrid(DUMMY_GRID_SIZE);
      return;
   }

   activeCell.x = cellCoords.x;
   activeCell.y = cellCoords.y;

   document.getElementById("click2").textContent = ` | active cell: (${activeCell.x}, ${activeCell.y})`;

   const cellPixels = tower.width / (numCells + 2);
   const x = cellCoords.x * cellPixels;
   const y = cellCoords.y * cellPixels;

   tDraw.fillStyle = "#cccccc";
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
         if (typeof playerGuesses[i][j] === "number") {
            placeNum(playerGuesses[i][j], "black", i + 1, j + 1);
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
   activateClickedCell(activeCell, DUMMY_GRID_SIZE);
   drawNumbers();
}

function updateBoard(guess, x, y) {
   playerGuesses[x - 1][y - 1] = guess;
}

function isDupe(x, y) {
   const value = playerGuesses[x][y];

   if (typeof value !== "number") {
      return false;
   }

   for (let i = 0; i < DUMMY_GRID_SIZE; i++) {
      
   }

   return false;
}