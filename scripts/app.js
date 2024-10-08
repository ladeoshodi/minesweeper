const gridEl = document.querySelector(".grid");
const gridWrapperEl = document.querySelector(".grid-wrapper");
const mineCountDisplay = document.querySelector(".mine-count");
const reset = document.querySelector(".reset");
const timerDisplay = document.querySelector(".timer");
const resultDialog = document.querySelector(".result-dialog");
const closeResultDialog = document.querySelector(".result-dialog button");
const beginnerLevel = document.querySelector(".beginner-level");
const intermediateLevel = document.querySelector(".intermediate-level");
const expertLevel = document.querySelector(".expert-level");
const highScoreBtn = document.querySelector(".high-score");
const highScoreDialog = document.querySelector(".high-score-dialog");
const closeHighScoreDialog = document.querySelector(".close-high-score-dialog");
const resetHighScore = document.querySelector(".reset-high-score");
const newHighScore = document.querySelector(".new-high-score");
const newHighScoreName = document.querySelector("#new-high-score-name");
const beginnerHighScore = document.querySelector(".beginner-high-score");
const intermediateHighScore = document.querySelector(
  ".intermediate-high-score"
);
const expertHighScore = document.querySelector(".expert-high-score");
const clickToFlagBtn = document.querySelector(".click-to-flag");

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
  intermediate: {
    level: "intermediate",
    gridWidth: 16,
    gridLength: 16,
    mines: 40,
    get gridSize() {
      return this.gridWidth * this.gridLength;
    },
  },
  expert: {
    level: "expert",
    gridWidth: 30,
    gridLength: 16,
    mines: 99,
    get gridSize() {
      return this.gridWidth * this.gridLength;
    },
  },
};
const minesweeper = {
  mine: "💣",
  blank: "",
  flag: "🚩",
  cross: "❌",
};
const gameBoard = [];
const timer = {
  time: 0,
  hasStarted: false,
};

let gameBoardHidden;
let timerIntervalInt;
let flaggedMines = 0;
let clickToFlag = false;

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

function startTimer() {
  if (!timer.hasStarted) {
    timerIntervalInt = setInterval(() => {
      timer.time += 1;
      timerDisplay.textContent = timer.time;
    }, 1000);
  }
  timer.hasStarted = true;
}

function isGameWon(level) {
  const flaggedCells = Array.from(document.querySelectorAll(".flag"));
  if (flaggedCells.length === gameMode[level].mines) {
    return flaggedCells.every((revealedCell) => {
      return gameBoardHidden[revealedCell.dataset.index] === minesweeper.mine;
    });
  }
  return false;
}

function gameOver() {
  gameBoard.forEach((cell) => {
    cell.removeEventListener("click", handleClick);
    cell.removeEventListener("contextmenu", flagCell);
  });
  clearInterval(timerIntervalInt);
  timer.hasStarted = false;
}

function revealAllMines() {
  gameBoardHidden.forEach((cell, index) => {
    if (cell === minesweeper.mine) {
      gameBoard[index].textContent = cell;
      gameBoard[index].classList.add("mine");
    } else if (
      cell !== minesweeper.mine &&
      gameBoard[index].classList.contains("flag")
    ) {
      gameBoard[index].textContent = minesweeper.cross;
    }
  });
}

function revealSquare(position) {
  if (
    !gameBoard[position].classList.contains("revealed") &&
    !gameBoard[position].classList.contains("flag")
  ) {
    if (gameBoardHidden[position] === minesweeper.blank) {
      gameBoard[position].classList.add("blank");
      gameBoard[position].classList.add("revealed");
    } else {
      gameBoard[position].classList.add("safe");
      gameBoard[position].classList.add("revealed");
      gameBoard[position].textContent = gameBoardHidden[position];
    }
  }
}

function revealAdjacentBlankSquares(level, startPos) {
  if (
    !countAdjacentMines(level, startPos) &&
    !gameBoard[startPos].classList.contains("revealed")
  ) {
    revealSquare(startPos);
    if (canMoveToTop(startPos, gameMode[level].gridWidth)) {
      revealAdjacentBlankSquares(level, startPos - gameMode[level].gridWidth);
    }
    if (canMoveToRight(startPos, gameMode[level].gridWidth)) {
      revealAdjacentBlankSquares(level, startPos + 1);
    }
    if (canMoveToLeft(startPos, gameMode[level].gridWidth)) {
      revealAdjacentBlankSquares(level, startPos - 1);
    }
    if (
      canMoveToBottom(
        startPos,
        gameMode[level].gridWidth,
        gameMode[level].gridSize
      )
    ) {
      revealAdjacentBlankSquares(level, startPos + gameMode[level].gridWidth);
    }
    if (canMoveToTopRight(startPos, gameMode[level].gridWidth)) {
      revealAdjacentBlankSquares(
        level,
        startPos + 1 - gameMode[level].gridWidth
      );
    }
    if (
      canMoveToBottomRight(
        startPos,
        gameMode[level].gridWidth,
        gameMode[level].gridSize
      )
    ) {
      revealAdjacentBlankSquares(
        level,
        startPos + gameMode[level].gridWidth + 1
      );
    }
    if (canMoveToTopLeft(startPos, gameMode[level].gridWidth)) {
      revealAdjacentBlankSquares(
        level,
        startPos - gameMode[level].gridWidth - 1
      );
    }
    if (
      canMoveToBottomLeft(
        startPos,
        gameMode[level].gridWidth,
        gameMode[level].gridSize
      )
    ) {
      revealAdjacentBlankSquares(
        level,
        startPos - 1 + gameMode[level].gridWidth
      );
    }
  } else {
    revealSquare(startPos);
  }
}

function revealCell(e) {
  startTimer();
  const cellIndex = Number(e.target.dataset.index);
  const level = gridEl.dataset.level;
  if (!gameBoard[cellIndex].classList.contains("flag")) {
    gameBoard[cellIndex].textContent = gameBoardHidden[cellIndex];
    if (gameBoardHidden[cellIndex] === minesweeper.mine) {
      gameBoard[cellIndex].id = "active-mine";
      reset.textContent = "😵";
      revealAllMines();
      gameOver();
    } else if (gameBoardHidden[cellIndex] === minesweeper.blank) {
      // call recursive function
      revealAdjacentBlankSquares(level, cellIndex);
    } else {
      revealSquare(cellIndex);
    }
  }
}

function flagCell(e) {
  e.preventDefault();
  startTimer();
  const cellIndex = e.target.dataset.index;
  const level = gridEl.dataset.level;
  if (!gameBoard[cellIndex].classList.contains("revealed")) {
    if (!gameBoard[cellIndex].classList.contains("flag")) {
      if (flaggedMines < gameMode[level].mines) {
        gameBoard[cellIndex].classList.add("flag");
        gameBoard[cellIndex].textContent = minesweeper.flag;
        flaggedMines += 1;
      }
    } else {
      gameBoard[cellIndex].classList.remove("flag");
      gameBoard[cellIndex].textContent = "";
      flaggedMines -= 1;
    }
    mineCountDisplay.textContent = gameMode[level].mines - flaggedMines;
  }
  if (isGameWon(level)) {
    gameOver();
    reset.textContent = "😎";
    let currentHighScore = getCurrentHighScore(level)
      ? Number(getCurrentHighScore(level).time)
      : Infinity;

    if (timer.time < currentHighScore) {
      newHighScore.classList.remove("hidden");
    }
    resultDialog.showModal();
  }
}

function handleClick(e) {
  if (clickToFlag) {
    flagCell(e);
  } else {
    revealCell(e);
  }
}

function displayGame(level) {
  gridWrapperEl.classList.add(gameMode[level].level);
  gridEl.dataset.level = gameMode[level].level;
  timerDisplay.textContent = timer.time;
  mineCountDisplay.textContent = gameMode[level].mines - flaggedMines;

  loadGameBoardHidden(level);

  for (let i = 0; i < gameMode[level].gridSize; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.dataset.index = i;
    cell.addEventListener("click", handleClick);
    cell.addEventListener("contextmenu", flagCell);
    gameBoard.push(cell);
    gridEl.appendChild(cell);
  }
}

function startNewGame(level = "") {
  const newLevel = level || gridEl.dataset.level;
  gameOver();
  timer.time = 0;
  flaggedMines = 0;
  gameBoard.splice(0);
  reset.textContent = "🙂";
  clickToFlagBtn.classList.remove("active-flag");
  clickToFlag = false;
  gridEl.replaceChildren();
  displayGame(newLevel);
}

function getCurrentHighScore(level) {
  return JSON.parse(localStorage.getItem(level));
}

function loadHighScores() {
  const beginnerHS = getCurrentHighScore("beginner");
  const intermediateHS = getCurrentHighScore("intermediate");
  const expertHS = getCurrentHighScore("expert");

  beginnerHighScore.textContent = beginnerHS
    ? `${beginnerHS.name}: ${beginnerHS.time} seconds`
    : "Not set";

  intermediateHighScore.textContent = intermediateHS
    ? `${intermediateHS.name}: ${intermediateHS.time} seconds`
    : "Not set";

  expertHighScore.textContent = expertHS
    ? `${expertHS.name}: ${expertHS.time} seconds`
    : "Not set";
}

reset.addEventListener("click", () => startNewGame());

closeResultDialog.addEventListener("click", () => {
  const level = gridEl.dataset.level;
  const newHighScoreWinner = newHighScoreName.value;
  if (newHighScoreWinner) {
    localStorage.setItem(
      level,
      JSON.stringify({
        time: timer.time,
        name: newHighScoreWinner,
      })
    );
  }
  newHighScoreName.value = "";
  newHighScore.classList.add("hidden");
  resultDialog.close();
});

beginnerLevel.addEventListener("click", (e) => {
  for (const level in gameMode) {
    gridWrapperEl.classList.remove(gameMode[level].level);
  }
  startNewGame(e.target.dataset.value);
});

intermediateLevel.addEventListener("click", (e) => {
  for (const level in gameMode) {
    gridWrapperEl.classList.remove(gameMode[level].level);
  }
  startNewGame(e.target.dataset.value);
});

expertLevel.addEventListener("click", (e) => {
  for (const level in gameMode) {
    gridWrapperEl.classList.remove(gameMode[level].level);
  }
  startNewGame(e.target.dataset.value);
});

highScoreBtn.addEventListener("click", () => {
  loadHighScores();
  highScoreDialog.showModal();
});

closeHighScoreDialog.addEventListener("click", () => {
  highScoreDialog.close();
});

resetHighScore.addEventListener("click", () => {
  localStorage.clear();
  loadHighScores();
});

clickToFlagBtn.addEventListener("click", (e) => {
  e.target.classList.toggle("active-flag");
  clickToFlag = clickToFlag ? false : true;
});

displayGame("beginner");

// !cheat code:reveal hidden board
function displayGameBoardHidden() {
  gameBoard.forEach((cell, index) => {
    cell.textContent = gameBoardHidden[index];
  });
}
