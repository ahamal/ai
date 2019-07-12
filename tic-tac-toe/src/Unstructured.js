import React from 'react';
import './App.css';
import _ from 'lodash';
import { checkWin, smarterBotMove, EMPTY_BOARD } from './helpers';

function TicTacToeBoard({ board, onClickCell }) {
  return (
    <div className="tic-tac-toe-board">
      {board.map((row, i) => (
        <div className="row" key={i}>
          {row.map((cell, j) => (
            <div
              key={j}
              className="cell"
              onClick={e => onClickCell(i, j)}>
              {cell === 1 ? 'o' : cell === 2 ? 'x' : ''}
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

class Unstructured extends React.Component {
  constructor() {
    super();
    this.state = {
      board: EMPTY_BOARD,
      at: 'initial',
      playerTurn: null
    }
  }

  render = () => {
    return (
      <div className="App">
        <TicTacToeBoard
          board={this.state.board}
          onClickCell={this.handleClick} />
        
        { this.state.at === 'end-game' && (
          <div className="winner">
            Winner - {
              this.state.winner === 1 ? 'Player' : 
              this.state.winner === 2 ? 'Bot' : 
              'Tie'  
            }
          </div>
        )}

        {this.state.at !== 'in-game' && (
          <div className="buttons">
              <button onClick={_ => this.newGame(1)}>
                I go first
              </button>
              <button onClick={_ => this.newGame(2)}>
                Bot goes first
              </button>
          </div>
        )}
      </div>
    );
  }

  newGame(playerId) {
    this.setState({
      board: _.cloneDeep(EMPTY_BOARD),
      turn: playerId,
      at: 'in-game'
    }, _ => this.checkBot());
  }

  handleClick = (i, j) => {
    var feedback = this.mark(i, j, 1);
    if (feedback)
      alert(feedback);
  }

  mark(i, j, player) {
    if (this.state.at !== 'in-game')
      return 'start a game';

    if (this.state.turn !== player)
      return 'Not your turn';
    
    const { board } = this.state;
    if (board[i][j] !== null)
      return 'Already marked';

    board[i][j] = player;

    this.setState({
      board: board,
      turn: (player === 1 ? 2 : 1)
    }, _ => {
      this.checkWin(_ => {
        this.checkBot();
      });
    })
  }

  checkBot() {
    if (this.state.turn === 2 && this.state.at === 'in-game')
      this.botMoves();
  }

  checkWin(cb) {
    const
      { board } = this.state,
      won = checkWin(board);

    if (won)
      this.setState({
        at: 'end-game',
        winner: won
      }, cb)
    else
      cb();
  }

  botMoves() {
    const { board } = this.state;
    const { i, j } = smarterBotMove(board);
    this.mark(i, j, 2);
  }
}

export default Unstructured;