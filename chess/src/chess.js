
export const
  PAWN = 'p',
  KNIGHT = 'n',
  BISHOP = 'b',
  ROOK = 'r',
  QUEEN = 'q',
  KING = 'k';

export const
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
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      [PAWN, PAWN, PAWN, PAWN, PAWN, PAWN, PAWN, PAWN],
      [ROOK, KNIGHT, BISHOP, QUEEN, KING, BISHOP, KNIGHT, ROOK]
    ],
  colors:
    [
      [BLACK, BLACK, BLACK, BLACK, BLACK, BLACK, BLACK, BLACK],
      [BLACK, BLACK, BLACK, BLACK, BLACK, BLACK, BLACK, BLACK],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
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
      result.push([i, j, i + oi, j + oj])
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
      result.push([i, j, i1, jR])
    if (inBounds(i1, jL) && board.colors[i1][jL] === opponent)
      result.push([i, j, i1, jL])
    if (inBounds(i1, j) && board.colors[i1][j] === null) {
      result.push([i, j, i1, j])
      if (firstMove) {
        const i2 = i1 + forward;
        if (inBounds(i2, j) && board.colors[i2][j] === null)
          result.push([i, j, i2, j])
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
        result.push([i, j, i1, j1])
    })
  }
  else if (piece === KING) {
    OMNI_DIRS.forEach(d => {
      const
        i1 = i + d[0],
        j1 = j + d[1],
        p = inBounds(i1, j1) && board.colors[i1][j1];

      if (p === null || p === opponent)
        result.push([i, j, i1, j1]);
    })
  }
  return result;
}

export function filterMoves(board, i, j, moves) {
  return moves.filter(move => {
    const
      { pieces, colors } = board,
      piece = pieces[i][j], color = colors[i][j],
      piece2 = pieces[move[2]][move[3]], color2 = colors[move[2]][move[3]];
    
    // move
    pieces[i][j] = null; colors[i][j] = null;
    pieces[move[2]][move[3]] = piece; colors[move[2]][move[3]] = color;

    // check
    const result = !kingIsInDanger(board, color);

    // revert
    pieces[i][j] = piece; colors[i][j] = color;
    pieces[move[2]][move[3]] = piece2; colors[move[2]][move[3]] = color2;
    return result;
  });
}

function kingIsInDanger(board, color) {
  // slow algorithm. needs optimization.
  const
    opponent = color === WHITE ? BLACK : WHITE,
    moves = allMoves(board, opponent);
  
  for (var i = 0; i < moves.length; i++)
    if (board.pieces[moves[i][2]][moves[i][3]] === KING)
      return true;
}

export function legalMovesForPieceAt(board, i, j) {
  return filterMoves(board, i, j, movesForPieceAt(board, i, j));
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

export function allLegalMoves(board, color) {
  var i, j;
  var result = [];
  for (i = 0; i < 8; i++)
    for (j = 0; j < 8; j++)
      if (board.colors[i][j] === color)
        result = result.concat(legalMovesForPieceAt(board, i, j));
  return result;
}


export function checkWinner(board) {
  if (allLegalMoves(board, BLACK).length === 0)
    return WHITE;
  
  if (allLegalMoves(board, WHITE).length === 0)
    return BLACK;
  
  return null;
}

export function canMove(board, move) {
  var moves = legalMovesForPieceAt(board, move[0], move[1]);
  return moves.findIndex(m => m[2] === move[2] && m[3] === move[3]) !== -1;
}

export function movePiece(board, move) {
  const
    { pieces, colors } = board,
    [i1, j1, i2, j2] = move;
  // move
  pieces[i2][j2] = pieces[i1][j1];
  colors[i2][j2] = colors[i1][j1];
  pieces[i1][j1] = null;
  colors[i1][j1] = null;
  
  return board;
}


// AI
export function botMove(board, color) {

}

export function dumbBotMove(board, color) {
  const
    moves = allLegalMoves(board, color),
    randomIndex = Math.floor(Math.random() * moves.length);

  return moves[randomIndex]
}