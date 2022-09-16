// Logic

export const TILE_STATUSES = {
  HIDDEN: "hidden",
  MINE: "mine",
  NUMBER: "number",
  MARKED: "marked",
};

export function createBoard(boardSize, numberOfMines) {
  const board = [];
  const minePositions = getMinePositions(boardSize, numberOfMines);

  for (let x = 0; x < boardSize; x++) {
    const row = [];
    for (let y = 0; y < boardSize; y++) {
      const element = document.createElement("div");
      element.dataset.status = TILE_STATUSES.HIDDEN;

      const tile = {
        element,
        x,
        y,
        mine: minePositions.some(positionMatch.bind(null, { x, y })),
        get status() {
          return element.dataset.status;
        },
        set status(value) {
          this.element.dataset.status = value;
        },
      };

      row.push(tile);
    }
    board.push(row);
  }
  return board;
}

export function markTile(tile) {
  if (
    tile.status !== TILE_STATUSES.HIDDEN &&
    tile.status !== TILE_STATUSES.MARKED
  )
    return;

  if (tile.status === TILE_STATUSES.HIDDEN) tile.status = TILE_STATUSES.MARKED;
  else tile.status = TILE_STATUSES.HIDDEN;
}

export function revealTile(board, tile) {
  if (tile.status !== TILE_STATUSES.HIDDEN) return;
  if (tile.mine) {
    tile.status = TILE_STATUSES.MINE;
    return;
  } else {
    tile.status = TILE_STATUSES.NUMBER;
    const adjacentTiles = nearbyTiles(board, tile);
    const numberOfMinesNearby = adjacentTiles.reduce((count, tile) => {
      return tile.mine ? count + 1 : count;
    }, 0);
    if (numberOfMinesNearby === 0) {
      adjacentTiles.forEach(revealTile.bind(null, board));
    } else {
      tile.element.innerHTML = numberOfMinesNearby;
    }
  }
}

export function checkWin(board) {
  return board.every((row) =>
    row.every((tile) => {
      return (
        tile.status === TILE_STATUSES.NUMBER ||
        (tile.mine &&
          (tile.status === TILE_STATUSES.MARKED ||
            tile.status === TILE_STATUSES.HIDDEN))
      );
    })
  );
}

export function checkLose(board) {
  return board.some((row) =>
    row.some((tile) => {
      return tile.status === TILE_STATUSES.MINE;
    })
  );
}

function nearbyTiles(board, { x, y }) {
  const tiles = [];

  for (let xOffset = -1; xOffset <= 1; xOffset++) {
    for (let yOffset = -1; yOffset <= 1; yOffset++) {
      const tile = board[x + xOffset]?.[y + yOffset];
      if (tile) tiles.push(tile);
    }
  }

  return tiles;
}

function getMinePositions(boardSize, numberOfMines) {
  const positions = [];

  while (positions.length < numberOfMines) {
    const position = {
      x: randomNumber(boardSize),
      y: randomNumber(boardSize),
    };

    if (!positions.some(positionMatch.bind(null, position))) {
      positions.push(position);
    }
  }
  return positions;
}

function randomNumber(size) {
  return Math.floor(Math.random() * size);
}

function positionMatch(posA, posB) {
  return posA.x === posB.x && posA.y === posB.y;
}
