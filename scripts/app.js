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
  return position >= gridWidth && (position - 1) % gridWidth === 0;
}
function canMoveToRight(position, gridWidth) {
  return (position + 1) % gridWidth !== 0;
}
function canMoveToLeft(position, gridWidth) {
  return (position - 1) % gridWidth === 0;
}
function canMoveToBottom(position, gridWidth, gridSize) {
  return position + gridWidth < gridSize;
}
function canMoveToBottomRight(position, gridWidth, gridSize) {
  return position + gridWidth < gridSize && (position + 1) % gridWidth !== 0;
}
function canMoveToBottomLeft(position, gridWidth, gridSize) {
  return position + gridWidth < gridSize && (position - 1) % gridWidth === 0;
}

// todo test function
function countAdjacentMines(level, moveCount, startPos) {
  let mineCount = 0;
  let newTopPos = startPos;
  let newTopRightPos = startPos;
  let newRightPos = startPos;
  let newBottomRightPos = startPos;
  let newBottomPos = startPos;
  let newBottomLeftPos = startPos;
  let newLeftPos = startPos;
  let newTopLeftPos = startPos;

  function countHelper(moveCount, newPosition) {
    if (moveCount === 0) return mineCount;

    // traverse up
    if (canMoveToTop(newPosition, gameMode[level].gridWidth)) {
      newTopPos -= gameMode[level].gridWidth;
      console.log("Top", newTopPos);
      if (minesweeperBoard[newTopPos] === minesweeper.mine) {
        mineCount += 1;
      }
      return countHelper(moveCount - 1, newTopPos);
    }
    // traverse top right
    if (canMoveToTopRight(newPosition, gameMode[level].gridWidth)) {
      newTopRightPos = newTopRightPos + 1 - gameMode[level].gridWidth;
      console.log("Top Right", newTopRightPos);
      if (minesweeperBoard[newTopRightPos] === minesweeper.mine) {
        mineCount += 1;
      }
      return countHelper(moveCount - 1, newTopRightPos);
    }
    // traverse right
    if (canMoveToRight(newPosition, gameMode[level].gridWidth)) {
      newRightPos += 1;
      console.log("Right", newRightPos);
      if (minesweeperBoard[newRightPos] === minesweeper.mine) {
        mineCount += 1;
      }
      return countHelper(moveCount - 1, newRightPos);
    }
    // traverse bottom right
    if (
      canMoveToBottomRight(
        newPosition,
        gameMode[level].gridWidth,
        gameMode[level].gridSize
      )
    ) {
      newBottomRightPos += gameMode[level].gridWidth + 1;
      console.log("Bottom Right", newBottomRightPos);
      if (minesweeperBoard[newBottomRightPos] === minesweeper.mine) {
        mineCount += 1;
      }
      return countHelper(moveCount - 1, newBottomRightPos);
    }
    // traverse down
    if (
      canMoveToBottom(
        newPosition,
        gameMode[level].gridWidth,
        gameMode[level].gridSize
      )
    ) {
      newBottomPos += gameMode[level].gridWidth;
      console.log("Bottom", newBottomPos);
      if (minesweeperBoard[newBottomPos] === minesweeper.mine) {
        mineCount += 1;
      }
      return countHelper(moveCount - 1, newBottomPos);
    }
    // traverse bottom left
    if (
      canMoveToBottomLeft(
        newPosition,
        gameMode[level].gridWidth,
        gameMode[level].gridSize
      )
    ) {
      newBottomLeftPos = newBottomLeftPos - 1 + gameMode[level].gridWidth;
      console.log("Bottom Left", newBottomLeftPos);

      if (minesweeperBoard[newBottomLeftPos] === minesweeper.mine) {
        mineCount += 1;
      }
      return countHelper(moveCount - 1, newBottomLeftPos);
    }
    // traverse left
    if (canMoveToLeft(newPosition, gameMode[level].gridWidth)) {
      newLeftPos -= 1;
      console.log("left", newLeftPos);
      if (minesweeperBoard[newLeftPos] === minesweeper.mine) {
        mineCount += 1;
      }
      return countHelper(moveCount - 1, newLeftPos);
    }
    // traverse top left
    if (canMoveToTopLeft(newPosition, gameMode[level].gridWidth)) {
      newTopLeftPos -= gameMode[level].gridWidth - 1;
      console.log("Top Left", newTopLeftPos);
      if (minesweeperBoard[newTopLeftPos] === minesweeper.mine) {
        mineCount += 1;
      }
      return countHelper(moveCount - 1, newTopLeftPos);
    }
    return mineCount;
  }

  return countHelper(moveCount, startPos);
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
      countAdjacentMines(level, 1, randomNumber) < 3
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
