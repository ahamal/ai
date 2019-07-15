import React from 'react';
import './App.css';
import {
  NEW_BOARD, PIECE_UNICODE, legalMovesForPieceAt,
  dumbBotMove
} from './chess';
import _ from 'lodash';

class Game {
  constructor() {
    this.at = 'beginning';
    this.board = NEW_BOARD;
  }

  move(playerId, move) {
    if (this.at !== 'in-game')
      return 'Game not started.';

    if (this.playerTurn !== playerId)
      return 'Not your turn';

    // if (!canMove(this.board, move))
    // this.board = movePiece(i, j, move);
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



class Bot {
  joinGame(game) {
    this.game = game;
    game.onChange(this.handleGameChange);
  }

  handleGameChange = () => {
    if (this.game.at === 'in-game' && this.game.playerTurn === 2)
      this.move();
  }

  move() {
    return this.game.move(2, dumbBotMove(this.game.board));
  }
}


class Human {
  joinGame(game) {
    this.game = game;
    game.onChange(this.handleGameChange);
  }

  handleGameChange() {
  }

  move(i1, j1, i2, j2) {
    return this.game.move(1, [i1, i2, j1, j2]);
  }
}


function ChessBoard({ board, onCellClick, selected, allowedMoves }) {
  return (
    <div className="chess-board">
      { board.pieces.map((row, i) => (
        <div key={i} className="chess-row">
          { row.map((piece, j) => {
            const
              pieceUnicode = piece && PIECE_UNICODE[board.colors[i][j]][piece],
              focus1 = selected && selected[0] === i && selected[1] === j,
              focus2 = selected && (
                allowedMoves.findIndex(f => f[2] === i && f[3] === j) !== -1
              );

            return (
              <div
                key={j}
                className={ 'chess-cell' + (focus1 ? ' cell-focus1' : '') }
                onClick={_ => onCellClick(i, j)}>
                { focus1 && <div className="focus1" /> }
                { focus2 && <div className="focus2" /> }
                { pieceUnicode ? 
                  <div className="piece">{pieceUnicode}</div> :
                  <>&nbsp;</>
                }
              </div>
            )
          }) }
        </div>
      )) }
    </div>
  )
}


class App extends React.Component {
  constructor() {
    super();
    this.game = new Game();
    this.human = new Human();
    this.bot = new Bot();

    this.human.joinGame(this.game);
    this.bot.joinGame(this.game);

    this.game.onChange(_ => this.forceUpdate());
    this.state = {};
  }

  render() {
    return (
      <div className="app">
        <ChessBoard
          board={this.game.board}
          onCellClick={this.handleCellClick}
          selected={this.state.selected}
          allowedMoves={this.state.allowedMoves}
          focus={this.state.focus} />
      </div>
    );
  }

  handleCellClick = (i, j) => {
    const
      { board } = this.game,
      { selected } = this.state;
    
    if (!this.state.selected) {
      this.setState({
        selected: [i, j],
        allowedMoves: legalMovesForPieceAt(board, i, j)
      })
    } else {
      var legalClick = this.state.allowedMoves.findIndex(move => move[2] === i && move[3] === j) !== -1;
      if (legalClick) {
        this.setState({ selected: null, allowedMoves: null });
        var feedback = this.human.move(selected[0], selected[1], i, j);
        if (feedback)
          alert(feedback);
      } else {
        this.setState({ selected: null, allowedMoves: null });
      }
    }
  }
}

export default App;