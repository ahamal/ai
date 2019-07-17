import {
  PAWN, BISHOP, KNIGHT, ROOK, QUEEN, KING,
  BLACK, WHITE
} from './chess';

const PIECE_POINTS = {
  [PAWN]: 1,
  [BISHOP]: 6,
  [KNIGHT]: 8,
  [ROOK]: 11,
  [QUEEN]: 18,
  [KING]: 16
}

function valueFunction(board, color) {
  var value = 0;
  for (var i = 0; i < 8; i++) {
    for (var j = 0; j < 8; j++) {
      var piece = board.pieces[i][j];
      if (piece)
        value += PIECE_POINTS[piece] * (color === board.colors[i][j] ? 1 : -1);
    }
  }
  return value + Math.random();
}

export function dumbBotMove(board, color) {
  const
    moves = board.allLegalMovesForColor(color),
    randomIndex = Math.floor(Math.random() * moves.length);

  return moves[randomIndex]
}

var evaluated, time;
export function smartBotMove(board, color) {
  var bestMove, bestScore = null;
  
  evaluated = 0;
  time = (new Date()).getTime();

  board.allLegalMovesForColor(color).forEach(move => {
    board.movePiece(move);
    var value = alphabeta(board, color, 3, false);
    if (bestScore === null || bestScore < value) {
      bestScore = value;
      bestMove = move;
    }
    board.undoMove();
  });

  console.log('Best Score: ', bestScore)
  console.log('Nodes Evaluated: ', evaluated);
  console.log('Time Taken: ', (new Date()).getTime() - time);

  return bestMove;
}


export function minimax(board, color, depth, maximizing) {
  evaluated++;

  if (depth === 0)
    return valueFunction(board.board, color);

  const
    turn = (maximizing === true ? color : (color === BLACK ? WHITE : BLACK)),
    moves = board.allMovesForColor(turn);

  if (moves.length === 0)
    return maximizing ? -Infinity : Infinity;

  var value;
  if (maximizing) {
    value = -Infinity;
    moves.forEach(move => {
      board.movePiece(move);
      value = Math.max(value, minimax(board, color, depth - 1, false));
      board.undoMove();
    });
  } else {
    value = Infinity;
    moves.forEach(move => {
      board.movePiece(move);
      value = Math.min(value, minimax(board, color, depth - 1, true));
      board.undoMove();
    });
  }
  return value;
}


export function alphabeta(board, color, depth, maximizing, alpha=-Infinity, beta=Infinity) {
  evaluated++;

  if (depth === 0)
    return valueFunction(board.board, color);

  const
    turn = (maximizing === true ? color : (color === BLACK ? WHITE : BLACK)),
    moves = board.allMovesForColor(turn);
  
  var value, ct;
  if (maximizing) {
    value = -Infinity;
    for (ct = 0; ct < moves.length; ct++) {
      board.movePiece(moves[ct]);
      value = Math.max(value, alphabeta(board, color, depth - 1, false, alpha, beta));
      alpha = Math.max(alpha, value);
      board.undoMove();
      if (alpha >= beta) break;
    }
  } else {
    value = Infinity;
    for (ct = 0; ct < moves.length; ct++) {
      board.movePiece(moves[ct]);
      value = Math.min(value, alphabeta(board, color, depth - 1, true, alpha, beta));
      beta = Math.min(beta, value);
      board.undoMove();
      if (alpha >= beta) break;
    }
  }

  return value;
}