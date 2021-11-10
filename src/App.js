import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import './App.css';

export default function App() {
  return (
    <div className="app">
      <Router>
        <nav className="left-nav">
          <div className="title">
            Learning AI
          </div>
          <hr />
          <section>
            <div>
              Environments
            </div>

            <div>
              <Link to="/chess">Chess</Link>
            </div>
            <div>
              <Link to="/tic-tac-toe">TicTacToe</Link>
            </div>
            <div>
              <Link to="/taxi-v2">OpenAI Taxi v2</Link>
            </div>
            <div>
              <Link to="/cartpole-v1">OpenAI Cartpole v1</Link>
            </div>
            <div>
              <Link to="/taxi-v2">OpenAI Bipedal Walker</Link>
            </div>
            <div>
              <Link to="/rompus-ai">Rompus World</Link>
            </div>
          </section>

          <section>
            <div>
              Minimax
            </div>

            <div>
              <Link to="/chess-minimax">Chess</Link>
            </div>
            <div>
              <Link to="/tic-tac-toe">TicTacToe</Link>
            </div>
          </section>

          <section>
            <div>
              Reinforcement Learning
            </div>
            <div>
              <Link to="/chess-minimax">Taxi</Link>
            </div>
          </section>

          <section>
            <div>
              Deep Reinforcement Learning
            </div>

            <div>
              <Link to="/cartpole-v1">Cartpole</Link>
            </div>
          </section>

          <section>
            <div>
              AGI Learning
            </div>

            <div>
              <Link to="/rompus-ai">Rompus World</Link>
            </div>
          </section>          
          
        </nav>

        <div className="content">
          <Switch>
            <Route path="/game">
            </Route>
            <Route path="/ai-1">
              AI 1
            </Route>
            <Route path="/ai-2">
              AI 2
            </Route>
          </Switch>
        </div>
      </Router>
    </div>
  )
}