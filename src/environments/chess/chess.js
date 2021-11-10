import _ from 'lodash';

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

function withinBounds(i, j) {
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


export class ChessBoard {
  constructor() {
    this.newBoard();
  }

  newBoard() {
    this.board = _.cloneDeep(NEW_BOARD);
    this.moves = []
  }

  progressiveMoves(direction, i, j, opponent) {
    var oi = 0, oj = 0, p, result = [];
    do {
      oi = oi + direction[0];
      oj = oj + direction[1];
      p = withinBounds(i + oi, j + oj) && this.board.colors[i + oi][j + oj];
      if (p === null || p === opponent)
        result.push([i, j, i + oi, j + oj])
    } while (p === null);
    return result;
  }

  colorAt(i, j) {
    return this.board.colors[i][j];
  }

  movesForPieceAt(i, j) {
    const
      board = this.board,
      { pieces, colors } = board,
      piece = pieces[i][j],
      color = colors[i][j],
      opponent = color === BLACK ? WHITE : BLACK,
      forward = color === WHITE ? -1 : 1;

    var result = [];

    if (piece === PAWN) {
      const
        firstMove = color === WHITE ? (i === 6) : (i === 1),
        i1 = i + forward,
        jL = j + 1,
        jR = j - 1;

      if (withinBounds(i1, jR) && colors[i1][jR] === opponent)
        result.push([i, j, i1, jR])
      if (withinBounds(i1, jL) && colors[i1][jL] === opponent)
        result.push([i, j, i1, jL])
      if (withinBounds(i1, j) && colors[i1][j] === null) {
        result.push([i, j, i1, j])
        if (firstMove) {
          const i2 = i1 + forward;
          if (withinBounds(i2, j) && colors[i2][j] === null)
            result.push([i, j, i2, j])
        }
      }
    }
    else if (piece === ROOK) {
      ROOK_DIRS.forEach(d => {
        result = result.concat(this.progressiveMoves(d, i, j, opponent))
      })
    }
    else if (piece === BISHOP) {
      BISHOP_DIRS.forEach(d => {
        result = result.concat(this.progressiveMoves(d, i, j, opponent))
      })
    }
    else if (piece === QUEEN) {
      OMNI_DIRS.forEach(d => {
        result = result.concat(this.progressiveMoves(d, i, j, opponent))
      })
    }
    else if (piece === KNIGHT) {
      KNIGHT_DIRS.forEach(d => {
        const
          i1 = i + d[0],
          j1 = j + d[1],
          p = withinBounds(i1, j1) && colors[i1][j1];

        if (p === null || p === opponent)
          result.push([i, j, i1, j1])
      })
    }
    else if (piece === KING) {
      OMNI_DIRS.forEach(d => {
        const
          i1 = i + d[0],
          j1 = j + d[1],
          p = withinBounds(i1, j1) && colors[i1][j1];

        if (p === null || p === opponent)
          result.push([i, j, i1, j1]);
      })
    }
    return result;
  }

  movePiece(move) {
    const { pieces, colors } = this.board;
    this.moves.push(
      [move, pieces[move[2]][move[3]], colors[move[2]][move[3]]]
    )

    pieces[move[2]][move[3]] = pieces[move[0]][move[1]];
    colors[move[2]][move[3]] = colors[move[0]][move[1]];
    pieces[move[0]][move[1]] = null;
    colors[move[0]][move[1]] = null;

  }

  undoMove() {
    const
      moveData = this.moves.pop(),
      [move, piece, color] = moveData,
      [i1, j1, i2, j2] = move,
      { pieces, colors } = this.board;
    
    pieces[i1][j1] = pieces[i2][j2];
    colors[i1][j1] = colors[i2][j2];
    pieces[i2][j2] = piece;
    colors[i2][j2] = color;
  }

  filterLegalMoves(moves) {
    return moves.filter(move => {
      const color = this.colorAt(move[0], move[1]);
      this.movePiece(move);
      const result = !this.kingIsInDanger(color);
      this.undoMove();
      return result;
    });
  }

  kingIsInDanger(color) {
    // Slow Algorithm. Can be optimized.
    const
      { pieces } = this.board,
      opponent = color === WHITE ? BLACK : WHITE,
      moves = this.allMovesForColor(opponent);

    for (var i = 0; i < moves.length; i++)
      if (pieces[moves[i][2]][moves[i][3]] === KING)
        return true;
  }

  legalMovesForPieceAt(i, j) {
    return this.filterLegalMoves(this.movesForPieceAt(i, j));
  }

  allMovesForColor(color) {
    var i, j;
    var result = [];
    for (i = 0; i < 8; i++)
      for (j = 0; j < 8; j++)
        if (this.board.colors[i][j] === color)
          result = result.concat(this.movesForPieceAt(i, j));
    return result;
  }

  allLegalMovesForColor(color) {
    return this.filterLegalMoves(this.allMovesForColor(color));
  }

  checkWinner() {
    if (this.allLegalMovesForColor(BLACK).length === 0)
      return WHITE;

    if (this.allLegalMovesForColor(WHITE).length === 0)
      return BLACK;

    return null;
  }

  canMove(move) {
    const moves = this.legalMovesForPieceAt(move[0], move[1]);
    return moves.findIndex(m => m[2] === move[2] && m[3] === move[3]) !== -1;
  }
}
