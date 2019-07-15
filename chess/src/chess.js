
const
  PAWN = 'p',
  KNIGHT = 'n',
  BISHOP = 'b',
  ROOK = 'r',
  QUEEN = 'q',
  KING = 'k';

const
  WHITE = 'w',
  BLACK = 'b';

export const PIECE_UNICODE = {
  [BLACK] : {
    [ROOK]: '♜', [KNIGHT]: '♞', [BISHOP]: '♝',
    [QUEEN]: '♛', [KING]: '♚', [PAWN]: '♟' 
  },
  [WHITE] : {
    [ROOK]: '♖', [KNIGHT]: '♘', [BISHOP]: '♗',
    [QUEEN]: '♕', [KING]: '♔', [PAWN]: '♙'
  }
}

export const NEW_BOARD = {
  pieces:
    [
      [ROOK, KNIGHT, BISHOP, QUEEN, KING, BISHOP, KNIGHT, ROOK],
      [PAWN, PAWN, PAWN, PAWN, PAWN, PAWN, PAWN, PAWN],
      [null, null, null, null, null, null, null, null],
      [null, null, null, QUEEN, null, null, null, null],
      [null, null, KING, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      [PAWN, PAWN, PAWN, PAWN, PAWN, PAWN, PAWN, PAWN],
      [ROOK, KNIGHT, BISHOP, QUEEN, KING, BISHOP, KNIGHT, ROOK]
    ],
  colors:
    [
      [BLACK, BLACK, BLACK, BLACK, BLACK, BLACK, BLACK, BLACK],
      [BLACK, BLACK, BLACK, BLACK, BLACK, BLACK, BLACK, BLACK],
      [null, null, null, null, null, null, null, null],
      [null, null, null, BLACK, null, null, null, null],
      [null, null, WHITE, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      [WHITE, WHITE, WHITE, WHITE, WHITE, WHITE, WHITE, WHITE],
      [WHITE, WHITE, WHITE, WHITE, WHITE, WHITE, WHITE, WHITE]
    ]
}


function inBounds(i, j) {
  return (i >= 0 && i <=7 && j >=0 && j <= 7);
}

const
  ROOK_DIRS = [[0, 1], [0, -1], [1, 0], [-1, 0]],
  BISHOP_DIRS = [[1, 1], [-1, -1], [1, -1], [-1, 1]],
  OMNI_DIRS = [
    [0, 1], [0, -1], [1, 0], [-1, 0],
    [1, 1], [-1, -1], [1, -1], [-1, 1]
  ],
  KNIGHT_DIRS = [
    [2, 1], [-2, -1], [-2, 1], [2, -1],
    [1, 2], [-1, -2], [-1, 2], [1, -2]
  ];

function progressiveMoves(d, board, i, j, opponent) {
  var oi = 0, oj = 0, p, result = [];
  do {
    oi = oi + d[0];
    oj = oj + d[1];
    p = inBounds(i + oi, j + oj) && board.colors[i + oi][j + oj];
    if (p === null || p === opponent)
      result.push([i + oi, j + oj])
  } while (p === null);

  return result;
}


export function movesForPieceAt(board, i, j) {
  const

    piece = board.pieces[i][j],
    color = board.colors[i][j],
    opponent = color === BLACK ? WHITE : BLACK,
    forward = color === WHITE ? -1 : 1;

  var result = [];

  if (piece === PAWN) {
    const
      firstMove = color === WHITE ? (i === 6) : (i === 1),
      i1 = i + forward,
      jL = j + 1,
      jR = j - 1;
    
    if (inBounds(i1, jR) && board.colors[i1][jR] === opponent)
      result.push([i1, j])
    if (inBounds(i1, jL) && board.colors[i1][jL] === opponent)
      result.push([i1, jL])
    if (inBounds(i1, j) && board.colors[i1][j] === null) {
      result.push([i1, j])
      if (firstMove) {
        const i2 = i1 + forward;
        if (inBounds(i2, j) && board.colors[i2][j] === null)
          result.push([i2, j])
      }
    }
  }
  else if (piece === ROOK) {
    ROOK_DIRS.forEach(d => {
      result = result.concat(progressiveMoves(d, board, i, j, opponent))
    })
  }
  else if (piece === BISHOP) {
    BISHOP_DIRS.forEach(d => {
      result = result.concat(progressiveMoves(d, board, i, j, opponent))
    })
  }
  else if (piece === QUEEN) {
    OMNI_DIRS.forEach(d => {
      result = result.concat(progressiveMoves(d, board, i, j, opponent))
    })
  }
  else if (piece === KNIGHT) {
    KNIGHT_DIRS.forEach(d => {
      const
        i1 = i + d[0],
        j1 = j + d[1],
        p = inBounds(i1, j1) && board.colors[i1][j1];

      if (p === null || p === opponent)
        result.push([i1, j1])
    })
  }
  else if (piece === KING) {
    OMNI_DIRS.forEach(d => {
      const
        i1 = i + d[0],
        j1 = j + d[1],
        p = inBounds(i1, j1) && board.colors[i1][j1];

      if (p === null || p === opponent)
        result.push([i1, j1]);
    })
  }
  return result;
}


export function allMoves(board, color) {
  var i, j;
  var result = [];
  for (i = 0; i < 8; i++)
    for (j = 0; j < 8; j++)
      if (board.colors[i][j] === color)
        result = result.concat(movesForPieceAt(board, i, j));
  
  return result;
}

// console.log(allMoves(NEW_BOARD, WHITE))
