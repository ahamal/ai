import { useEffect, useState } from 'react';
import './world.css'

export const
  ITEMS = {
    PLAYER: 1,
    GOAL: 2,
    TREE: 3,
    KEY: 4,
  },

  ACTIONS = {
    UP: 0,
    DOWN: 1,
    LEFT: 2,
    RIGHT: 3
  },

  DIM = [10, 10],
    
  INITIAL = [
    { type: ITEMS.PLAYER, x: 2, y: 7 },
    { type: ITEMS.GOAL, x: 7, y: 2 },
    { type: ITEMS.KEY, x: 7, y: 7 },
    { type: ITEMS.TREE, x: 2, y: 2 },
  ],

  EMOJIS = {
    [ITEMS.PLAYER]: '🧍',
    [ITEMS.GOAL]: '🏠',
    [ITEMS.TREE]: '🌳',
    [ITEMS.KEY]: '🔑',
  }

export class World {
  objects = INITIAL;
  dim = DIM;
  span = 25;

  actions = [ACTIONS.UP, ACTIONS.DOWN, ACTIONS.LEFT, ACTIONS.RIGHT];

  act(action) {
    const player = this.objects.find(v => v.type === ITEMS.PLAYER);
    var
      nx = player.x,
      ny = player.y,
      hit = false;


    if (action === ACTIONS.UP)
      ny -= 1;
    else if (action === ACTIONS.DOWN)
      ny += 1;
    else if (action === ACTIONS.LEFT)
      nx -= 1;
    else if (action === ACTIONS.RIGHT)
      nx += 1;
    
    this.objects.forEach(o => {
      if (o.type === ITEMS.TREE && o.x === nx && o.y === ny)
        hit = true;      
    });

    if (nx < 0 || ny < 0 || nx > DIM[0] || ny > DIM[0])
      hit = true;
    
    
    
    
    this.triggerChange();
    console.log(player);
  }

  changeListeners = new Set();
  onChange(fn) {
    this.changeListeners.add(fn);
    return _ => this.changeListeners.delete(fn);
  }

  triggerChange() {
    this.changeListeners.forEach(fn => fn())
  }
}

export function WorldView({ world }) {
  const [state, setState] = useState();
  useEffect(_ => world.onChange(_ => setState(Math.random())));

  return (
    <div className="world-v1">
      { Array(world.dim[1]).fill().map((_, i) => (
        <div className="row" key={i}>
          { Array(world.dim[0]).fill().map((_, j) => (
            <div
              className="square"
              key={j}
              style={{
                width: world.span,
                height: world.span,
                top: i * world.span,
                left: j * world.span
              }}></div>
          ))}
        </div>
      )) }
      
      { world.objects.map((v, i) => (
        <div
          style={{
            width: world.span,
            height: world.span,
            top: v.y * world.span,
            left: v.x * world.span
          }}
          key={i}
          className="emoji">
          { EMOJIS[v.type] }
        </div>
      )) }
    </div>
  );
}

export class UserAgent {
  connect(world) {
    this.world = world;
    window.addEventListener('keydown', this.onKey);
    // const offChange = world.onChange(this.onWorldChange);
    return _ => {
      // offChange();
      window.removeEventListener('keydown', this.onKey);
    }
  }

  onKey = (e) => {
    console.log(e.code);
    const action = ({
      'ArrowUp': ACTIONS.UP,
      'ArrowDown': ACTIONS.DOWN,
      'ArrowLeft': ACTIONS.LEFT,
      'ArrowRight': ACTIONS.RIGHT,
    })[e.code]
    this.world.act(action);
  }
}