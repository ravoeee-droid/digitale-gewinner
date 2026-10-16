import React from 'react';
import {AbsoluteFill, Sequence, Video, interpolate, spring, useCurrentFrame, useVideoConfig, Easing} from 'remotion';

const GOLD = '#d8a648', GOLD2 = '#f1ce84', BG = '#090806';
const FONT = 'Georgia, "DejaVu Serif", serif';
const SANS = 'Inter, "DejaVu Sans", Arial, sans-serif';

const Background = ({src, frame, fps, zooms}) => {
  const s = frame / fps;
  let scale = 1;
  for (let i = 0; i < zooms.length - 1; i++) {
    const [t0, a] = zooms[i], [t1, b] = zooms[i + 1];
    if (s >= t0 && s < t1) scale = interpolate(s, [t0, t1], [a, b], {easing: Easing.inOut(Easing.cubic)});
  }
  return (
    <AbsoluteFill style={{background: BG, transform: `scale(${scale})`}}>
      {src ? <Video src={src} style={{width: '100%', height: '100%', objectFit: 'cover'}} /> : (
        <AbsoluteFill style={{background: `radial-gradient(circle at 50% 35%, #2a2012 0%, ${BG} 70%)`}}>
                  </AbsoluteFill>
      )}
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(9,8,6,0.35) 0%, rgba(9,8,6,0) 30%, rgba(9,8,6,0) 55%, rgba(9,8,6,0.75) 100%)'}} />
    </AbsoluteFill>
  );
};

const Captions = ({captions, highlight, frame, fps}) => {
  const s = frame / fps;
  // Gruppen aus 3 Woertern, Position in Safe Zone (y ~ 1180-1250)
  const idx = captions.findIndex((c) => s >= c.start && s < c.end + 0.03);
  const cur = idx === -1 ? captions.filter((c) => c.start <= s).length - 1 : idx;
  if (cur < 0 || s > captions[captions.length - 1].end + 0.4) return null;
  const g = Math.floor(cur / 3) * 3;
  const group = captions.slice(g, g + 3);
  return (
    <div style={{position: 'absolute', left: 90, right: 120, top: 1130, height: 200, display: 'flex', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap', gap: '0 44px'}}>
      {group.map((c, i) => {
        const active = g + i === cur;
        const clean = c.text.replace(/[.,]/g, '').toLowerCase();
        const hl = highlight.some((h) => clean.includes(h));
        const pop = spring({frame: frame - Math.round(c.start * fps), fps, config: {damping: 12, stiffness: 220}});
        const vis = s >= c.start;
        return (
          <span key={g + i} style={{
            fontFamily: SANS, fontWeight: 900, fontSize: 84, lineHeight: 1.1, textTransform: 'uppercase',
            color: active || hl ? (hl ? GOLD : '#fff') : 'rgba(255,255,255,0.55)',
            WebkitTextStroke: '10px #000', paintOrder: 'stroke fill',
            opacity: vis ? 1 : 0, transform: `scale(${active ? 0.85 + pop * 0.2 : 1})`,
            textShadow: '0 6px 24px rgba(0,0,0,0.6)',
          }}>{c.text}</span>
        );
      })}
    </div>
  );
};

const Stat = ({stat, frame, fps}) => {
  const f0 = Math.round(stat.at * fps), f1 = Math.round(stat.until * fps);
  if (frame < f0 || frame > f1) return null;
  const inP = spring({frame: frame - f0, fps, config: {damping: 14}});
  const out = interpolate(frame, [f1 - 8, f1], [1, 0], {extrapolateLeft: 'clamp'});
  const val = Math.round(interpolate(frame - f0, [6, 36], [stat.from, stat.to], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)}));
  const bar = interpolate(frame - f0, [6, 36], [0, Math.abs(stat.to) * 3.2], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
  return (
    <div style={{position: 'absolute', left: 90, right: 90, top: 290, opacity: out * inP, transform: `translateY(${(1 - inP) * 60}px)`,
      background: 'rgba(9,8,6,0.82)', border: `2px solid ${GOLD}`, borderRadius: 28, padding: '44px 52px'}}>
      <div style={{fontFamily: SANS, fontSize: 38, color: GOLD2, letterSpacing: 3, textTransform: 'uppercase'}}>{stat.label}</div>
      <div style={{fontFamily: FONT, fontSize: 210, fontWeight: 700, color: '#fff', lineHeight: 1.05}}>{val}{stat.suffix}</div>
      <div style={{height: 18, width: 760, background: '#2a2012', borderRadius: 9, marginTop: 10}}>
        <div style={{height: 18, width: bar, background: `linear-gradient(90deg, ${GOLD}, ${GOLD2})`, borderRadius: 9}} />
      </div>
      <div style={{fontFamily: SANS, fontSize: 30, color: '#a89870', marginTop: 20}}>{stat.note}</div>
    </div>
  );
};

const EndCard = ({card, frame, fps}) => {
  const p = spring({frame, fps, config: {damping: 16}});
  const lineW = interpolate(frame, [4, 24], [0, 520], {extrapolateRight: 'clamp', extrapolateLeft: 'clamp'});
  return (
    <AbsoluteFill style={{background: BG, justifyContent: 'center', alignItems: 'center', padding: 90, opacity: interpolate(frame, [0, 8], [0, 1])}}>
      <div style={{fontFamily: SANS, fontSize: 36, color: GOLD, letterSpacing: 8, textTransform: 'uppercase', opacity: p}}>{card.sub}</div>
      <div style={{height: 3, width: lineW, background: GOLD, margin: '36px 0'}} />
      <div style={{fontFamily: FONT, fontSize: 112, color: '#fff', textAlign: 'center', lineHeight: 1.1, transform: `translateY(${(1 - p) * 50}px)`, opacity: p}}>{card.title}</div>
      <div style={{fontFamily: SANS, fontSize: 40, color: GOLD2, marginTop: 70, opacity: interpolate(frame, [20, 34], [0, 1], {extrapolateRight: 'clamp'})}}>{card.cta}</div>
    </AbsoluteFill>
  );
};

export const Reel = ({videoSrc, captions, highlight, zooms, stats, endCard, endAt}) => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();
  const endF = Math.round(endAt * fps);
  // Hook-Flash: erster Frame mit goldenem Rand
  const hookGlow = interpolate(frame, [0, 10], [1, 0], {extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{background: BG}}>
      <Sequence durationInFrames={endF + 6}>
        <Background src={videoSrc} frame={frame} fps={fps} zooms={zooms} />
        {stats.map((s, i) => <Stat key={i} stat={s} frame={frame} fps={fps} />)}
        <Captions captions={captions} highlight={highlight} frame={frame} fps={fps} />
        <AbsoluteFill style={{boxShadow: `inset 0 0 0 ${hookGlow * 14}px ${GOLD}`, pointerEvents: 'none'}} />
        {/* Fortschrittsbalken */}
        <div style={{position: 'absolute', left: 0, bottom: 0, height: 10, width: `${(frame / endF) * 100}%`, background: GOLD}} />
      </Sequence>
      <Sequence from={endF} durationInFrames={durationInFrames - endF}>
        <EndCard card={endCard} frame={frame - endF} fps={fps} />
      </Sequence>
    </AbsoluteFill>
  );
};
