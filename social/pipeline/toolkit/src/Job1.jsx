import React from 'react';
import {AbsoluteFill, Sequence, OffthreadVideo, staticFile, interpolate, spring, useCurrentFrame, useVideoConfig, Easing} from 'remotion';
import data from './job1props.json';

const GOLD = '#d8a648', GOLD2 = '#f1ce84', BG = '#090806';
const SANS = 'Inter, "DejaVu Sans", Arial, sans-serif', SERIF = 'Georgia, "DejaVu Serif", serif';
const HL = ['genug', 'gefährlichste', '12', 'spät', 'viertel', 'gefallen', 'jetzt', 'glück'];
const END_PAD = 0.35, END_LEN = 3.2;
export const job1Duration = Math.ceil((data.total + END_PAD + END_LEN) * 30);

const Zoom = ({children, frame, fps}) => {
  const s = frame / fps;
  let scale = 1;
  data.segments.forEach(([a, b], i) => {
    if (s >= a && s < b) {
      const from = i % 2 === 0 ? 1.0 : 1.1; // Jump-Cut-Zoom wechselt pro Schnitt
      scale = interpolate(s, [a, b], [from, from + 0.05], {easing: Easing.out(Easing.quad)});
    }
  });
  return <AbsoluteFill style={{transform: `scale(${scale})`, transformOrigin: '50% 38%'}}>{children}</AbsoluteFill>;
};

const Captions = ({frame, fps}) => {
  const caps = data.captions, s = frame / fps;
  const cur = caps.filter((c) => c.start <= s).length - 1;
  if (cur < 0 || s > caps[caps.length - 1].end + 0.3) return null;
  const g = Math.floor(cur / 3) * 3, group = caps.slice(g, g + 3);
  return (
    <div style={{position: 'absolute', left: 80, right: 110, top: 1290, height: 190, display: 'flex', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap', gap: '0 40px'}}>
      {group.map((c, i) => {
        const active = g + i === cur;
        const clean = c.text.replace(/[.,?!]/g, '').toLowerCase();
        const hl = HL.includes(clean);
        const pop = spring({frame: frame - Math.round(c.start * fps), fps, config: {damping: 12, stiffness: 220}});
        return (
          <span key={g + i} style={{fontFamily: SANS, fontWeight: 900, fontSize: 82, lineHeight: 1.1, textTransform: 'uppercase',
            color: hl ? GOLD : active ? '#fff' : 'rgba(255,255,255,0.6)', WebkitTextStroke: '10px #000', paintOrder: 'stroke fill',
            opacity: s >= c.start ? 1 : 0, transform: `scale(${active ? 0.86 + pop * 0.18 : 1})`, textShadow: '0 6px 24px rgba(0,0,0,0.6)'}}>{c.text.replace(/[.,]$/, '')}</span>
        );
      })}
    </div>
  );
};

const StatChip = ({frame, fps}) => {
  const start = data.captions.find((c) => c.text.startsWith('Heimsegment')).start;
  const end = data.captions.find((c) => c.text.startsWith('gefallen')).end + 1.2;
  const f0 = Math.round(start * fps), f1 = Math.round(end * fps);
  if (frame < f0 || frame > f1) return null;
  const p = spring({frame: frame - f0, fps, config: {damping: 14}});
  const out = interpolate(frame, [f1 - 8, f1], [1, 0], {extrapolateLeft: 'clamp'});
  const val = Math.round(interpolate(frame - f0, [4, 34], [0, -25], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)}));
  return (
    <div style={{position: 'absolute', left: 70, top: 285, opacity: p * out, transform: `translateY(${(1 - p) * -40}px)`, background: 'rgba(9,8,6,0.86)', border: `2px solid ${GOLD}`, borderRadius: 24, padding: '22px 34px', display: 'flex', alignItems: 'center', gap: 28}}>
      <div style={{fontFamily: SERIF, fontWeight: 700, fontSize: 118, color: '#fff', lineHeight: 1}}>≈{val} %</div>
      <div style={{fontFamily: SANS, fontSize: 30, color: GOLD2, lineHeight: 1.25, maxWidth: 360}}>
        PV-Dachanlagen bis 30 kW, 2025 ggü. 2024 (Leistung)
        <div style={{fontSize: 24, color: '#a89870', marginTop: 6}}>Quelle: BSW-Solar</div>
      </div>
    </div>
  );
};

const EndCard = ({frame, fps}) => {
  const p = spring({frame, fps, config: {damping: 16}});
  const lineW = interpolate(frame, [4, 24], [0, 520], {extrapolateRight: 'clamp', extrapolateLeft: 'clamp'});
  return (
    <AbsoluteFill style={{background: BG, justifyContent: 'center', alignItems: 'center', padding: 90, opacity: interpolate(frame, [0, 6], [0, 1])}}>
      <div style={{fontFamily: SANS, fontSize: 36, color: GOLD, letterSpacing: 8, textTransform: 'uppercase', opacity: p}}>Digitale Gewinner</div>
      <div style={{height: 3, width: lineW, background: GOLD, margin: '36px 0'}} />
      <div style={{fontFamily: SERIF, fontSize: 104, color: '#fff', textAlign: 'center', whiteSpace: 'pre-line', lineHeight: 1.12, transform: `translateY(${(1 - p) * 50}px)`, opacity: p}}>Heute voll.{'\n'}Und in zwölf Monaten?</div>
      <div style={{fontFamily: SANS, fontSize: 40, color: GOLD2, marginTop: 70, textAlign: 'center', whiteSpace: 'pre-line', opacity: interpolate(frame, [20, 34], [0, 1], {extrapolateRight: 'clamp'})}}>Schick das einem Chef,{'\n'}der sagt: „Ich hab genug."</div>
    </AbsoluteFill>
  );
};

export const Job1 = () => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();
  const endF = Math.round((data.total + END_PAD) * fps);
  const glow = interpolate(frame, [0, 9], [1, 0], {extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{background: BG}}>
      <Sequence durationInFrames={endF + 4}>
        <Zoom frame={frame} fps={fps}><OffthreadVideo src={staticFile('clean.mp4')} style={{width: '100%', height: '100%', objectFit: 'cover'}} /></Zoom>
        <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(9,8,6,0.25) 0%, rgba(9,8,6,0) 22%, rgba(9,8,6,0) 60%, rgba(9,8,6,0.55) 100%)'}} />
        <StatChip frame={frame} fps={fps} />
        <Captions frame={frame} fps={fps} />
        <AbsoluteFill style={{boxShadow: `inset 0 0 0 ${glow * 14}px ${GOLD}`}} />
        <div style={{position: 'absolute', left: 0, bottom: 0, height: 10, width: `${Math.min(1, frame / endF) * 100}%`, background: GOLD}} />
      </Sequence>
      <Sequence from={endF} durationInFrames={durationInFrames - endF}><EndCard frame={frame - endF} fps={fps} /></Sequence>
    </AbsoluteFill>
  );
};
