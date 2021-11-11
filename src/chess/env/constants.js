export const
  PAWN = 1, KNIGHT = 2, BISHOP = 3, ROOK = 4, QUEEN = 5, KING = 6,
  WHITE = 1, BLACK = 2;

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
    ],
    
  // other necessary states
  moved: {
    [WHITE]: { king: false, rookLeft: false, rookRight: false },
    [BLACK]: { king: false, rookLeft: false, rookRight: false }
  },
  
  // track the latest double push to check for en passant
  doublePushed: null,
  
  // tracking kings for optimization
  kings: { [BLACK]: [0, 4], [WHITE]: [7, 4] },
  
  // track number of steps
  step: 0
}

export const VECTORS = {
  [ROOK]: [[0, 1], [0, -1], [1, 0], [-1, 0]],
  [BISHOP]: [[1, 1], [-1, -1], [1, -1], [-1, 1]],
  [QUEEN]: [
    [0, 1], [0, -1], [1, 0], [-1, 0],
    [1, 1], [-1, -1], [1, -1], [-1, 1]
  ],
  [KNIGHT]: [
    [2, 1], [-2, -1], [-2, 1], [2, -1],
    [1, 2], [-1, -2], [-1, 2], [1, -2]
  ]
}

export const SPECIAL_MOVES = {
  DOUBLE_PUSH: 1,
  EN_PASSANT: 2,
  PROMOTE_TO_QUEEN: 3,
  PROMOTE_TO_ROOK: 4,
  PROMOTE_TO_BISHOP: 5,
  PROMOTE_TO_KNIGHT: 6,
  CASTLE_LEFT: 7,
  CASTLE_RIGHT: 8
};


// Few Helper Functions
export const withinBounds = (i, j) => (i >= 0 && i <=7 && j >=0 && j <= 7);