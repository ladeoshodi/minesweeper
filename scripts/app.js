const gridEl = document.querySelector(".grid");

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

const minesweeper = {
  mine: "X",
  blank: 0,
};

let minesweeperBoard;
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

function loadMinesweeperBoard(level) {
  minesweeperBoard = new Array(gameMode[level].gridSize).fill(
    minesweeper.blank
  );

  function helper(mines) {
    if (mines === 0) return;

    const randomNumber = Math.floor(Math.random() * gameMode[level].gridSize);
    if (minesweeperBoard[randomNumber] !== minesweeper.mine) {
      minesweeperBoard[randomNumber] = minesweeper.mine;
      mines--;
    }

    return helper(mines);
  }

  helper(gameMode[level].mines);
  // todo: remove this
  console.log(minesweeperBoard);
}

displayGame("beginner");
loadMinesweeperBoard("beginner");
