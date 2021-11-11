import { BLACK, WHITE } from '../env/constants.js';
import { evaluate } from './scoring.js';


// for debugging
var evaluated = 0;

function minimax(match, depth, maximizing) {
  if (depth === 0) {
    evaluated++;
    return evaluate(match.board);
  }
  
  // worst case
  var value = maximizing ? -Infinity : Infinity;

  match.getAllLegalMoves().forEach(move => {
    match.applyMove(move);
    value = (
      maximizing ?
        Math.max(value, minimax(match, depth - 1, false)) :
        Math.min(value, minimax(match, depth - 1, false))
    );
    match.undo();
  });
  
  return value;
}

// since our minimax returns only value and not move,
// we do the following again
export function moveFn(match, color) {
  var
    bestMove = null,
    bestScore = null,
    maximize = color === WHITE;
  
  match.getAllLegalMoves().forEach(move => {
    match.applyMove(move);
    const score = minimax(match, 3, !maximize);
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
  
  return bestMove;
}