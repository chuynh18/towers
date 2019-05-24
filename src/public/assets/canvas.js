"use strict";

const DUMMY_GRID_SIZE = 5;

const tower = document.getElementById("tower");
const tDraw = tower.getContext("2d");
const clickInfo = document.getElementById("click");
resizeCanvas();
drawGrid(DUMMY_GRID_SIZE);

window.onresize = function () {
   resizeCanvas();
   clearCanvas();
   drawGrid(DUMMY_GRID_SIZE);
}

tower.onclick = function(e) {
   const rect = tower.getBoundingClientRect();

   const x = e.clientX - rect.left;
   const y = e.clientY - rect.top;

   const cellPixels = tower.width / (DUMMY_GRID_SIZE + 2);
   const cellX = Math.floor((x - cellPixels)/cellPixels);
   const cellY = Math.floor((y - cellPixels)/cellPixels);

   clickInfo.textContent = `Click! | x: ${x}, y: ${y} | cell: (${cellX}, ${cellY})`;
}

function resizeCanvas() {
   tower.width = document.getElementsByTagName("body")[0].clientWidth;
   tower.height = document.getElementsByTagName("body")[0].clientWidth;
}

function drawGrid(numCells) {
   const cellPixels = tower.width / (numCells + 2);

   for (let i = 0; i < numCells + 3; i++) {
      const stepSize = cellPixels * i;

      tDraw.beginPath();
      tDraw.moveTo(stepSize, 0);
      tDraw.lineTo(stepSize, tower.width);
      tDraw.stroke();

      tDraw.beginPath();
      tDraw.moveTo(0, stepSize);
      tDraw.lineTo(tower.width, stepSize);
      tDraw.stroke();
   }
}

function clearCanvas() {
   tDraw.clearRect(0, 0, tower.width, tower.width);
}