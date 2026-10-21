import React, {useState, useEffect} from 'react';
import {AbsoluteFill, Sequence, OffthreadVideo, Audio, staticFile, interpolate, spring, useCurrentFrame, useVideoConfig, Easing, delayRender, continueRender} from 'remotion';

export const GOLD = '#d8a648', GOLD2 = '#f1ce84', INK = '#090806', MUTE = '#b9a77a';
const SANS = '"InterX", Inter, Arial, sans-serif', SERIF = '"PlayfairX", Georgia, serif';

const FONTS = [
  ['InterX', 'fonts/inter-latin-500-normal.woff2', '500'], ['InterX', 'fonts/inter-latin-700-normal.woff2', '700'],
  ['InterX', 'fonts/inter-latin-800-normal.woff2', '800'], ['InterX', 'fonts/inter-latin-900-normal.woff2', '900'],
  ['PlayfairX', 'fonts/playfair-display-latin-700-normal.woff2', '700'], ['PlayfairX', 'fonts/playfair-display-latin-900-normal.woff2', '900'],
];
const useFonts = () => {
  const [h] = useState(() => delayRender('fonts'));
  useEffect(() => { Promise.all(FONTS.map(([fam, f, wt]) => new FontFace(fam, `url(${staticFile(f)})`, {weight: wt}).load())).then((fs) => { fs.forEach((f) => document.fonts.add(f)); continueRender(h); }).catch(() => continueRender(h)); }, [h]);
};

const ease = Easing.out(Easing.cubic);
const appear = (frame, fps, a, b, enter = 10, exit = 8) => {
  const f0 = a * fps, f1 = b * fps;
  const i = interpolate(frame, [f0, f0 + enter], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease});
  const o = interpolate(frame, [f1 - exit, f1], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return {p: i, o: Math.min(i > 0 ? 1 : 0, o), vis: frame >= f0 && frame <= f1};
};

// ---------- Panel ----------
const Panel = ({a, b, fps, frame, children, top = 250, pad = '26px 36px'}) => {
  const {p, o, vis} = appear(frame, fps, a, b); if (!vis) return null;
  return <div style={{position: 'absolute', left: 64, right: 64, top, opacity: p * o, transform: `translateY(${(1 - p) * -22}px)`, padding: pad, borderRadius: 28,
    background: 'linear-gradient(160deg, rgba(20,16,10,0.90), rgba(9,8,6,0.86))', border: '1.5px solid rgba(216,166,72,0.55)', boxShadow: '0 24px 60px rgba(0,0,0,0.45)'}}>{children}</div>;
};
const Kicker = ({children}) => <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 24, letterSpacing: 4, color: GOLD, textTransform: 'uppercase', marginBottom: 12}}>{children}</div>;
const Src = ({children}) => <div style={{fontFamily: SANS, fontWeight: 500, fontSize: 25, color: MUTE, marginTop: 14}}>{children}</div>;

// ---------- Grafiken ----------
const Equation = ({g, frame, fps}) => {
  const t = (k) => interpolate(frame, [(g.times[k]) * fps, (g.times[k]) * fps + 9], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease});
  const count = Math.round(interpolate(frame, [g.times[2] * fps, g.times[2] * fps + 20], [0, 800], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease}));
  const Tok = ({big, small, p, color = '#fff'}) => <div style={{opacity: p, transform: `translateY(${(1 - p) * 14}px)`, textAlign: 'center', minWidth: 0}}>
    <div style={{fontFamily: SERIF, fontWeight: 900, fontSize: 92, lineHeight: 1, color}}>{big}</div>
    <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 21, letterSpacing: 2, color: GOLD2, textTransform: 'uppercase', marginTop: 8}}>{small}</div></div>;
  const Op = ({c, p}) => <div style={{fontFamily: SERIF, fontWeight: 700, fontSize: 64, color: GOLD, opacity: p, marginTop: -26}}>{c}</div>;
  return <Panel a={g.a} b={g.b} fps={fps} frame={frame}>
    <Kicker>Beispielrechnung</Kicker>
    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
      <Tok big="80 €" small="pro Anfrage" p={t(0)} /><Op c="×" p={t(1)} /><Tok big="10" small="Anfragen" p={t(1)} /><Op c="=" p={t(2)} />
      <Tok big={`${count} €`} small="für 1 Auftrag" p={t(2)} color={GOLD2} /></div>
  </Panel>;
};
const Clock = ({g, frame, fps}) => {
  const s = interpolate(frame, [g.switchAt * fps, g.switchAt * fps + 24], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic)});
  const mins = 22 * 60 + Math.round(s * 60); const hh = Math.floor(mins / 60), mm = mins % 60; const late = s > 0.5;
  return <Panel a={g.a} b={g.b} fps={fps} frame={frame}>
    <Kicker>Im Büro</Kicker>
    <div style={{display: 'flex', alignItems: 'baseline', gap: 18}}>
      <div style={{fontFamily: SERIF, fontWeight: 900, fontSize: 130, lineHeight: 1, color: late ? GOLD2 : '#fff'}}>{String(hh).padStart(2, '0')}:{String(mm).padStart(2, '0')}</div>
      <div style={{fontFamily: SANS, fontWeight: 600, fontSize: 30, color: MUTE}}>Uhr</div></div>
  </Panel>;
};
const Donut = ({g, frame, fps}) => {
  const R = 78, C = 2 * Math.PI * R;
  const p = interpolate(frame, [g.a * fps + 6, g.a * fps + 34], [0, g.value / 100], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease});
  const n = Math.round(p * 100);
  return <Panel a={g.a} b={g.b} fps={fps} frame={frame}>
    <div style={{display: 'flex', alignItems: 'center', gap: 32}}>
      <svg width="200" height="200" viewBox="0 0 200 200"><circle cx="100" cy="100" r={R} fill="none" stroke="rgba(216,166,72,0.18)" strokeWidth="20" />
        <circle cx="100" cy="100" r={R} fill="none" stroke={GOLD} strokeWidth="20" strokeLinecap="round" strokeDasharray={`${C * p} ${C}`} transform="rotate(-90 100 100)" />
        <text x="100" y="116" textAnchor="middle" fontFamily="PlayfairX, Georgia, serif" fontWeight="900" fontSize="52" fill="#fff">{n} %</text></svg>
      <div style={{flex: 1}}><div style={{fontFamily: SANS, fontWeight: 800, fontSize: 36, lineHeight: 1.2, color: '#fff'}}>{g.text}</div><Src>{g.source}</Src></div></div>
  </Panel>;
};
const Stat = ({g, frame, fps}) => {
  const v = Math.round(interpolate(frame, [g.a * fps + 4, g.a * fps + 26], [0, g.value], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease}));
  return <Panel a={g.a} b={g.b} fps={fps} frame={frame}>
    <div style={{display: 'flex', alignItems: 'center', gap: 30}}>
      <div style={{fontFamily: SERIF, fontWeight: 900, fontSize: 150, lineHeight: 1, color: GOLD2}}>{v} %</div>
      <div style={{flex: 1}}><div style={{fontFamily: SANS, fontWeight: 800, fontSize: 34, lineHeight: 1.22, color: '#fff'}}>{g.text}</div><Src>{g.source}</Src></div></div>
  </Panel>;
};
const Search = ({g, frame, fps}) => {
  const txt = 'Dein Firmenname'; const n = Math.floor(interpolate(frame, [g.a * fps + 8, g.a * fps + 8 + txt.length * 2.2], [0, txt.length], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}));
  const caret = Math.floor(frame / 14) % 2 === 0;
  return <Panel a={g.a} b={g.b} fps={fps} frame={frame} pad="24px 30px">
    <div style={{display: 'flex', alignItems: 'center', gap: 18, background: '#f6f1e6', borderRadius: 60, padding: '16px 28px'}}>
      <svg width="34" height="34" viewBox="0 0 24 24"><circle cx="10" cy="10" r="6.5" fill="none" stroke="#6b5a35" strokeWidth="2.6" /><line x1="15" y1="15" x2="21" y2="21" stroke="#6b5a35" strokeWidth="2.6" strokeLinecap="round" /></svg>
      <div style={{fontFamily: SANS, fontWeight: 600, fontSize: 38, color: '#1c1710'}}>{txt.slice(0, n)}<span style={{opacity: caret ? 1 : 0}}>|</span></div></div>
    <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 28, color: GOLD2, marginTop: 16}}>Was sieht dein nächster Kunde?</div>
  </Panel>;
};
const Cta = ({g, frame, fps}) => (<Panel a={g.a} b={g.b} fps={fps} frame={frame}>
  <Kicker>{g.kicker}</Kicker>
  <div style={{fontFamily: SERIF, fontWeight: 900, fontSize: 56, lineHeight: 1.1, color: '#fff'}}>{g.title}</div>
  <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 30, color: GOLD2, marginTop: 12}}>{g.sub}</div></Panel>);
const GR = {equation: Equation, clock: Clock, donut: Donut, stat: Stat, search: Search, cta: Cta};

// ---------- Untertitel ----------
const clean = (t) => t.replace(/[.,?!]$/, '');
const makePages = (words) => { const pages = []; let cur = []; let chars = 0;
  words.forEach((w, i) => { const prev = words[i - 1]; const len = clean(w.text).length;
    const brk = cur.length >= 4 || chars + len > 24 || (prev && /[.?!]$/.test(prev.text)) || (prev && w.start - prev.end > 0.4);
    if (brk && cur.length) { pages.push(cur); cur = []; chars = 0; } cur.push(w); chars += len + 1; });
  if (cur.length) pages.push(cur); return pages; };
const Captions = ({pages, hl, frame, fps}) => {
  const s = frame / fps; let pi = -1; pages.forEach((pg, i) => { if (s >= pg[0].start - 0.02) pi = i; }); if (pi < 0) return null;
  const pg = pages[pi]; const nxt = pages[pi + 1] ? pages[pi + 1][0].start : Infinity; if (s > Math.min(pg[pg.length - 1].end + 0.3, nxt)) return null;
  const inP = interpolate(frame, [pg[0].start * fps, pg[0].start * fps + 5], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease});
  return <div style={{position: 'absolute', left: 70, right: 70, top: 1250, height: 190, display: 'flex', justifyContent: 'center', alignItems: 'flex-end', flexWrap: 'wrap', gap: '0 22px', opacity: inP, transform: `translateY(${(1 - inP) * 10}px)`}}>
    {pg.map((w, i) => { const done = s >= w.start; const cur = done && (i === pg.length - 1 || s < pg[i + 1].start); const key = hl.includes(clean(w.text).toLowerCase());
      return <span key={i} style={{fontFamily: SANS, fontWeight: 800, fontSize: 76, lineHeight: 1.12, letterSpacing: -1, color: key && done ? GOLD2 : done ? '#fff' : 'rgba(255,255,255,0.55)', textShadow: '0 3px 16px rgba(0,0,0,0.75), 0 0 2px rgba(0,0,0,0.9)', transform: cur ? 'scale(1.04)' : 'none', transition: 'none'}}>{clean(w.text)}</span>; })}
  </div>;
};

// ---------- Hook-Titel (erste Sekunden): Zielgruppe, Hook, Gegenzeile ----------
const Hook = ({hook, frame, fps}) => {
  if (!hook) return null;
  const a = 0.05 * fps, b = hook.until * fps; if (frame < a || frame > b) return null;
  const p = interpolate(frame, [a, a + 6], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease});
  const p2 = interpolate(frame, [a + 14, a + 22], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease});
  const o = interpolate(frame, [b - 6, b], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return <div style={{position: 'absolute', left: 50, right: 50, top: 190, display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: o}}>
    {hook.tag && <div style={{opacity: p, transform: `scale(${0.9 + 0.1 * p})`, background: GOLD, color: '#17120a', fontFamily: SANS, fontWeight: 900, fontSize: 40, letterSpacing: 4, textTransform: 'uppercase', padding: '12px 30px', borderRadius: 8, marginBottom: 28}}>{hook.tag}</div>}
    <div style={{opacity: p, transform: `translateY(${(1 - p) * -22}px)`, fontFamily: SANS, fontWeight: 900, fontSize: 96, lineHeight: 1.04, letterSpacing: -2, textAlign: 'center', color: '#fff', textShadow: '0 4px 24px rgba(0,0,0,0.85), 0 0 3px rgba(0,0,0,0.9)'}}>{hook.lines.map((l, i) => <div key={i} style={{color: l.gold ? GOLD2 : '#fff'}}>{l.t}</div>)}</div>
    {hook.sub && <div style={{opacity: p2, transform: `translateY(${(1 - p2) * 14}px)`, marginTop: 26, fontFamily: SANS, fontWeight: 800, fontSize: 52, lineHeight: 1.12, textAlign: 'center', color: GOLD2, fontStyle: 'italic', textShadow: '0 3px 18px rgba(0,0,0,0.85)'}}>{hook.sub}</div>}
  </div>;
};

// ---------- Endkarte ----------
const End = ({end, frame, fps}) => { const p = interpolate(frame, [0, 14], [0, 1], {extrapolateRight: 'clamp', easing: ease}); const line = interpolate(frame, [6, 30], [0, 440], {extrapolateRight: 'clamp', extrapolateLeft: 'clamp', easing: ease});
  return <AbsoluteFill style={{background: `radial-gradient(ellipse at 50% 42%, #1d1609 0%, ${INK} 62%)`, justifyContent: 'center', alignItems: 'center', padding: 90, opacity: interpolate(frame, [0, 6], [0, 1], {extrapolateRight: 'clamp'})}}>
    <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 30, letterSpacing: 10, color: GOLD, textTransform: 'uppercase', opacity: p}}>Digitale Gewinner</div>
    <div style={{height: 2, width: line, background: GOLD, margin: '38px 0'}} />
    <div style={{fontFamily: SERIF, fontWeight: 900, fontSize: 88, lineHeight: 1.1, color: '#fff', textAlign: 'center', whiteSpace: 'pre-line', opacity: p, transform: `translateY(${(1 - p) * 26}px)`}}>{end.headline}</div>
    <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 38, color: GOLD2, marginTop: 54, textAlign: 'center', whiteSpace: 'pre-line', opacity: interpolate(frame, [16, 30], [0, 1], {extrapolateRight: 'clamp', extrapolateLeft: 'clamp'})}}>{end.sub}</div>
  </AbsoluteFill>; };

// ---------- Komposition ----------
export const END_LEN = 2.4, END_PAD = 0.3;
export const Reel3 = ({cfg}) => {
  useFonts();
  const frame = useCurrentFrame(); const {fps, durationInFrames} = useVideoConfig();
  const words = cfg.data.words; const pages = React.useMemo(() => makePages(words), [words]);
  const endF = Math.round((cfg.data.duration + END_PAD) * fps);
  const starts = words.filter((w, i) => i === 0 || /[.?!]$/.test(words[i - 1].text)).map((w) => w.start);
  const s = frame / fps; let idx = -1; starts.forEach((t, i) => { if (s >= t - 0.02) idx = i; });
  const t0 = starts[Math.max(idx, 0)] || 0, t1 = starts[idx + 1] || cfg.data.duration;
  const scale = 1;
  const fadeIn = interpolate(frame, [0, 5], [0, 1], {extrapolateRight: 'clamp'});
  return (<AbsoluteFill style={{background: INK}}>
    <Sequence durationInFrames={endF + 3}>
      <AbsoluteFill style={{transform: `scale(${scale})`, transformOrigin: '50% 36%'}}><OffthreadVideo src={staticFile(cfg.src)} style={{width: '100%', height: '100%', objectFit: 'cover'}} /></AbsoluteFill>
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 42%, rgba(0,0,0,0) 58%, rgba(0,0,0,0.38) 100%)'}} />
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(9,8,6,0.35) 0%, rgba(9,8,6,0) 20%, rgba(9,8,6,0) 56%, rgba(9,8,6,0.6) 100%)'}} />
      {cfg.graphics.map((g, i) => { const C = GR[g.type]; return <C key={i} g={g} frame={frame} fps={fps} />; })}
      <Hook hook={cfg.hook} frame={frame} fps={fps} />
      <Captions pages={pages} hl={cfg.hl} frame={frame} fps={fps} />
      <AbsoluteFill style={{background: INK, opacity: 1 - fadeIn}} />
      <div style={{position: 'absolute', left: 0, bottom: 0, height: 6, width: `${Math.min(1, frame / endF) * 100}%`, background: GOLD, opacity: 0.9}} />
    </Sequence>
    <Sequence from={endF} durationInFrames={durationInFrames - endF}><End end={cfg.end} frame={frame - endF} fps={fps} /></Sequence>
    {cfg.sfx.map((e, i) => <Sequence key={i} from={Math.max(0, Math.round(e.t * fps))}><Audio src={staticFile(`sfx/${e.f}.wav`)} volume={e.v} /></Sequence>)}
    <Sequence from={endF}><Audio src={staticFile('sfx/ding.wav')} volume={0.12} /></Sequence>
  </AbsoluteFill>);
};
