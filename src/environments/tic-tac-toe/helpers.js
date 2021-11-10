export const EMPTY_BOARD = [
  [null, null, null],
  [null, null, null],
  [null, null, null]
]

export function checkWin(board) {
  var i, j, r, b = board;

  for (i = 0; i < 3; i++) {
    if (
      b[i][0] !== null &&
      b[i][0] === b[i][1] &&
      b[i][1] === b[i][2]
    ) return b[i][0];

    if (
      b[0][i] !== null &&
      b[0][i] === b[1][i] &&
      b[1][i] === b[2][i]
    ) return b[0][i];
  }

  if (b[0][0] !== null && b[0][0] === b[1][1] && b[1][1] === b[2][2])
    return b[1][1];

  if (b[2][0] !== null && b[2][0] === b[1][1] && b[1][1] === b[0][2])
    return b[1][1];

  r = true;
  for (i = 0; i < 3; i++)
    for (j = 0; j < 3; j++)
      r = r && (b[i][j] !== null);

  if (r)
    return 3;

  return false;
}

export function dumbBotMove(board) {
  var i, j;
  do {
    i = Math.floor(Math.random() * 3);
    j = Math.floor(Math.random() * 3);
  } while (board[i][j] !== null);

  return { i, j }
}

export function possibleMoves(board) {
  var i, j;
  var r = []
  for (i = 0; i < 3; i++)
    for (j = 0; j < 3; j++)
      if (board[i][j] === null)
        r.push({ i, j });
  return r
}

export function minimax(board, depth, maximizing) {
  evaluated++;

  var winner = checkWin(board);
  if (winner || depth === 0)
    return (winner === 1 ? -Infinity : winner === 2 ? Infinity : Math.random())

  var value;
  if (maximizing) {
    value = -Infinity;
    possibleMoves(board).forEach(({ i, j }) => {
      board[i][j] = 2;
      value = Math.max(value, minimax(board, depth - 1, false));
      board[i][j] = null;
    });
  } else {
    value = Infinity;
    possibleMoves(board).forEach(({ i, j }) => {
      board[i][j] = 1;
      value = Math.min(value, minimax(board, depth - 1, true));
      board[i][j] = null;
    });
  }
  return value;
}

var evaluated = 0, time;
export function smarterBotMove(board) {
  var bestMove, bestValue = null;
  evaluated = 0;
  time = (new Date()).getTime();

  possibleMoves(board).forEach(({i, j}) => {
    board[i][j] = 2;
    var value = minimax(board, 7, false);
    board[i][j] = null;

    if (bestValue === null || bestValue < value) {
      bestValue = value;
      bestMove = {i, j};
    }
  });

  console.log('Nodes Evaluated: ', evaluated);
  console.log('Time Taken: ', (new Date()).getTime() - time);
  console.log('Best', bestMove, bestValue)

  return bestMove;
}