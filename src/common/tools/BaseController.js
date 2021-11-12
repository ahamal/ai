// import { useState, useEffect } from 'react';
import { Map } from 'immutable';
import Emitter from './Emitter';

class Controller {
  constructor() {
    this.emitter = new Emitter();
    this.state = new Map({});
  }

  setState = (s) => {
    this.state = this.state.merge(Map(s));
    this.emitter.emit('change');
  }

  getState = (s) => {
    return this.state;
  }

  emit() {
    this.emitter.emit.apply(this.emitter, arguments);
  }

  on() {
    return this.emitter.on.apply(this.emitter, arguments);
  }

  // usedState() {
  //   const [state, setState] = useState(this.state);
  //   useEffect(_ => this.on('change', _ => setState(this.state)), []);
  //   return state;
  // }
}

export default Controller;