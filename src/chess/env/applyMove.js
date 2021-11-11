import {
    KING, QUEEN, ROOK, BISHOP, KNIGHT,
    SPECIAL_MOVES
  } from './constants.js';
  
  const applyMove = (board, move) => {
    const
      [i1, j1, i2, j2, special] = move,
      { pieces, colors } = board,
      color = colors[i1][j1];
    
    // move piece
    const newPiece = (
      special === SPECIAL_MOVES.PROMOTE_TO_QUEEN ? QUEEN :
        special === SPECIAL_MOVES.PROMOTE_TO_ROOK ? ROOK :
          special === SPECIAL_MOVES.PROMOTE_TO_BISHOP ? BISHOP :
            special === SPECIAL_MOVES.PROMOTE_TO_KNIGHT ? KNIGHT :
              pieces[i1][j1]
    );
    
    const diff = {
      squares: [
        [i1, j1, pieces[i1][j1], colors[i1][j1]], 
        [i2, j2, pieces[i2][j2], colors[i2][j2]]
      ],
      color: color
    };
    // move
    pieces[i2][j2] = newPiece;
    colors[i2][j2] = colors[i1][j1];
    pieces[i1][j1] = null;
    colors[i1][j1] = null;
    
    if (special) {
      if (special === SPECIAL_MOVES.EN_PASSANT) {
        diff.squares.push([i1, j2, pieces[i1][j2], colors[i1][j2]]);
        
        colors[i1][j2] = null;
        pieces[i1][j2] = null;
      } else if (special === SPECIAL_MOVES.CASTLE_LEFT) {
        diff.squares.push([i2, 0, ROOK, color]);
        diff.squares.push([i2, 2, null, null]);
        
        colors[i2][0] = null; pieces[i2][0] = null;
        colors[i2][2] = color; pieces[i2][2] = ROOK;
      } else if (special === SPECIAL_MOVES.CASTLE_RIGHT) {
        diff.squares.push([i2, 7, ROOK, color]);
        diff.squares.push([i2, 5, null, null]);
        
        colors[i2][7] = null; pieces[i2][7] = null;
        colors[i2][5] = color; pieces[i2][5] = ROOK;
      }
    }
    
    diff.doublePushed = board.doublePushed;
    if (special === SPECIAL_MOVES.DOUBLE_PUSH) {
      board.doublePushed = j2;
    } else if (board.doublePushed !== null) {
      board.doublePushed = null;
    }
  
    // check for moved
    if (pieces[i2][j2] === KING) {
      board.kings[color][0] = i2;
      board.kings[color][1] = j2;
      diff.king = [i1 , j1];
      
      if (board.moved[color].king === false) {
        diff.kingMoveChange = true;
        board.moved[color].king = true;
      }
    } else if (pieces[i2][j2] === ROOK && j1 === 0 && board.moved[color].rookLeft === false) {
      diff.rookLeftChange = true;
      board.moved[color].rookLeft = true;
    } else if (pieces[i2][j2] === ROOK && j1 === 7 && board.moved[color].rookRight === false) {
      diff.rookRightChange = true;
      board.moved[color].rookRight = true;
    }
    
    board.step += 1;
    return diff;
  }
  
  export default applyMove;