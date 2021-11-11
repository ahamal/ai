import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import './App.css';


const navContents = [
  {
    title: 'Theory',
    links: [
      { to: "/0-motive", title: "Motivation" },
      { to: "/1-ci", title: "Identity/Continuity" },
      { to: "/2-assumption", title: "Assumptions, Hirearchy" },
      { to: "/3-policy", title: "Policies, Curiosity and Planning" }
    ]
  },
  {
    title: 'Classic AIs Examples',
    links: [
      { to: "/chess-minimax", title: "Chess", more: "Minimax" },
      { to: "/tic-tac-toe", title: "Tic Tac Toe", more: "Minimax" },
      { to: "/taxi-rl", title: "Taxi", more: "Reinforcement Learning" },
      { to: "/cartpole-drl", title: "Cartpole", more: "Deep Reinforcement Learning" }
    ]
  },
  {
    title: 'Environments',
    links: [
      { to: "/chess", title: "Chess" },
      { to: "/tic-tac-toe", title: "Tic-Tac-Toe" },
      { to: "/taxi-v2", title: "OpenAI Taxi v2" },
      { to: "/cartpole-v1", title: "OpenAI Cartpole v1" },
      { to: "/taxi-v2", title: "OpenAI Bipedal Walker" },
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
      <h4 className="title">AI Research</h4>
      
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
    Component = link.Component || Blank;

  return (
    <div className="page">
      {title}
      <Component />
    </div>
  )
}

function Blank() {
  return (<div>Blank Page</div>)
}