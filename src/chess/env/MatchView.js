import React from 'react';
import './MatchView.css'
import { PIECE_UNICODE, WHITE } from './constants.js';

function MatchView({ match }) {
  const
    board = match.board,
    [step, setStep] = React.useState(match.board.step),
    [selected, select] = React.useState(null),
    [moves, setMoves] = React.useState([]);
  
  React.useEffect(_ => match.onChange(_ => setStep(match.board.step)), [match]);
  
  function handleSquareClick({i, j}) {
    if (selected) {
      const move = moves.find(m => m[2] === i && m[3] === j);
      select(null); setMoves([]);
      if (move)
        match.applyMove(move, true);
    }
    else if (board.pieces[i][j]) {
      select({i, j});
      setMoves(match.getLegalMovesFor(i, j));
    }
  }
  
  function undo() {
    match.undo(true);
  }
  
  return (
    <div className="match-view">
      <div className="board">
      	{ board.pieces.map((row, i) => (
          <div key={i} className="row">
            { row.map((piece, j) => {
              var className = 'square';
              if ((i + j + 1) % 2 === 0)
                className += ' dark';
              if (piece)
                className += ' has-piece';
              if (selected && selected.i === i && selected.j === j)
                className += ' selected';
              if (moves.find(move => move[2] === i && move[3] === j))
                className += ' can-move'
              return (
                <div key={j} className={className} onClick={ _ => handleSquareClick({i, j}) }>
                  { piece ? PIECE_UNICODE[board.colors[i][j]][piece] : ' ' }
                </div>
              )
            })}
          </div>
        ))}
        
      	{ match.moveHistory.length > 0 && (
          <div className="undo-button" onClick={undo}>undo</div>
        )}
      </div>
      
      <div className="state">
        <span>
          step: {step},
          turn: {match.turn === WHITE ? 'white': 'balck' }, 
          state: { {0: 'clear', 1: 'check', 2: 'checkmate', 3: 'stalemate' }[match.matchState()] }
        </span>
      </div>
    </div>
  );
}

export default MatchView;