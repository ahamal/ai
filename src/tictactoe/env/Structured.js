import React from 'react';
import './App.css';
import _ from 'lodash';

import { checkWin, smarterBotMove, EMPTY_BOARD } from './helpers';

class Game {
  constructor() {
    this.board = EMPTY_BOARD;
    this.at = 'initial';
    this.playerTurn = null;
  }

  players = {}

  addPlayer(player, id) {
  }

  move(id, i, j) {
    if (this.at !== 'in-game')
      return 'Game not started.';
    
    if (this.playerTurn !== id)
      return 'Not your turn';

    this.board[i][j] = id;
    this.playerTurn = this.playerTurn === 1 ? 2 : 1;

    var winner = checkWin(this.board);
    if (winner) {
      this.winner = winner;
      this.at = 'end-game';
    }

    this.triggerChange();
  }

  newGame(i) {
    this.board = _.cloneDeep(EMPTY_BOARD);
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
    const {i, j} = smarterBotMove(this.game.board);
    this.game.move(2, i, j)
  }
}

class Human {
  joinGame(game) {
    game.onChange(this.handleGameChange);
  }

  handleGameChange() {
  }
  
  handleClick(i, j) {
    return game.move(1, i, j)
  }
}


const
  game = new Game(),
  bot = new Bot(),
  human = new Human();

bot.joinGame(game);
human.joinGame(game);



function GameDisplay({ game, onClickCell }) {
  return (
    <div className="tic-tac-toe-board">
      {game.board.map((row, i) => (
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

      {game.at === 'end-game' && (
        <div className="winner">
          Winner - {
            game.winner === 1 ? 'Player' :
              game.winner === 2 ? 'Bot' :
                'Tie'
          }
        </div>
      )}
    </div>
  )
}

class Structured extends React.Component {
  constructor() {
    super();
    this.unsubscribe = game.onChange(_ => this.forceUpdate());
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  render = () => {
    return (
      <div className="App">
        <GameDisplay
          game={game}
          onClickCell={this.handleClick} />

        {game.at !== 'in-game' && (
          <div className="buttons">
            <button onClick={_ => game.newGame(1)}>
              I go first
              </button>
            <button onClick={_ => game.newGame(2)}>
              Bot goes first
              </button>
          </div>
        )}
      </div>
    );
  }

  handleClick = (i, j) => {
    var feedback = human.handleClick(i, j);
    if (feedback) alert(feedback);
  }
}

export default Structured;
