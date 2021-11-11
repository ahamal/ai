import React, { useState } from 'react';
import MatchView from './MatchView.js';
import Match from './Match.js';


export default function Demo() {
  const [match, ] = useState(_ => new Match());
  return (
    <div>
      <MatchView match={match} />
    </div>
  )
}