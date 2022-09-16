// Display/UI
import {
  createBoard,
  markTile,
  TILE_STATUSES,
  revealTile,
  checkWin,
  checkLose,
} from "./minesweeper.js";

const BOARD_SIZE = 10;
const NUMBER_OF_MINES = 10;

const board = createBoard(BOARD_SIZE, NUMBER_OF_MINES);
const boardElement = document.querySelector(".board");
const minesLeftText = document.querySelector("[data-mine-count]");
const messageText = document.querySelector(".subtext");
const resetButton = document.querySelector(".reset-button");

resetButton.addEventListener("click", resetGame);

board.forEach((row) => {
  row.forEach((tile) => {
    boardElement.append(tile.element);

    // Left Click on Tiles
    tile.element.addEventListener("click", () => {
      revealTile(board, tile);
      checkGameEnd();
    });

    // Right Click on Tiles
    tile.element.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      markTile(tile);
      listMinesLeft();
    });
  });
});

boardElement.style.setProperty("--size", BOARD_SIZE);
minesLeftText.innerHTML = NUMBER_OF_MINES;

function listMinesLeft() {
  const markedTilesCount = board.reduce((count, row) => {
    return (
      count + row.filter((tile) => tile.status === TILE_STATUSES.MARKED).length
    );
  }, 0);
  minesLeftText.innerHTML = NUMBER_OF_MINES - markedTilesCount;
}

function checkGameEnd() {
  const win = checkWin(board);
  const lose = checkLose(board);

  if (win || lose) {
    boardElement.addEventListener("click", stopProp, { capture: true });
    boardElement.addEventListener("contaxtmenu", stopProp, { capture: true });
  }

  if (win) messageText.innerHTML = "You Win!";
  if (lose) {
    board.forEach((row) =>
      row.forEach((tile) => {
        if (tile.status === TILE_STATUSES.MARKED) markTile(tile);
        if (tile.mine) revealTile(board, tile);
      })
    );
    messageText.innerHTML = "You Lose!";
  }
}

function stopProp(e) {
  e.stopImmediatePropagation();
}

function resetGame() {
  location.reload();
}
