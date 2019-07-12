import _ from 'lodash';

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
    return 3

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

export function minimax(b, depth, maximizing = true) {
  var winner = checkWin(b);
  if (winner)
    return { value: (winner === 1 ? -1 : winner === 2 ? 1 : 0) }

  if (depth === 0)
    return { value: 0 };

  var result = null;
  possibleMoves(b).forEach(({ i, j }) => {
    const b1 = _.cloneDeep(b);
    b1[i][j] = maximizing ? 2 : 1;
    const r = minimax(b1, depth - 1, !maximizing);

    if (
      !result ||
      (maximizing && result.value < r.value) ||
      (!maximizing && result.value > r.value)
    ) {
      result = { value: r.value, i: i, j: j };
    }
  })
  return result;
}

export function progressiveMinMax(b) {
  for (var depth = 0; depth < 5; depth++) {
    var { value, i, j } = minimax(b, depth);
    // console.log(depth, value);

    if (value === 1)
      return { value, i, j }
  }
  return { value, i, j }
}

export function smarterBotMove(board) {
  // const {i, j, value} = minimax(board, 4, true);
  const { i, j, value } = progressiveMinMax(board);
  
  if (value === 1)
    console.log('I\'m gonna win bro');
  return { i, j }
}