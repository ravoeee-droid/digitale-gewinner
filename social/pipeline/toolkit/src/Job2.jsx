import React from 'react';
import {AbsoluteFill, Sequence, OffthreadVideo, Audio, staticFile, interpolate, spring, useCurrentFrame, useVideoConfig, Easing} from 'remotion';
import data from './job1props.json';

const GOLD = '#d8a648', GOLD2 = '#f1ce84', BG = '#090806', RED = '#e0553d';
const SANS = 'Inter, "DejaVu Sans", Arial, sans-serif', SERIF = 'Georgia, "DejaVu Serif", serif';
const HL = ['genug', 'gefährlichste', '12', 'spät', 'viertel', 'gefallen', 'jetzt', 'glück', 'monaten', 'leer'];
const END_PAD = 0.35, END_LEN = 3.2;
export const job2Duration = Math.ceil((data.total + END_PAD + END_LEN) * 30);
const caps = data.captions;
const norm = (s) => s.replace(/[.,?!]/g, '').toLowerCase();
const W = (word, nth = 0) => { const m = caps.filter((c) => norm(c.text) === word.toLowerCase()); return m[nth] || m[0]; };
const T = {
  gef: W('gefährlichste'), firma: W('Firma'), heute1: W('heute', 0), monaten1: W('Monaten', 0),
  auftrag: W('Auftrag'), entstanden: W('entstanden'), buch: W('Auftragsbuch'), leer: W('leer'),
  spaet: W('spät'), heims: W('Heimsegment'), gefallen: W('gefallen'), baust: W('Baust'), glueck: W('Glück'),
};
const segStarts = data.segments.map((s) => s[0]);
const endAt = data.total + END_PAD;

// ---------- Hilfen ----------
const pop = (frame, fps, start, damping = 13) => spring({frame: frame - Math.round(start * fps), fps, config: {damping, stiffness: 200}});
const fade = (frame, fps, a, b) => interpolate(frame, [a * fps, a * fps + 6, b * fps - 8, b * fps], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
const Card = ({style, children}) => (
  <div style={{position: 'absolute', left: 70, right: 70, top: 285, background: 'rgba(9,8,6,0.88)', border: `2px solid ${GOLD}`, borderRadius: 26, padding: '26px 34px', ...style}}>{children}</div>
);

// ---------- Video mit Jump-Cut-Zoom und Grading ----------
const Zoom = ({children, frame, fps}) => {
  const s = frame / fps; let scale = 1;
  data.segments.forEach(([a, b], i) => {
    if (s >= a && s < b) { const from = i % 2 === 0 ? 1.0 : 1.1; scale = interpolate(s, [a, b], [from, from + 0.05], {easing: Easing.out(Easing.quad)}); }
  });
  // Punch-In beim Wort 'gefährlichste' und 'spät'
  [T.gef, T.spaet].forEach((c) => { const k = interpolate(frame, [c.start * fps, c.start * fps + 4, c.start * fps + 14], [0, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}); scale += 0.05 * k; });
  return <AbsoluteFill style={{transform: `scale(${scale})`, transformOrigin: '50% 38%', filter: 'contrast(1.1) saturate(1.12) brightness(1.03)'}}>{children}</AbsoluteFill>;
};

// ---------- Untertitel ----------
const Captions = ({frame, fps}) => {
  const s = frame / fps; const cur = caps.filter((c) => c.start <= s).length - 1;
  if (cur < 0 || s > caps[caps.length - 1].end + 0.3) return null;
  const g = Math.floor(cur / 3) * 3, group = caps.slice(g, g + 3);
  return (
    <div style={{position: 'absolute', left: 80, right: 110, top: 1290, height: 190, display: 'flex', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap', gap: '0 40px'}}>
      {group.map((c, i) => {
        const active = g + i === cur, hl = HL.includes(norm(c.text)); const p = pop(frame, fps, c.start, 12);
        return <span key={g + i} style={{fontFamily: SANS, fontWeight: 900, fontSize: hl ? 90 : 82, lineHeight: 1.1, textTransform: 'uppercase',
          color: hl ? GOLD : active ? '#fff' : 'rgba(255,255,255,0.6)', WebkitTextStroke: '10px #000', paintOrder: 'stroke fill', opacity: s >= c.start ? 1 : 0,
          transform: `scale(${active ? 0.84 + p * (hl ? 0.28 : 0.18) : 1}) rotate(${active && hl ? -2 : 0}deg)`, textShadow: '0 6px 24px rgba(0,0,0,0.6)'}}>{c.text.replace(/[.,]$/, '')}</span>;
      })}
    </div>
  );
};

// ---------- Grafiken ----------
const Stamp = ({frame, fps}) => { // "Gefährlichster Satz"
  const a = T.gef.start, b = T.firma.end + 0.5; if (frame < a * fps || frame > b * fps) return null;
  const p = spring({frame: frame - a * fps, fps, config: {damping: 9, stiffness: 260}});
  return <div style={{position: 'absolute', left: 0, right: 0, top: 330, display: 'flex', justifyContent: 'center', opacity: fade(frame, fps, a, b), transform: `scale(${1.8 - 0.8 * p}) rotate(-4deg)`}}>
    <div style={{border: `8px solid ${RED}`, color: RED, fontFamily: SANS, fontWeight: 900, fontSize: 64, letterSpacing: 3, padding: '10px 30px', borderRadius: 14, background: 'rgba(9,8,6,0.72)'}}>GEFÄHRLICHSTER SATZ</div></div>;
};
const Timeline = ({frame, fps}) => {
  const a = T.heute1.start, b = T.monaten1.end + 1.0; if (frame < a * fps || frame > b * fps) return null;
  const line = interpolate(frame, [a * fps, (a + 1.2) * fps], [0, 1], {extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
  const q = pop(frame, fps, T.monaten1.start - 0.2);
  return <Card style={{opacity: fade(frame, fps, a, b)}}>
    <div style={{display: 'flex', justifyContent: 'space-between', fontFamily: SANS, fontWeight: 800, fontSize: 40, color: '#fff'}}><span>HEUTE</span><span>IN 12 MONATEN</span></div>
    <div style={{position: 'relative', height: 70, marginTop: 14}}>
      <div style={{position: 'absolute', left: 0, top: 30, height: 10, width: `${line * 100}%`, background: `linear-gradient(90deg, ${GOLD}, ${GOLD2})`, borderRadius: 5}} />
      <div style={{position: 'absolute', left: 0, top: 10, width: 50, height: 50, borderRadius: 25, background: GOLD, color: BG, fontWeight: 900, fontSize: 30, fontFamily: SANS, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>✓</div>
      <div style={{position: 'absolute', right: 0, top: 6, width: 58, height: 58, borderRadius: 29, border: `4px solid ${GOLD}`, color: GOLD, fontWeight: 900, fontSize: 40, fontFamily: SANS, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${0.4 + q * 0.6 + Math.sin(frame / 5) * 0.04})`}}>?</div>
    </div>
    <div style={{display: 'flex', justifyContent: 'space-between', fontFamily: SANS, fontSize: 30, color: GOLD2, marginTop: 6}}><span>Auftragsbuch voll</span><span>Auftragsbuch…?</span></div>
  </Card>;
};
const Pipeline = ({frame, fps}) => {
  const a = T.auftrag.start - 0.1, b = T.entstanden.end + 0.9; if (frame < a * fps || frame > b * fps) return null;
  const steps = ['Anfrage', 'Gespräch', 'Angebot', 'Auftrag'];
  const prog = interpolate(frame, [a * fps, (b - 0.8) * fps], [0, 3], {extrapolateRight: 'clamp', extrapolateLeft: 'clamp'});
  return <Card style={{opacity: fade(frame, fps, a, b)}}>
    <div style={{fontFamily: SANS, fontSize: 28, color: GOLD2, letterSpacing: 4, marginBottom: 14}}>DER WEG ZUM AUFTRAG — DAUERT MONATE</div>
    <div style={{display: 'flex', alignItems: 'center'}}>
      {steps.map((s, i) => { const on = prog >= i - 0.01; return <React.Fragment key={s}>
        <div style={{flex: 'none', padding: '12px 18px', borderRadius: 40, border: `3px solid ${on ? GOLD : '#5a4a2a'}`, background: on ? GOLD : 'transparent', color: on ? BG : '#a89870', fontFamily: SANS, fontWeight: 800, fontSize: 30}}>{s}</div>
        {i < 3 && <div style={{flex: 1, height: 6, margin: '0 6px', background: '#3a2e1a', position: 'relative'}}><div style={{position: 'absolute', left: 0, top: 0, bottom: 0, background: GOLD, width: `${Math.max(0, Math.min(1, prog - i)) * 100}%`}} /></div>}
      </React.Fragment>; })}
    </div></Card>;
};
const Buch = ({frame, fps}) => {
  const a = T.buch.start - 0.1, b = T.spaet.start - 0.1; if (frame < a * fps || frame > b * fps) return null;
  const n = 8, drain = interpolate(frame, [(T.buch.start) * fps, (T.leer.start + 0.1) * fps], [0, n], {extrapolateRight: 'clamp', extrapolateLeft: 'clamp'});
  return <Card style={{opacity: fade(frame, fps, a, b)}}>
    <div style={{fontFamily: SANS, fontSize: 28, color: GOLD2, letterSpacing: 4, marginBottom: 14}}>AUFTRAGSBUCH</div>
    <div style={{display: 'flex', gap: 10}}>{Array.from({length: n}).map((_, i) => { const gone = drain > i + 0.5; return <div key={i} style={{flex: 1, height: 70, borderRadius: 10, background: gone ? 'transparent' : GOLD, border: `3px solid ${gone ? RED : GOLD}`, opacity: gone ? 0.5 : 1, transition: 'none'}} />; })}</div>
  </Card>;
};
const Spaet = ({frame, fps}) => {
  const a = T.spaet.start, b = T.spaet.end + 0.9; if (frame < a * fps || frame > b * fps) return null;
  const p = spring({frame: frame - a * fps, fps, config: {damping: 8, stiffness: 280}});
  return <div style={{position: 'absolute', left: 0, right: 0, top: 330, display: 'flex', justifyContent: 'center', opacity: fade(frame, fps, a, b), transform: `scale(${2 - p}) rotate(5deg)`}}>
    <div style={{border: `9px solid ${RED}`, color: RED, fontFamily: SANS, fontWeight: 900, fontSize: 130, letterSpacing: 6, padding: '6px 44px', borderRadius: 16, background: 'rgba(9,8,6,0.74)'}}>ZU SPÄT</div></div>;
};
const StatChip = ({frame, fps}) => {
  const a = T.heims.start, b = T.gefallen.end + 1.2; if (frame < a * fps || frame > b * fps) return null;
  const val = Math.round(interpolate(frame - a * fps, [4, 34], [0, -25], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)}));
  const p = pop(frame, fps, a, 14);
  return <div style={{position: 'absolute', left: 70, top: 285, opacity: fade(frame, fps, a, b), transform: `translateY(${(1 - p) * -40}px)`, background: 'rgba(9,8,6,0.88)', border: `2px solid ${GOLD}`, borderRadius: 24, padding: '22px 34px', display: 'flex', alignItems: 'center', gap: 28}}>
    <div style={{fontFamily: SERIF, fontWeight: 700, fontSize: 118, color: '#fff', lineHeight: 1}}>≈{val} %</div>
    <div style={{fontFamily: SANS, fontSize: 30, color: GOLD2, lineHeight: 1.25, maxWidth: 360}}>PV-Dachanlagen bis 30 kW, 2025 ggü. 2024 (Leistung)<div style={{fontSize: 24, color: '#a89870', marginTop: 6}}>Quelle: BSW-Solar</div></div></div>;
};
const Choice = ({frame, fps}) => {
  const a = T.baust.start, b = endAt; if (frame < a * fps) return null;
  const p1 = pop(frame, fps, a + 0.25), p2 = pop(frame, fps, a + 1.0);
  return <div style={{position: 'absolute', left: 70, right: 70, top: 285, display: 'flex', flexDirection: 'column', gap: 18, opacity: interpolate(frame, [b * fps - 8, b * fps], [1, 0], {extrapolateLeft: 'clamp'})}}>
    <div style={{transform: `scale(${p1})`, transformOrigin: 'left', background: GOLD, color: BG, fontFamily: SANS, fontWeight: 900, fontSize: 52, padding: '18px 34px', borderRadius: 18}}>✓ JETZT BAUEN</div>
    <div style={{transform: `scale(${p2})`, transformOrigin: 'left', border: `4px solid ${GOLD}`, color: GOLD2, fontFamily: SANS, fontWeight: 900, fontSize: 52, padding: '14px 34px', borderRadius: 18, background: 'rgba(9,8,6,0.8)'}}>🎲 AUF GLÜCK RECHNEN</div></div>;
};

const EndCard = ({frame, fps}) => {
  const p = spring({frame, fps, config: {damping: 16}}); const lineW = interpolate(frame, [4, 24], [0, 520], {extrapolateRight: 'clamp', extrapolateLeft: 'clamp'});
  return <AbsoluteFill style={{background: BG, justifyContent: 'center', alignItems: 'center', padding: 90, opacity: interpolate(frame, [0, 6], [0, 1])}}>
    <div style={{fontFamily: SANS, fontSize: 36, color: GOLD, letterSpacing: 8, textTransform: 'uppercase', opacity: p}}>Digitale Gewinner</div>
    <div style={{height: 3, width: lineW, background: GOLD, margin: '36px 0'}} />
    <div style={{fontFamily: SERIF, fontSize: 104, color: '#fff', textAlign: 'center', lineHeight: 1.12, whiteSpace: 'pre-line', transform: `translateY(${(1 - p) * 50}px)`, opacity: p}}>{'Heute voll.\nUnd in zwölf Monaten?'}</div>
    <div style={{fontFamily: SANS, fontSize: 40, color: GOLD2, marginTop: 70, textAlign: 'center', whiteSpace: 'pre-line', opacity: interpolate(frame, [20, 34], [0, 1], {extrapolateRight: 'clamp'})}}>{'Schick das einem Chef,\nder sagt: „Ich hab genug."'}</div>
  </AbsoluteFill>;
};

// ---------- Sound-Design ----------
const sfx = (f, vol, t) => ({f, vol, t});
const SFX = [
  sfx('riser', 0.35, 0.0), sfx('hit', 0.55, 0.0),
  ...segStarts.slice(1).map((s) => sfx('whoosh', 0.4, s - 0.08)),
  sfx('stamp', 0.55, T.gef.start), sfx('pop', 0.35, T.heute1.start), sfx('pop', 0.35, T.monaten1.start - 0.2),
  sfx('pop', 0.3, T.auftrag.start), sfx('tick', 0.3, T.auftrag.start + 0.6), sfx('tick', 0.3, T.auftrag.start + 1.2), sfx('tick', 0.3, T.auftrag.start + 1.8),
  sfx('pop', 0.35, T.buch.start), ...[0, 1, 2, 3, 4, 5].map((i) => sfx('tick', 0.28, T.buch.start + 0.3 + i * 0.28)),
  sfx('boom', 0.7, T.spaet.start), sfx('stamp', 0.45, T.spaet.start),
  sfx('pop', 0.35, T.heims.start), ...[0, 1, 2, 3, 4, 5, 6].map((i) => sfx('tick', 0.25, T.heims.start + 0.15 + i * 0.1)), sfx('hit', 0.45, T.heims.start + 1.1),
  sfx('pop', 0.35, T.baust.start + 0.25), sfx('pop', 0.35, T.baust.start + 1.0),
  sfx('whoosh_long', 0.5, endAt - 0.25), sfx('ding', 0.4, endAt + 0.15),
];

export const Job2 = () => {
  const frame = useCurrentFrame(); const {fps, durationInFrames} = useVideoConfig();
  const endF = Math.round(endAt * fps); const glow = interpolate(frame, [0, 9], [1, 0], {extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{background: BG}}>
      <Sequence durationInFrames={endF + 4}>
        <Zoom frame={frame} fps={fps}><OffthreadVideo src={staticFile('clean.mp4')} style={{width: '100%', height: '100%', objectFit: 'cover'}} /></Zoom>
        <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.45) 100%)'}} />
        <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(9,8,6,0.3) 0%, rgba(9,8,6,0) 22%, rgba(9,8,6,0) 60%, rgba(9,8,6,0.55) 100%)'}} />
        <Stamp frame={frame} fps={fps} /><Timeline frame={frame} fps={fps} /><Pipeline frame={frame} fps={fps} /><Buch frame={frame} fps={fps} /><Spaet frame={frame} fps={fps} /><StatChip frame={frame} fps={fps} /><Choice frame={frame} fps={fps} />
        <Captions frame={frame} fps={fps} />
        <AbsoluteFill style={{boxShadow: `inset 0 0 0 ${glow * 14}px ${GOLD}`}} />
        {/* Weißer Flash an jedem Schnitt */}
        {segStarts.slice(1).map((s, i) => (frame >= Math.round(s * fps) && frame < Math.round(s * fps) + 3) ? <AbsoluteFill key={i} style={{background: '#fff', opacity: 0.22 * (1 - (frame - Math.round(s * fps)) / 3)}} /> : null)}
        <div style={{position: 'absolute', left: 0, bottom: 0, height: 10, width: `${Math.min(1, frame / endF) * 100}%`, background: GOLD}} />
      </Sequence>
      <Sequence from={endF} durationInFrames={durationInFrames - endF}><EndCard frame={frame - endF} fps={fps} /></Sequence>
      {SFX.map((e, i) => <Sequence key={i} from={Math.max(0, Math.round(e.t * fps))}><Audio src={staticFile(`sfx/${e.f}.wav`)} volume={e.vol * 0.4} /></Sequence>)}
    </AbsoluteFill>
  );
};
