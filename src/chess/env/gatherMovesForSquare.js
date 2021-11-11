import {
    PAWN, KING, QUEEN, ROOK, BISHOP, KNIGHT,
    BLACK, WHITE,  SPECIAL_MOVES, VECTORS,
    withinBounds
  } from './constants.js';
  
import isAttacked from './isAttacked.js';
  
  // for a direction vector [di, dj] starting position [i, j],
  // get all legal moves towards that direction
  
  const _addPawnMoves = (moves, i1, j1, i2, j2) => {
    if (i2 === 7 || i2 === 0) {
      moves.push([i1, j1, i2, j2, SPECIAL_MOVES.PROMOTE_TO_QUEEN]);
      moves.push([i1, j1, i2, j2, SPECIAL_MOVES.PROMOTE_TO_ROOK]);
      moves.push([i1, j1, i2, j2, SPECIAL_MOVES.PROMOTE_TO_KNIGHT]);
      moves.push([i1, j1, i2, j2, SPECIAL_MOVES.PROMOTE_TO_BISHOP]);
    } else {
      moves.push([i1, j1, i2, j2]);
    }
  }
  
  const addMovesForPawn = (moves, board, i, j) => {
    const
      { pieces, colors } = board,
      color = colors[i][j],
      opponentColor = color === BLACK ? WHITE : BLACK,
      imWhite = color === WHITE,
      forward = imWhite ? -1 : 1,
      i2 = i + forward;
  
    // step
    if (withinBounds(i2, j) && colors[i2][j] === null)
      _addPawnMoves(moves, i, j, i2, j);
  
    // double step
    if (
      ((imWhite && i === 6) || (!imWhite && i === 1)) &&
      withinBounds(i2 + forward, j) && colors[i2 + forward][j] === null
    )
      moves.push([i, j, i2 + forward, j, SPECIAL_MOVES.DOUBLE_PUSH]);
  
    // captures
    // for left and right
    for (var lr = -1; lr <= 1; lr += 2) {
      if (withinBounds(i2, j + lr) && colors[i2][j + lr] === opponentColor)
        _addPawnMoves(moves, i, j, i2, j + lr);
  
      // en passant
      if (
        i === (imWhite ? 3 : 4) &&
        pieces[i][j + lr] === PAWN && colors[i][j + lr] === opponentColor &&
        board.doublePushed === j + lr &&
        pieces[i2][j + lr] === null
      )
        moves.push([i, j, i2, j + lr, SPECIAL_MOVES.EN_PASSANT]);
    }
  }
  
  const addMovesForKnight = (moves, board, i, j) => {
    const
      { pieces, colors } = board,
      piece = pieces[i][j],
      color = colors[i][j],
      opponentColor = color === BLACK ? WHITE : BLACK;
    
    const knightVectors = VECTORS[piece];
    for (var c = 0; c < knightVectors.length; c++) {
      const
        i2 = i + knightVectors[c][0],
        j2 = j + knightVectors[c][1],
        p = withinBounds(i2, j2) && colors[i2][j2];
  
      if (p === null || p === opponentColor)
        moves.push([i, j, i2, j2]);
    }
  }
  
  // Bishop, Rook, Queen
  const addMovesForPower = (moves, board, i, j) => {
    const
      { pieces, colors } = board,
      color = colors[i][j],
      opponentColor = color === BLACK ? WHITE : BLACK,
      piece = pieces[i][j],
      vectors = VECTORS[piece];
  
    for (var c = 0; c < vectors.length; c++) {
      var oi = 0, oj = 0, p;
      do {
        oi = oi + vectors[c][0];
        oj = oj + vectors[c][1];
        p = withinBounds(i + oi, j + oj) && colors[i + oi][j + oj];
        if (p === null || p === opponentColor)
          moves.push([i, j, i + oi, j + oj]);
      } while (p === null);
    }
  }
  
  
  const addMovesForKing = (moves, board, i, j) => {
    const
      { pieces, colors } = board,
      color = colors[i][j],
      opponentColor = color === BLACK ? WHITE : BLACK,
      vectors = VECTORS[QUEEN];
    
    for(var c = 0; c < vectors.length; c++) {
      const
        i2 = i + vectors[c][0],
        j2 = j + vectors[c][1],
        p = withinBounds(i2, j2) && colors[i2][j2];
  
      if (p === null || p === opponentColor)
        moves.push([i, j, i2, j2]);
    };
      
    if (!board.moved[color].king && !isAttacked(board, i, j)) {
      if (
        !board.moved[color].rookLeft &&
        pieces[i][1] === null && pieces[i][2] === null && pieces[i][3] === null
      )
        moves.push([i, j, i, 1, SPECIAL_MOVES.CASTLE_LEFT]);
      
      if (
        !board.moved[color].rookRight && 
        pieces[i][5] === null && pieces[i][6] === null
        )
        moves.push([i, j, i, 6, SPECIAL_MOVES.CASTLE_RIGHT]);
    }
  }
  
  const gatherMovesForSquare = (moves, board, i, j) => {
    const piece = board.pieces[i][j];
    if (piece === PAWN) {
      return addMovesForPawn(moves, board, i, j);
    } else if (piece === ROOK || piece === BISHOP || piece === QUEEN) {
      return addMovesForPower(moves, board, i, j);
    } else if (piece === KNIGHT) {
      return addMovesForKnight(moves, board, i, j);
    } else if (piece === KING) {
      return addMovesForKing(moves, board, i, j);
    }
  }
  
  export default gatherMovesForSquare;