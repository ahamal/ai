import {
    PAWN, KING, QUEEN, ROOK, BISHOP, KNIGHT,
    BLACK, WHITE, VECTORS, withinBounds
  } from './constants.js';
  
  const isAttacked = (board, i, j) => {
    const
      { pieces, colors } = board,
      color = colors[i][j],
      opponentColor = color === WHITE ? BLACK : WHITE;
    
    // check knights
    var c, v, i2, j2;
    for (c = 0; c < VECTORS[KNIGHT].length; c++) {
      v = VECTORS[KNIGHT][c];
      i2 = i + v[0];
      j2 = j + v[1];
      if (withinBounds(i2, j2) && pieces[i2][j2] === KNIGHT && colors[i2][j2] === opponentColor)
        return true;
    }
    
    // check rook, bishop, queen
    var u, oi, oj, di, dj, p;
    for (u = ROOK; u !== null; u = u === ROOK ? BISHOP : null) { // for ROOK & BISHOP
      for (c = 0; c < VECTORS[u].length; c++) {
        oi = 0; oj = 0;
        di = VECTORS[u][c][0]; dj = VECTORS[u][c][1];
        do {
          oi = oi + di; oj = oj + dj;
          p = withinBounds(i + oi, j + oj) && pieces[i + oi][j + oj];        
          if ((p === u || p === QUEEN) && colors[i + oi][j + oj] === opponentColor)
            return true;
        } while (p === null);
      }
    }
    
    // check pawns
    i2 = i + (color === WHITE ? -1 : 1);
    if (
      (withinBounds(i2, j - 1) && pieces[i2][j - 1] === PAWN && colors[i2][j - 1] === opponentColor) ||
      (withinBounds(i2, j - 1) && pieces[i2][j + 1] === PAWN && colors[i2][j + 1] === opponentColor)
    )
      return true;
    
    // check opponent King
    for(c = 0; c < VECTORS[QUEEN].length; c++) {
      v = VECTORS[QUEEN][c];
      i2 = i + v[0]; j2 = j + v[1];
      if (withinBounds(i2, j2) && pieces[i2][j2] === KING && colors[i2][j2] === opponentColor)
        return true;
    }
      
    return false;
  }
  
  export default isAttacked;