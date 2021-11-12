import React, { useEffect, useState } from "react";
// import { World, WorldView, UserAgent } from './world';
import './app.css';


function Demo() {
  // const
  //   [env, ] = useState(_ => new CartPoleEnv()),
  //   [world, ] = useState(_ => new World());
  
  useEffect(_ => agent.connect(world));
  
  return (
    <div className="world-demo">
      <WorldView world={world} />
    </div>
  );
}

export default Demo;