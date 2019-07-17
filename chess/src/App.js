import React from 'react';
import { ChessBoard as Board, PIECE_UNICODE, WHITE, BLACK } from './chess';
import { smartBotMove } from './bot';

import './App.css';

class Game {
  constructor() {
    this.board = new Board();
    this.at = 'home';
  }

  move(move) {    
    if (this.at !== 'game')
      return 'Game not started.';

    const
      board = this.board;

    if (this.turn !== board.colorAt(move[0], move[1]))
      return 'Not your turn';

    if (!board.canMove(move))
      return 'Invalid Move';
    
    board.movePiece(move);
    this.turn = this.turn === WHITE ? BLACK : WHITE;

    var winner = board.checkWinner();
    if (winner) {
      this.winner = winner;
      this.at = 'end';
    }

    this.triggerChange();
  }

  newGame(i) {
    this.board.newBoard();
    this.at = 'game';
    this.turn = WHITE;
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
    if (this.game.at === 'game' && this.game.turn === BLACK)
      setTimeout(_ => this.move(), 100);
  }

  move() {
    const move = smartBotMove(this.game.board, BLACK);

    if (move)
      return this.game.move(move);
    
    alert('Can\t find a move')
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
    return this.game.move([i1, j1, i2, j2]);
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

function HomeScreen({ game }) {
  return (
    <div className="home-screen">
      <h1>Chess</h1>
      <button onClick={_ => game.newGame()}>
        New Game
      </button>
    </div>
  )
}

function EndScreen({ game }) {
  return (
    <div className="end-screen">
      <ChessBoard board={game.board.board} onCellClick={_ => _}/>
      <div className="text-center">
        <h2>{ game.winner === BLACK ? 'Black' : 'White' } Wins</h2>
        <button onClick={_ => game.newGame()}>
          New Game
        </button>
      </div>
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
        {this.game.at === 'home' && (
          <HomeScreen game={this.game} />
        ) }

        { this.game.at === 'game' && (
          <ChessBoard
            board={this.game.board.board}
            onCellClick={this.handleCellClick}
            selected={this.state.selected}
            allowedMoves={this.state.allowedMoves}
            focus={this.state.focus} />
        ) }

        { this.game.at === 'end' && (
          <EndScreen game={this.game} />
        ) }
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
        allowedMoves: board.legalMovesForPieceAt(i, j)
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