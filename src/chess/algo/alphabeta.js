import { BLACK, WHITE } from '../env/constants.js';
import { evaluate } from './scoring.js';


function alphabeta(match, depth, maximizing, alpha, beta, counter) {
  if (depth === 0) {
    counter.evaluated++;
    return evaluate(match.board);
  }
  
  const
    moves = match.getAllLegalMoves(),
    comparator = maximizing ? Math.max : Math.min;

  var value = maximizing ? -Infinity : Infinity;
  
  var i;
  if (maximizing) {
    for (i = 0; i < moves.length; i++) {
      match.applyMove(moves[i]);
      value = Math.max(value, alphabeta(match, depth - 1, false, alpha, beta, counter));
      alpha = Math.max(alpha, value);
      match.undo();
      if (alpha >= beta) break;
    }
  } else {
    for (i = 0; i < moves.length; i++) {
      match.applyMove(moves[i]);
      value = Math.min(value, alphabeta(match, depth - 1, true, alpha, beta, counter));
      beta = Math.min(beta, value);
      match.undo();
      if (alpha >= beta) break;
    }
  }
  return value;
}


export function moveFn(match, color) {
  var
    bestMove = null,
    bestScore = null,
    maximize = color === WHITE,
    counter = { evaluated: 0 },
    startTime = new Date().getTime(),
    depth = 4;
  
  match.getAllLegalMoves().forEach(move => {
    match.applyMove(move);
    const score = alphabeta(match, depth - 1, !maximize, -Infinity, Infinity, counter);
    match.undo();
    
    if (
      bestScore === null ||
      (maximize && bestScore < score) ||
      (!maximize && bestScore > score)
    ) {
      bestScore = score;
      bestMove = move;
    }
  });
  console.log('- - - Move Stats - - -');
  console.log('Total nodes evaluated: ', counter.evaluated);
  console.log('Time taken: ', (new Date().getTime() - startTime) / 1000);
  console.log('Depth', depth);
  
  return bestMove;
}