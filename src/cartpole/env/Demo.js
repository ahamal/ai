import React, { useEffect, useState } from "react";
import View from './View';
import Env from './Env';
import './Demo.css';

// import { World, WorldView, UserAgent } from './world';


function Demo() {
  const
    [env, ] = useState(_ => new Env()),
    [action, setAction] = useState();
  
  useEffect(_ => {
    var a = 0;
    const onKeyDown = event => {
      if (event.code === 'ArrowLeft') {
        setAction(0);
        a = -1;
      } else if (event.code === 'ArrowRight') {
        setAction(1);
        a = 1;
      }
    }

    const onKeyUp = _ => {
      a = 0;
    }

    const onInterval = _ => {
      env.step(a);
    }

    const interval = window.setInterval(onInterval, env.tau * 1000)
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return _ => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      window.clearInterval(interval);
    }
  }, [env])
  
  return (
    <div className="cartpole-demo">
      Cartpole Demo

      <View env={env} />
    </div>
  );
}

export default Demo;