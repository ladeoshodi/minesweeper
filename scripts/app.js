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
  flag: "🚩",
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
  if (board[randomNumber] !== minesweeper.mine) {
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
}

function gameOver() {
  gameBoard.forEach((cell) => {
    cell.removeEventListener("click", revealCell);
    cell.removeEventListener("contextmenu", flagCell);
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

function revealAdjacentBlankSquares(level, position, startPos) {
  // let traverseUp = startPos
  // traverse up
  if (canMoveToTop(position, gameMode[level].gridWidth)) {
    position -= gameMode[level].gridWidth;
    if (gameBoardHidden[position] === minesweeper.blank) {
      gameBoard[position].classList.add("blank");
      return revealAdjacentBlankSquares(level, position, startPos);
    } else {
      gameBoard[position].classList.add("safe");
    }
  }
  return;
  //   function traverseHelper(position) {}
}

function revealCell(e) {
  const cellIndex = e.target.dataset.index;
  const level = gridEl.dataset.level;
  if (!gameBoard[cellIndex].classList.contains("flag")) {
    gameBoard[cellIndex].textContent = gameBoardHidden[cellIndex];
    if (gameBoardHidden[cellIndex] === minesweeper.mine) {
      gameBoard[cellIndex].id = "active-mine";
      revealAllMines();
      gameOver();
    } else if (gameBoardHidden[cellIndex] === minesweeper.blank) {
      gameBoard[cellIndex].classList.add("blank");
      // call recursive function
      revealAdjacentBlankSquares(level, cellIndex, cellIndex);
    } else {
      gameBoard[cellIndex].classList.add("safe");
    }
  }
}

function flagCell(e) {
  e.preventDefault();
  const cellIndex = e.target.dataset.index;
  if (
    !gameBoard[cellIndex].classList.contains("blank") &&
    !gameBoard[cellIndex].classList.contains("safe")
  ) {
    gameBoard[cellIndex].classList.toggle("flag");
    if (gameBoard[cellIndex].classList.contains("flag")) {
      gameBoard[cellIndex].textContent = minesweeper.flag;
    } else {
      gameBoard[cellIndex].textContent = "";
    }
  }
}

function displayGame(level) {
  gridEl.dataset.level = gameMode[level].level;
  for (let i = 0; i < gameMode[level].gridSize; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.dataset.index = i;
    cell.addEventListener("click", revealCell);
    cell.addEventListener("contextmenu", flagCell);
    gameBoard.push(cell);
    gridEl.appendChild(cell);
  }
}

loadGameBoardHidden("beginner");
displayGame("beginner");

// todo: For Debugging minesweeper game (remove later)
function displayGameBoardHidden() {
  gameBoard.forEach((cell, index) => {
    cell.textContent = gameBoardHidden[index];
  });
}

// todo: remove this
console.log(gameBoardHidden);

displayGameBoardHidden();
