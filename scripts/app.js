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
  mine: "💣",
  blank: "",
};

const gameBoard = [];
let gameBoardHidden;
let timer = 0;

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
    if (gameBoardHidden[newPosition] === minesweeper.mine) {
      mineCount += 1;
    }
  }
  // count top right
  if (canMoveToTopRight(startPos, gameMode[level].gridWidth)) {
    newPosition = startPos + 1 - gameMode[level].gridWidth;
    if (gameBoardHidden[newPosition] === minesweeper.mine) {
      mineCount += 1;
    }
  }
  // count right
  if (canMoveToRight(startPos, gameMode[level].gridWidth)) {
    newPosition = startPos + 1;
    if (gameBoardHidden[newPosition] === minesweeper.mine) {
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
    if (gameBoardHidden[newPosition] === minesweeper.mine) {
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
    if (gameBoardHidden[newPosition] === minesweeper.mine) {
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
    if (gameBoardHidden[newPosition] === minesweeper.mine) {
      mineCount += 1;
    }
  }
  // count left
  if (canMoveToLeft(startPos, gameMode[level].gridWidth)) {
    newPosition = startPos - 1;
    if (gameBoardHidden[newPosition] === minesweeper.mine) {
      mineCount += 1;
    }
  }
  // count top left
  if (canMoveToTopLeft(startPos, gameMode[level].gridWidth)) {
    newPosition = startPos - gameMode[level].gridWidth - 1;
    if (gameBoardHidden[newPosition] === minesweeper.mine) {
      mineCount += 1;
    }
  }
  return mineCount;
}
function loadMines(level, board, mines) {
  if (mines === 0) return;

  const randomNumber = Math.floor(Math.random() * gameMode[level].gridSize);
  if (
    board[randomNumber] !== minesweeper.mine &&
    countAdjacentMines(level, randomNumber) < 3
  ) {
    board[randomNumber] = minesweeper.mine;
    mines--;
  }

  return loadMines(level, board, mines);
}
function loadGameBoardHidden(level) {
  gameBoardHidden = new Array(gameMode[level].gridSize).fill(minesweeper.blank);

  // load mines
  loadMines(level, gameBoardHidden, gameMode[level].mines);

  // count adjacent bombs
  gameBoardHidden.forEach((cell, index, arr) => {
    if (cell !== minesweeper.mine && countAdjacentMines(level, index)) {
      arr[index] = countAdjacentMines(level, index);
    }
  });

  // todo: remove this
  console.log(gameBoardHidden);
}

function displayGameBoardHidden() {
  gameBoard.forEach((cell, index) => {
    cell.textContent = gameBoardHidden[index];
  });
}

function revealAllMines() {
  gameBoardHidden.forEach((cell, index) => {
    if (cell === minesweeper.mine) {
      gameBoard[index].textContent = cell;
      gameBoard[index].classList.add("mine");
    }
  });
}

function revealCell(e) {
  gameBoard[e.target.dataset.index].textContent =
    gameBoardHidden[e.target.dataset.index];
  if (gameBoardHidden[e.target.dataset.index] === minesweeper.mine) {
    gameBoard[e.target.dataset.index].id = "active-mine";
    revealAllMines();
  }
}

function displayGame(level) {
  for (let i = 0; i < gameMode[level].gridSize; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.dataset.index = i;
    cell.addEventListener("click", revealCell);
    gameBoard.push(cell);
    gridEl.appendChild(cell);
  }
}

loadGameBoardHidden("beginner");
displayGame("beginner");
// displayGameBoardHidden();
