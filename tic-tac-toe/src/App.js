import React from 'react';
import './App.css';
import Unstructured from './Unstructured';
import Structured from './Structured';

class App extends React.Component{
  render = () => {
    return (
      <div className="App">
        {/* <Unstructured /> */}
        <Structured />
      </div>
    );
  }

  handleClick = (i, j) => {
    this.human.handleClick(i.j)
  }
}

export default App;
