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

function revealAdjacentBlankSquares(level, startPos) {
  const traverse = {
    up: startPos,
    topRight: startPos,
    right: startPos,
    bottomRight: startPos,
    bottom: startPos,
    bottomLeft: startPos,
    left: startPos,
    topLeft: startPos,
    get canMoveUp() {
      return (
        canMoveToTop(this.up, gameMode[level].gridWidth) &&
        gameBoardHidden[this.up] === minesweeper.blank
      );
    },
    get canMoveTopRight() {
      return (
        canMoveToTopRight(this.topRight, gameMode[level].gridWidth) &&
        gameBoardHidden[this.topRight] === minesweeper.blank
      );
    },
    get canMoveRight() {
      return (
        canMoveToRight(this.right, gameMode[level].gridWidth) &&
        gameBoardHidden[this.right] === minesweeper.blank
      );
    },
    get canMoveBottomRight() {
      return (
        canMoveToBottomRight(
          this.bottomRight,
          gameMode[level].gridWidth,
          gameMode[level].gridSize
        ) && gameBoardHidden[this.bottomRight] === minesweeper.blank
      );
    },
    get canMoveBottom() {
      return (
        canMoveToBottom(
          this.bottom,
          gameMode[level].gridWidth,
          gameMode[level].gridSize
        ) && gameBoardHidden[this.bottom] === minesweeper.blank
      );
    },
    get canMoveBottomLeft() {
      return (
        canMoveToBottomLeft(
          this.bottomLeft,
          gameMode[level].gridWidth,
          gameMode[level].gridSize
        ) && gameBoardHidden[this.bottomLeft] === minesweeper.blank
      );
    },
    get canMoveLeft() {
      return (
        canMoveToLeft(this.left, gameMode[level].gridWidth) &&
        gameBoardHidden[this.left] === minesweeper.blank
      );
    },
    get canMoveTopLeft() {
      return (
        canMoveToTopLeft(this.topLeft, gameMode[level].gridWidth) &&
        gameBoardHidden[this.topLeft] === minesweeper.blank
      );
    },
  };

  function revealSquare(position) {
    if (gameBoardHidden[position] === minesweeper.blank) {
      gameBoard[position].classList.add("blank");
    } else {
      gameBoard[position].classList.add("safe");
      gameBoard[position].textContent = gameBoardHidden[position];
    }
  }

  function revealAdjacentCellsHelper(position) {
    let newPosition;
    // reveal top square
    if (traverse.canMoveUp) {
      newPosition = position - gameMode[level].gridWidth;
      revealSquare(newPosition);
    }
    // reveal top right square
    if (traverse.canMoveTopRight) {
      newPosition = position + 1 - gameMode[level].gridWidth;
      revealSquare(newPosition);
    }
    // reveal right square
    if (traverse.canMoveRight) {
      newPosition = position + 1;
      revealSquare(newPosition);
    }
    // reveal bottom right square
    if (traverse.canMoveBottomRight) {
      newPosition = position + gameMode[level].gridWidth + 1;
      revealSquare(newPosition);
    }
    // reveal bottom
    if (traverse.canMoveBottom) {
      newPosition = position + gameMode[level].gridWidth;
      revealSquare(newPosition);
    }
    // reveal bottom left
    if (traverse.canMoveBottomLeft) {
      newPosition = position - 1 + gameMode[level].gridWidth;
      revealSquare(newPosition);
    }
    // reveal left
    if (traverse.canMoveLeft) {
      newPosition = position - 1;
      revealSquare(newPosition);
    }
    // reveal top left
    if (traverse.canMoveTopLeft) {
      newPosition = position - gameMode[level].gridWidth - 1;
      revealSquare(newPosition);
    }
  }

  function traverseHelper() {
    // traverse up
    if (traverse.canMoveUp) {
      revealAdjacentCellsHelper(traverse.up);
      traverse.up -= gameMode[level].gridWidth;
      return traverseHelper();
    }
    // traverse top right
    if (traverse.canMoveTopRight) {
      revealAdjacentCellsHelper(traverse.topRight);
      traverse.topRight += 1 - gameMode[level].gridWidth;
      return traverseHelper();
    }
    // traverse right
    if (traverse.canMoveRight) {
      revealAdjacentCellsHelper(traverse.right);
      traverse.right += 1;
      return traverseHelper();
    }
    // traverse bottom right
    if (traverse.canMoveBottomRight) {
      revealAdjacentCellsHelper(traverse.bottomRight);
      traverse.bottomRight += 1 + gameMode[level].gridWidth;
      return traverseHelper();
    }
    // traverse bottom
    if (traverse.canMoveBottom) {
      revealAdjacentCellsHelper(traverse.bottom);
      traverse.bottom += gameMode[level].gridWidth;
      return traverseHelper();
    }
    // traverse bottom left
    if (traverse.canMoveBottomLeft) {
      revealAdjacentCellsHelper(traverse.bottomLeft);
      traverse.bottomLeft -= 1 + gameMode[level].gridWidth;
      return traverseHelper();
    }
    // traverse left
    if (traverse.canMoveLeft) {
      revealAdjacentCellsHelper(traverse.left);
      traverse.left -= 1;
      return traverseHelper();
    }
    // traverse top left
    if (traverse.canMoveTopLeft) {
      revealAdjacentCellsHelper(traverse.topLeft);
      traverse.topLeft += -1 - gameMode[level].gridWidth;
      return traverseHelper();
    }
  }

  return traverseHelper();
}

function revealCell(e) {
  const cellIndex = Number(e.target.dataset.index);
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
      revealAdjacentBlankSquares(level, cellIndex);
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
