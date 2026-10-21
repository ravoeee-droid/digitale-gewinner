import React from 'react';
import {Composition} from 'remotion';
import {Reel} from './Reel.jsx';
import {demo} from './demo.js';
import {Job1, job1Duration} from './Job1.jsx';
import {Job2, job2Duration} from './Job2.jsx';
import {Ad1, adDuration} from './Ad1.jsx';
import {Reel3} from './Reel3.jsx';
import {cfg4011, cfg4012, cfg4013, cfg4019, cfg4020, cfg4021, cfg4022, dur} from './Configs.jsx';
export const Root = () => (
  <>
  <Composition id="R4011" component={Reel3} width={1080} height={1920} fps={30} durationInFrames={dur(cfg4011)} defaultProps={{cfg: cfg4011}} />
  <Composition id="R4012" component={Reel3} width={1080} height={1920} fps={30} durationInFrames={dur(cfg4012)} defaultProps={{cfg: cfg4012}} />
  <Composition id="R4019" component={Reel3} width={1080} height={1920} fps={30} durationInFrames={dur(cfg4019)} defaultProps={{cfg: cfg4019}} />
  <Composition id="R4020" component={Reel3} width={1080} height={1920} fps={30} durationInFrames={dur(cfg4020)} defaultProps={{cfg: cfg4020}} />
  <Composition id="R4021" component={Reel3} width={1080} height={1920} fps={30} durationInFrames={dur(cfg4021)} defaultProps={{cfg: cfg4021}} />
  <Composition id="R4022" component={Reel3} width={1080} height={1920} fps={30} durationInFrames={dur(cfg4022)} defaultProps={{cfg: cfg4022}} />
  <Composition id="R4013" component={Reel3} width={1080} height={1920} fps={30} durationInFrames={dur(cfg4013)} defaultProps={{cfg: cfg4013}} />
  <Composition id="Ad1" component={Ad1} width={1080} height={1920} fps={30} durationInFrames={adDuration} />
  <Composition id="Job2" component={Job2} width={1080} height={1920} fps={30} durationInFrames={job2Duration} />
  <Composition id="Job1" component={Job1} width={1080} height={1920} fps={30} durationInFrames={job1Duration} />
  <Composition id="Reel" component={Reel} width={1080} height={1920} fps={30}
    durationInFrames={demo.durationInFrames} defaultProps={demo} />
  </>
);
