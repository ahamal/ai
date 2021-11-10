import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { World, WorldView, UserAgent } from './world';
import './app.css';


function App() {
  return (
    <div className="app">
      <div className="title">
        Learning AI
      </div>
      <hr />
      <Router>
        <nav>
          <div>
            <Link to="/game">World Demo</Link>
          </div>
          <div>
            <Link to="/ai-1">Manual AI</Link>
          </div>
          <div>
            <Link to="/ai-2">Semi Manual AI</Link>
          </div>
          <div>
            <Link to="/ai-2">Semi Manual AI</Link>
          </div>
        </nav>

        <hr />

        <Switch>
          <Route path="/game">
            <WorldDemo />
          </Route>
          <Route path="/ai-1">
            AI 1
          </Route>
          <Route path="/ai-2">
            AI 2
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

function WorldDemo() {
  const
    [agent, ] = useState(_ => new UserAgent()),
    [world, ] = useState(_ => new World());
  
  useEffect(_ => agent.connect(world));
  
  return (
    <div className="world-demo">
      <WorldView world={world} />
    </div>
  );
}

export default App;