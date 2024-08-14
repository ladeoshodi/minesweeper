const gridEl = document.querySelector(".grid");

const gameboardHidden = [];
const gameMode = {
  beginner: {
    level: "beginner",
    gridWidth: 9,
    gridLength: 9,
    mines: 10,
    get gridSize() {
      return this.gridWidth * this.gridLength;
    },
  },
};

let timer = 0;

function displayGame(level) {
  for (let i = 0; i < gameMode[level].gridSize; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.dataset.cellPosition = i;
    // todo: remove this
    cell.textContent = i;
    gridEl.appendChild(cell);
  }
}

displayGame("beginner");
