import React, { useEffect, useState } from "react";
import { World, WorldView, UserAgent } from './world';
import './app.css';


function Demo() {
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

export default Demo;