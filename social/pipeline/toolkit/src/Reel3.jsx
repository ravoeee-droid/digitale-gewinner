import React, {useState, useEffect} from 'react';
import {AbsoluteFill, Sequence, OffthreadVideo, Audio, staticFile, interpolate, useCurrentFrame, useVideoConfig, Easing, delayRender, continueRender} from 'remotion';
import brand from '../brand.json';

// Design-System "Atelier": Cormorant Garamond (Display) + Inter (Label/Text), Markenfarben aus brand.json, dünne Linien, ruhige Bewegung.
export const GOLD = brand.gold, GOLD2 = brand.gold2, INK = brand.ink, PAPER = brand.paper, MUTE = 'rgba(244,238,225,0.62)';
const SANS = '"InterX", Inter, Arial, sans-serif', SERIF = '"CormorantX", "Cormorant Garamond", Georgia, serif';

const FONTS = [
  ['InterX', 'fonts/inter-latin-400-normal.woff2', '400', 'normal'], ['InterX', 'fonts/inter-latin-500-normal.woff2', '500', 'normal'], ['InterX', 'fonts/inter-latin-600-normal.woff2', '600', 'normal'],
  ['CormorantX', 'fonts/cormorant-garamond-latin-500-normal.woff2', '500', 'normal'], ['CormorantX', 'fonts/cormorant-garamond-latin-600-normal.woff2', '600', 'normal'],
  ['CormorantX', 'fonts/cormorant-garamond-latin-500-italic.woff2', '500', 'italic'], ['CormorantX', 'fonts/cormorant-garamond-latin-600-italic.woff2', '600', 'italic'],
];
const useFonts = () => {
  const [h] = useState(() => delayRender('fonts'));
  useEffect(() => { Promise.all(FONTS.map(([fam, f, wt, st]) => new FontFace(fam, `url(${staticFile(f)})`, {weight: wt, style: st}).load())).then((fs) => { fs.forEach((f) => document.fonts.add(f)); continueRender(h); }).catch(() => continueRender(h)); }, [h]);
};

const ease = Easing.bezier(0.22, 1, 0.36, 1);
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'};
const appear = (frame, fps, a, b, enter = 16, exit = 10) => {
  const f0 = a * fps, f1 = b * fps;
  const i = interpolate(frame, [f0, f0 + enter], [0, 1], {...clamp, easing: ease});
  const o = interpolate(frame, [f1 - exit, f1], [1, 0], clamp);
  return {p: i, o: Math.min(i > 0 ? 1 : 0, o), vis: frame >= f0 && frame <= f1};
};

// ---------- Bausteine ----------
const Hair = ({w = 56, style}) => <div style={{height: 1, width: w, background: GOLD, opacity: 0.8, ...style}} />;
const Panel = ({a, b, fps, frame, children, top = 230, pad = '34px 42px'}) => {
  const {p, o, vis} = appear(frame, fps, a, b); if (!vis) return null;
  return <div style={{position: 'absolute', left: 70, right: 70, top, opacity: p * o, transform: `translateY(${(1 - p) * 14}px)`, padding: pad, borderRadius: 4,
    background: 'linear-gradient(180deg, rgba(14,12,9,0.62), rgba(10,9,7,0.74))', backdropFilter: 'blur(22px)', borderTop: `1px solid rgba(232,211,164,0.55)`, borderBottom: '1px solid rgba(232,211,164,0.12)', borderLeft: '1px solid rgba(232,211,164,0.12)', borderRight: '1px solid rgba(232,211,164,0.12)'}}>{children}</div>;
};
const Kicker = ({children}) => <div style={{fontFamily: SANS, fontWeight: 500, fontSize: 19, letterSpacing: '0.34em', color: GOLD, textTransform: 'uppercase', marginBottom: 18}}>{children}</div>;
const Src = ({children}) => <div style={{fontFamily: SANS, fontWeight: 400, fontSize: 21, letterSpacing: '0.02em', color: MUTE, marginTop: 16}}>{children}</div>;
const Num = ({children, size = 96, color = PAPER, style}) => <div style={{fontFamily: SERIF, fontWeight: 500, fontSize: size, lineHeight: 0.95, letterSpacing: '-0.01em', color, fontVariantNumeric: 'lining-nums', ...style}}>{children}</div>;

// ---------- Grafiken ----------
const Equation = ({g, frame, fps}) => {
  const t = (k) => interpolate(frame, [g.times[k] * fps, g.times[k] * fps + 12], [0, 1], {...clamp, easing: ease});
  const P = g.params || {a: 80, b: 10, unitA: 'pro Anfrage', unitB: 'Anfragen', unitC: 'für 1 Auftrag', suffix: ' €'}; const total = P.a * P.b;
  const count = Math.round(interpolate(frame, [g.times[2] * fps, g.times[2] * fps + 24], [0, total], {...clamp, easing: ease}));
  const Tok = ({big, small, p, color}) => <div style={{opacity: p, transform: `translateY(${(1 - p) * 10}px)`, textAlign: 'center'}}>
    <Num size={84} color={color}>{big}</Num>
    <div style={{fontFamily: SANS, fontWeight: 500, fontSize: 17, letterSpacing: '0.24em', color: MUTE, textTransform: 'uppercase', marginTop: 14}}>{small}</div></div>;
  const Op = ({c, p}) => <div style={{fontFamily: SERIF, fontWeight: 500, fontStyle: 'italic', fontSize: 52, color: GOLD, opacity: p, marginTop: -30}}>{c}</div>;
  return <Panel a={g.a} b={g.b} fps={fps} frame={frame}>
    <Kicker>Beispielrechnung</Kicker>
    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
      <Tok big={`${P.a}${P.suffix}`} small={P.unitA} p={t(0)} /><Op c="×" p={t(1)} /><Tok big={`${P.b}`} small={P.unitB} p={t(1)} /><Op c="=" p={t(2)} />
      <Tok big={`${count}${P.suffix}`} small={P.unitC} p={t(2)} color={GOLD2} /></div>
  </Panel>;
};
const Clock = ({g, frame, fps}) => {
  const s = interpolate(frame, [g.switchAt * fps, g.switchAt * fps + 26], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
  const mins = 22 * 60 + Math.round(s * 60); const hh = Math.floor(mins / 60), mm = mins % 60; const late = s > 0.5;
  return <Panel a={g.a} b={g.b} fps={fps} frame={frame}>
    <Kicker>Im Büro</Kicker>
    <div style={{display: 'flex', alignItems: 'baseline', gap: 20}}>
      <Num size={118} color={late ? GOLD2 : PAPER}>{String(hh).padStart(2, '0')}:{String(mm).padStart(2, '0')}</Num>
      <div style={{fontFamily: SANS, fontWeight: 400, fontSize: 24, letterSpacing: '0.2em', color: MUTE, textTransform: 'uppercase'}}>Uhr</div></div>
  </Panel>;
};
const Donut = ({g, frame, fps}) => {
  const R = 80, C = 2 * Math.PI * R;
  const p = interpolate(frame, [g.a * fps + 8, g.a * fps + 40], [0, g.value / 100], {...clamp, easing: ease});
  const n = Math.round(p * 100);
  return <Panel a={g.a} b={g.b} fps={fps} frame={frame}>
    <div style={{display: 'flex', alignItems: 'center', gap: 36}}>
      <svg width="200" height="200" viewBox="0 0 200 200"><circle cx="100" cy="100" r={R} fill="none" stroke="rgba(232,211,164,0.14)" strokeWidth="3" />
        <circle cx="100" cy="100" r={R} fill="none" stroke={GOLD} strokeWidth="3" strokeLinecap="butt" strokeDasharray={`${C * p} ${C}`} transform="rotate(-90 100 100)" />
        <text x="100" y="116" textAnchor="middle" fontFamily="CormorantX, Georgia, serif" fontWeight="500" fontSize="58" fill="#f4eee1">{n} %</text></svg>
      <div style={{flex: 1}}><div style={{fontFamily: SANS, fontWeight: 500, fontSize: 31, lineHeight: 1.3, color: PAPER}}>{g.text}</div><Src>{g.source}</Src></div></div>
  </Panel>;
};
const Stat = ({g, frame, fps}) => {
  const dec = g.decimals || 0; const v = (+interpolate(frame, [g.a * fps + 6, g.a * fps + 30], [0, g.value], {...clamp, easing: ease}).toFixed(dec)).toFixed(dec).replace('.', ',');
  return <Panel a={g.a} b={g.b} fps={fps} frame={frame}>
    <div style={{display: 'flex', alignItems: 'center', gap: 36}}>
      <Num size={140} color={GOLD2}>{v} %</Num>
      <div style={{flex: 1}}><div style={{fontFamily: SANS, fontWeight: 500, fontSize: 30, lineHeight: 1.3, color: PAPER}}>{g.text}</div><Src>{g.source}</Src></div></div>
  </Panel>;
};
const Search = ({g, frame, fps}) => {
  const txt = g.text || 'Dein Firmenname'; const n = Math.floor(interpolate(frame, [g.a * fps + 10, g.a * fps + 10 + txt.length * 2.4], [0, txt.length], clamp));
  const caret = Math.floor(frame / 15) % 2 === 0;
  return <Panel a={g.a} b={g.b} fps={fps} frame={frame} pad="30px 36px">
    <div style={{display: 'flex', alignItems: 'center', gap: 20, background: 'rgba(244,238,225,0.96)', borderRadius: 40, padding: '16px 30px'}}>
      <svg width="30" height="30" viewBox="0 0 24 24"><circle cx="10" cy="10" r="6.5" fill="none" stroke="#6b5a35" strokeWidth="2" /><line x1="15" y1="15" x2="21" y2="21" stroke="#6b5a35" strokeWidth="2" strokeLinecap="round" /></svg>
      <div style={{fontFamily: SANS, fontWeight: 500, fontSize: 32, color: '#1c1710'}}>{txt.slice(0, n)}<span style={{opacity: caret ? 1 : 0}}>|</span></div></div>
    <div style={{fontFamily: SERIF, fontWeight: 500, fontStyle: 'italic', fontSize: 40, color: GOLD2, marginTop: 22}}>Was sieht dein nächster Kunde?</div>
  </Panel>;
};
const Cta = ({g, frame, fps}) => (<Panel a={g.a} b={g.b} fps={fps} frame={frame} top={300}>
  <Kicker>{g.kicker}</Kicker>
  <div style={{fontFamily: SERIF, fontWeight: 600, fontSize: 62, lineHeight: 1.05, color: PAPER}}>{g.title}</div>
  <Hair w={64} style={{margin: '20px 0 16px'}} />
  <div style={{fontFamily: SANS, fontWeight: 500, fontSize: 26, letterSpacing: '0.04em', color: GOLD2}}>{g.sub}</div></Panel>);
const GR = {equation: Equation, clock: Clock, donut: Donut, stat: Stat, search: Search, cta: Cta};

// ---------- Untertitel ----------
const clean = (t) => t.replace(/[.,?!]$/, '');
const makePages = (words, maxW = 4) => { const pages = []; let cur = []; let chars = 0;
  words.forEach((w, i) => { const prev = words[i - 1]; const len = clean(w.text).length;
    const brk = cur.length >= maxW || chars + len > 30 || (prev && /[.?!]$/.test(prev.text)) || (prev && w.start - prev.end > 0.4);
    if (brk && cur.length) { pages.push(cur); cur = []; chars = 0; } cur.push(w); chars += len + 1; });
  if (cur.length) pages.push(cur); return pages; };
const Captions = ({pages, hl, frame, fps, mode}) => {
  const s = frame / fps; let pi = -1; pages.forEach((pg, i) => { if (s >= pg[0].start - 0.02) pi = i; }); if (pi < 0) return null;
  const pg = pages[pi]; const nxt = pages[pi + 1] ? pages[pi + 1][0].start : Infinity; if (s > Math.min(pg[pg.length - 1].end + 0.3, nxt)) return null;
  const inP = interpolate(frame, [pg[0].start * fps, pg[0].start * fps + 6], [0, 1], {...clamp, easing: ease});
  const wordMode = mode === 'word';
  return <div style={{position: 'absolute', left: 90, right: 90, top: wordMode ? 1230 : 1300, height: 190, display: 'flex', justifyContent: 'center', alignItems: 'flex-end', flexWrap: 'wrap', gap: '0 18px', opacity: inP, transform: `translateY(${(1 - inP) * 8}px)`}}>
    {pg.map((w, i) => { const done = s >= w.start; const key = hl.includes(clean(w.text).toLowerCase());
      if (wordMode && key) return <span key={i} style={{fontFamily: SERIF, fontStyle: 'italic', fontWeight: 600, fontSize: 84, lineHeight: 1.05, color: done ? GOLD2 : 'rgba(241,206,132,0.5)', textShadow: '0 2px 18px rgba(0,0,0,0.65)'}}>{clean(w.text)}</span>;
      return <span key={i} style={{fontFamily: SANS, fontWeight: wordMode ? 700 : 600, fontSize: wordMode ? 60 : 56, lineHeight: 1.2, letterSpacing: '-0.005em', color: key && done ? GOLD2 : done ? PAPER : 'rgba(244,238,225,0.5)', textShadow: '0 2px 14px rgba(0,0,0,0.6), 0 0 2px rgba(0,0,0,0.5)'}}>{clean(w.text)}</span>; })}
  </div>;
};

// ---------- B-Roll-Ebene: stumm über dem Sprecher, weicher Push, kurze Überblendung ----------
const BRoll = ({segs, frame, fps}) => (<>{(segs || []).map((g, i) => {
  const f0 = Math.round(g.a * fps), len = Math.max(4, Math.round((g.b - g.a) * fps));
  if (frame < f0 || frame > f0 + len) return null;
  const l = frame - f0; const inO = interpolate(l, [0, 4], [0, 1], clamp); const sc = 1 + 0.06 * (l / len);
  return <AbsoluteFill key={i} style={{opacity: inO}}><AbsoluteFill style={{transform: `scale(${sc})`}}><OffthreadVideo muted src={staticFile(`broll/${g.src}`)} startFrom={Math.round((g.from || 0) * fps)} style={{width: '100%', height: '100%', objectFit: 'cover'}} /></AbsoluteFill>
    <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(9,8,6,0.35) 0%, rgba(9,8,6,0) 28%, rgba(9,8,6,0) 55%, rgba(9,8,6,0.55) 100%)'}} /></AbsoluteFill>;
})}</>);

// ---------- Hook: Zielgruppe · Hook · Gegenzeile ----------
const Hook = ({hook, frame, fps}) => {
  if (!hook) return null;
  const a = 0.05 * fps, b = hook.until * fps; if (frame < a || frame > b) return null;
  const st = (d, len = 18) => interpolate(frame, [a + d, a + d + len], [0, 1], {...clamp, easing: ease});
  const o = interpolate(frame, [b - 9, b], [1, 0], clamp);
  const p0 = st(0), p1 = st(5, 22), p2 = st(18, 20), line = st(2, 26);
  return <div style={{position: 'absolute', left: 70, right: 70, top: 200, display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: o}}>
    {hook.tag && <div style={{display: 'flex', alignItems: 'center', gap: 22, opacity: p0, marginBottom: 34}}>
      <div style={{height: 2, width: 90 * line, background: GOLD}} />
      <div style={{fontFamily: SANS, fontWeight: 500, fontSize: 24, letterSpacing: '0.38em', color: GOLD2, textTransform: 'uppercase', paddingLeft: '0.38em'}}>{hook.tag}</div>
      <div style={{height: 2, width: 90 * line, background: GOLD}} /></div>}
    <div style={{opacity: p1, transform: `translateY(${(1 - p1) * 18}px)`, filter: `blur(${(1 - p1) * 7}px)`, fontFamily: SERIF, fontWeight: 600, fontSize: 92, lineHeight: 1.0, letterSpacing: '-0.012em', textAlign: 'center', color: PAPER, textShadow: '0 3px 30px rgba(0,0,0,0.55)'}}>
      {hook.lines.map((l, i) => <div key={i} style={l.gold ? {color: GOLD2, fontStyle: 'italic', fontWeight: 500} : undefined}>{l.t}</div>)}</div>
    {hook.sub && <div style={{opacity: p2, transform: `translateY(${(1 - p2) * 10}px)`, marginTop: 30, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
      <div style={{height: 1, width: 48, background: GOLD, marginBottom: 22, opacity: 0.9}} />
      <div style={{fontFamily: SANS, fontWeight: 400, fontSize: 34, lineHeight: 1.35, textAlign: 'center', color: 'rgba(244,238,225,0.92)', letterSpacing: '0.005em', textShadow: '0 2px 16px rgba(0,0,0,0.6)'}}>{hook.sub}</div></div>}
  </div>;
};

// ---------- Endkarte ----------
const End = ({end, frame, fps}) => {
  const p = interpolate(frame, [0, 18], [0, 1], {...clamp, easing: ease}); const line = interpolate(frame, [4, 34], [0, 120], {...clamp, easing: ease});
  return <AbsoluteFill style={{background: `radial-gradient(ellipse at 50% 40%, #17130c 0%, ${INK} 66%)`, justifyContent: 'center', alignItems: 'center', padding: 100, opacity: interpolate(frame, [0, 8], [0, 1], clamp)}}>
    <div style={{fontFamily: SANS, fontWeight: 500, fontSize: 22, letterSpacing: '0.5em', color: GOLD, textTransform: 'uppercase', opacity: p, paddingLeft: '0.5em'}}>Digitale Gewinner</div>
    <div style={{height: 1, width: line, background: GOLD, margin: '42px 0'}} />
    <div style={{fontFamily: SERIF, fontWeight: 500, fontSize: 92, lineHeight: 1.04, letterSpacing: '-0.01em', color: PAPER, textAlign: 'center', whiteSpace: 'pre-line', opacity: p, transform: `translateY(${(1 - p) * 16}px)`}}>{end.headline}</div>
    <div style={{fontFamily: SANS, fontWeight: 400, fontSize: 30, lineHeight: 1.5, letterSpacing: '0.03em', color: GOLD2, marginTop: 56, textAlign: 'center', whiteSpace: 'pre-line', opacity: interpolate(frame, [18, 34], [0, 1], clamp)}}>{end.sub}</div>
  </AbsoluteFill>; };

// ---------- Komposition ----------
export const END_LEN = 2.4, END_PAD = 0.3;
export const Reel3 = ({cfg}) => {
  useFonts();
  const frame = useCurrentFrame(); const {fps, durationInFrames} = useVideoConfig();
  const words = cfg.data.words; const wordMode = cfg.capMode === 'word'; const pages = React.useMemo(() => makePages(words, wordMode ? 3 : 4), [words, wordMode]);
  const endF = Math.round((cfg.data.duration + END_PAD) * fps);
  const fadeIn = interpolate(frame, [0, 5], [0, 1], {extrapolateRight: 'clamp'});
  return (<AbsoluteFill style={{background: INK}}>
    <Sequence durationInFrames={endF + 3}>
      <AbsoluteFill><OffthreadVideo src={staticFile(cfg.src)} style={{width: '100%', height: '100%', objectFit: 'cover'}} /></AbsoluteFill>
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 44%, rgba(0,0,0,0) 56%, rgba(0,0,0,0.34) 100%)'}} />
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(10,9,7,0.42) 0%, rgba(10,9,7,0) 24%, rgba(10,9,7,0) 62%, rgba(10,9,7,0.5) 100%)'}} />
      <BRoll segs={(cfg.broll || []).filter((g) => Number.isFinite(g.a) && Number.isFinite(g.b))} frame={frame} fps={fps} />
      {cfg.graphics.filter((g) => Number.isFinite(g.a) && Number.isFinite(g.b)).map((g, i) => { const C = GR[g.type]; return C ? <C key={i} g={g} frame={frame} fps={fps} /> : null; })}
      <Hook hook={cfg.hook} frame={frame} fps={fps} />
      <Captions pages={pages} hl={cfg.hl} frame={frame} fps={fps} mode={cfg.capMode} />
      <AbsoluteFill style={{background: INK, opacity: 1 - fadeIn}} />
      <div style={{position: 'absolute', left: 0, bottom: 0, height: 2, width: `${Math.min(1, frame / endF) * 100}%`, background: GOLD, opacity: 0.85}} />
    </Sequence>
    <Sequence from={endF} durationInFrames={durationInFrames - endF}><End end={cfg.end} frame={frame - endF} fps={fps} /></Sequence>
    {cfg.sfx.filter((e) => Number.isFinite(e.t)).map((e, i) => <Sequence key={i} from={Math.max(0, Math.round(e.t * fps))}><Audio src={staticFile(`sfx/${e.f}.wav`)} volume={e.v} /></Sequence>)}
    <Sequence from={endF}><Audio src={staticFile('sfx/ding.wav')} volume={0.1} /></Sequence>
  </AbsoluteFill>);
};
