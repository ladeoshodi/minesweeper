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

function canMoveToTop(position, gridWidth) {
  return position >= gridWidth;
}
function canMoveToTopRight(position, gridWidth) {
  return position >= gridWidth && (position + 1) % gridWidth !== 0;
}
function canMoveToTopLeft(position, gridWidth) {
  return position >= gridWidth && position % gridWidth !== 0;
}
function canMoveToRight(position, gridWidth) {
  return (position + 1) % gridWidth !== 0;
}
function canMoveToLeft(position, gridWidth) {
  return position % gridWidth !== 0;
}
function canMoveToBottom(position, gridWidth, gridSize) {
  return position + gridWidth < gridSize;
}
function canMoveToBottomRight(position, gridWidth, gridSize) {
  return position + gridWidth < gridSize && (position + 1) % gridWidth !== 0;
}
function canMoveToBottomLeft(position, gridWidth, gridSize) {
  return position + gridWidth < gridSize && position % gridWidth !== 0;
}

function countAdjacentMines(level, startPos) {
  let mineCount = 0;
  let newPosition;
  // count top
  if (canMoveToTop(startPos, gameMode[level].gridWidth)) {
    newPosition = startPos - gameMode[level].gridWidth;
    if (minesweeperBoard[newPosition] === minesweeper.mine) {
      mineCount += 1;
    }
  }
  // count top right
  if (canMoveToTopRight(startPos, gameMode[level].gridWidth)) {
    newPosition = startPos + 1 - gameMode[level].gridWidth;
    if (minesweeperBoard[newPosition] === minesweeper.mine) {
      mineCount += 1;
    }
  }
  // count right
  if (canMoveToRight(startPos, gameMode[level].gridWidth)) {
    newPosition = startPos + 1;
    if (minesweeperBoard[newPosition] === minesweeper.mine) {
      mineCount += 1;
    }
  }
  // count bottom right
  if (
    canMoveToBottomRight(
      startPos,
      gameMode[level].gridWidth,
      gameMode[level].gridSize
    )
  ) {
    newPosition = startPos + gameMode[level].gridWidth + 1;
    if (minesweeperBoard[newPosition] === minesweeper.mine) {
      mineCount += 1;
    }
  }
  // count bottom
  if (
    canMoveToBottom(
      startPos,
      gameMode[level].gridWidth,
      gameMode[level].gridSize
    )
  ) {
    newPosition = startPos + gameMode[level].gridWidth;
    if (minesweeperBoard[newPosition] === minesweeper.mine) {
      mineCount += 1;
    }
  }
  // count bottom left
  if (
    canMoveToBottomLeft(
      startPos,
      gameMode[level].gridWidth,
      gameMode[level].gridSize
    )
  ) {
    newPosition = startPos - 1 + gameMode[level].gridWidth;
    if (minesweeperBoard[newPosition] === minesweeper.mine) {
      mineCount += 1;
    }
  }
  // count left
  if (canMoveToLeft(startPos, gameMode[level].gridWidth)) {
    newPosition = startPos - 1;
    if (minesweeperBoard[newPosition] === minesweeper.mine) {
      mineCount += 1;
    }
  }
  // count top left
  if (canMoveToTopLeft(startPos, gameMode[level].gridWidth)) {
    newPosition = startPos - gameMode[level].gridWidth - 1;
    if (minesweeperBoard[newPosition] === minesweeper.mine) {
      mineCount += 1;
    }
  }
  return mineCount;
}

function loadMinesweeperBoard(level) {
  minesweeperBoard = new Array(gameMode[level].gridSize).fill(
    minesweeper.blank
  );

  function helper(mines) {
    if (mines === 0) return;

    const randomNumber = Math.floor(Math.random() * gameMode[level].gridSize);
    if (
      minesweeperBoard[randomNumber] !== minesweeper.mine &&
      countAdjacentMines(level, randomNumber) < 3
    ) {
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
