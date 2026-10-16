import React from 'react';
import {Composition} from 'remotion';
import {Reel} from './Reel.jsx';
import {demo} from './demo.js';
export const Root = () => (
  <Composition id="Reel" component={Reel} width={1080} height={1920} fps={30}
    durationInFrames={demo.durationInFrames} defaultProps={demo} />
);
