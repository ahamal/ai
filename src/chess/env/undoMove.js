const undoMove = (board, diff) => {  
    const {squares, color } = diff;
    for (var c = 0; c < squares.length; c++) {
      var u = squares[c];
      board.pieces[u[0]][u[1]] = u[2];
      board.colors[u[0]][u[1]] = u[3];
    }
    if (diff.king) {
      board.kings[color][0] = diff.king[0];
      board.kings[color][1] = diff.king[1];
      if (diff.kingMoveChange)
        board.moved[color].king = false;
    }
    else if (diff.rookLeftChange)
      board.moved[color].rookLeft = false;
    else if (diff.rookRightChange)
      board.moved[color].rookRight = false;
    
    board.doublePushed = diff.doublePushed;
    board.step -= 1;
  }
  
  export default undoMove;