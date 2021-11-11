import { NEW_BOARD, WHITE, BLACK } from './constants.js';
import gatherMovesForSquare from './gatherMovesForSquare.js';
import applyMove from './applyMove.js';
import undoMove from './undoMove.js';
import isAttacked from './isAttacked.js';

export const MATCH_STATES = {
  CLEAR: 0,
  CHECK: 1,
  CHECKMATE: 2,
  STALEMATE: 3
}

class Match {
  constructor(board) {
    this.makeNewBoard();
  }
  
  makeNewBoard() {
    this.board = JSON.parse(JSON.stringify(NEW_BOARD));
    this.undoHistory = [];
    this.moveHistory = [];
  }
  
  get turn() {
    return this.board.step & 1 ? BLACK : WHITE;
  }
  
  getAllMoves() {
    const moves = [];
    for (var i = 0; i < 8; i++)
      for (var j = 0; j < 8; j++)
        if (this.board.colors[i][j] === this.turn)
          gatherMovesForSquare(moves, this.board, i, j);
    return moves;
  }
  
  getMovesFor(i, j) {
    const moves = [];
    if (this.board.colors[i][j] === this.turn)
      gatherMovesForSquare(moves, this.board, i, j);
    return moves;
  }
  
  filterLegalMoves(moves) {
    const myColor = this.turn;
    return moves.filter(m => {
      this.applyMove(m);
      const isChecked = this.colorIsChecked(myColor);
      this.undo();
      return !isChecked;
    });
  }
  
  getLegalMovesFor(i, j) {
    return this.filterLegalMoves(this.getMovesFor(i, j));
  }
  
  getAllLegalMoves() {
    return this.filterLegalMoves(this.getAllMoves());
  }
  
  applyMove(move, trigger) {
    const diff = applyMove(this.board, move);
    this.moveHistory.push(move);
    this.undoHistory.push(diff);
    
    if (trigger)
        this.triggerChange();
  }
  
  undo(trigger) {
    const diff = this.undoHistory.pop();
    this.moveHistory.pop();
    undoMove(this.board, diff);
    
    if (trigger)
        this.triggerChange();
  }
  
  colorIsChecked(color) {
    const k = this.board.kings[color];
    return isAttacked(this.board, k[0], k[1]);
  }
  
  isChecked() {
    return this.colorIsChecked(this.turn);
  }
  
  matchState() {
    const
      checked = this.isChecked(),
      cantMove = this.getAllLegalMoves().length === 0;
    return (
      (checked && cantMove) ? MATCH_STATES.CHECKMATE :
        (!checked && cantMove) ? MATCH_STATES.STALEMATE :
          (checked) ? MATCH_STATES.CHECK : MATCH_STATES.CLEAR
    );
  }
  
  // event management
  listeners = new Set();
  onChange(cb) {
    this.listeners.add(cb);
    return _ => this.listeners.delete(cb);
  }
  
  triggerChange() {
    this.listeners.forEach(cb => cb());
  }
}

export default Match;