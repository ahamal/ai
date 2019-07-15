import React from 'react';
import './App.css';
import { NEW_BOARD, PIECE_UNICODE, movesForPieceAt } from './chess';
import _ from 'lodash';

class Game {
  constructor() {
    this.at = 'beginning';
    this.board = NEW_BOARD;
  }

  act(playerId, move) {
    if (this.at !== 'in-game')
      return 'Game not started.';

    if (this.playerTurn !== playerId)
      return 'Not your turn';

    // if (!canMove(this.board, move))
    // this.board[i][j] = id;
    // this.playerTurn = this.playerTurn === 1 ? 2 : 1;

    // var winner = checkWin(this.board);
    // if (winner) {
    //   this.winner = winner;
    //   this.at = 'end-game';
    // }

    this.triggerChange();
  }

  newGame(i) {
    this.board = _.cloneDeep(NEW_BOARD);
    this.at = 'in-game';
    this.playerTurn = i;
    
    this.triggerChange();
  }

  listeners = new Set();
  onChange(cb) {
    this.listeners.add(cb);
    return _ => this.listeners.delete(cb);
  }

  triggerChange() {
    this.listeners.forEach(l => l());
  }
}


function ChessBoard({ board, onCellClick, focus }) {
  return (
    <div className="chess-board">
      { board.pieces.map((row, i) => (
        <div
          key={i}
          className="chess-row">
          { row.map((piece, j) => (
            <div
              key={j}
              className={
                'chess-cell' +
                (focus && focus[0].findIndex(f => f[0] === i && f[1] === j) !== -1 ? ' focus0' : '') + 
                (focus && focus[1].findIndex(f => f[0] === i && f[1] === j) !== -1 ? ' focus1' : '')
              }
              onClick={_ => onCellClick(i, j)}>
              { piece ?
                  PIECE_UNICODE[board.colors[i][j]][piece] :
                  <>&nbsp;</>
              }
            </div>
          )) }
        </div>
      )) }
    </div>
  )
}


class App extends React.Component {
  constructor() {
    super();
    this.game = new Game();
    this.game.onChange(_ => this.forceUpdate());
    this.state = {};
  }

  render() {
    return (
      <div className="app">
        <ChessBoard
          board={this.game.board}
          onCellClick={this.handleCellClick}
          focus={this.state.focus}/>
      </div>
    );
  }

  handleCellClick = (i, j) => {
    this.setState({
      focus: [
        [[i, j]],
        movesForPieceAt(this.game.board, i, j)
      ]
    }, _ => console.log(this.state))
  }
}

export default App;
