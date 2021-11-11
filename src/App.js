import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import './App.css';

import ChessDemo from './chess/env/Demo';


const navContents = [
  {
    title: 'AGI',
    links: [
      { to: "/0-motive", title: "Motivation" },
      { to: "/1-ci", title: "Identity/Continuity" },
      { to: "/2-assumption", title: "Assumptions, Hirearchy" },
      { to: "/3-policy", title: "Policies, Curiosity and Planning" }
    ]
  },
  
  {
    title: 'Chess',
    links: [
      { to: "/chess", title: "Environment", View: ChessDemo },
      { to: "/chess-scoring", title: "Scoring" },
      { to: "/chess-minimax", title: "Minimax" },
    ]
  },

    {
    title: 'Tic Tac Toe',
    links: [
      { to: "/tictactoe-env", title: "Environment", View: ChessDemo },
      { to: "/tictactoe-minimax", title: "Minimax" },
    ]
  },

  {
    title: 'OpenAI Taxi v2',
    links: [
      { to: "/taxi-env", title: "Environment" },
      { to: "/taxi-rl", title: "Reinforcement Learning" },
    ]
  },
  {
    title: 'OpenAI Cartpole',
    links: [
      { to: "/cartpole-env", title: "Environment" },
      { to: "/cartpole-drl", title: "Deep Reinforcement Learning" }
    ]
  }
]


export default function App() {
  return (
    <div className="app">
      <Router>
        <nav className="nav-container">
          <Nav />
        </nav>
        <div className="page-container">
          <Route component={Page} />
        </div>
      </Router>
    </div>
  )
}

function Nav() {
  return (
    <div className="nav-contents">
      <Link to="/" className="title">AI Research</Link>
      
      { navContents.map((o, i) => (
        <section key={i}>
          <div className="section-title">{o.title}</div>
          { o.links.map((link, j) => (
            <div className="article-link" key={j}>
              <Link to={link.to}>{link.title}</Link>
              { link.more && (<span className="more">&nbsp;{link.more}</span>) }
            </div>
          )) }
        </section>
      )) }
    </div>
  )
}

function Page({ location }) {
  const
    link = navContents.reduce(
      (prev, o) => prev || o.links.find(l => l.to === location.pathname),
      null
    ),
    title = link && link.title,
    View = (link && link.View) || Blank;

    return (
      <>
        <div className="page-title">{title}</div>
        <div className="page">
          <View />
        </div>
      </>
  )
}

function Blank() {
  return (<div>Blank Page</div>)
}