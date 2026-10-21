import React from 'react';
import {AbsoluteFill, Sequence, OffthreadVideo, Audio, staticFile, interpolate, spring, useCurrentFrame, useVideoConfig, Easing} from 'remotion';
import data from './adprops.json';

const GOLD = '#d8a648', GOLD2 = '#f1ce84', BG = '#090806', RED = '#e0553d';
const SANS = 'Inter, "DejaVu Sans", Arial, sans-serif', SERIF = 'Georgia, "DejaVu Serif", serif';
const HL = ['schnauze', 'leadportalen', 'billigste', 'margen', 'reklamation', 'empfehlungen', 'fehler', 'vertrauen', 'exklusiv', 'landkreis', 'link', 'video', 'preiskampf'];
const END_PAD = 0.35, END_LEN = 2.8;
export const adDuration = Math.ceil((data.total + END_PAD + END_LEN) * 30);
const caps = data.captions;
const norm = (s) => s.replace(/[.,?!]/g, '').toLowerCase();
const find = (word, nth = 0) => { const m = caps.filter((c) => norm(c.text) === word.toLowerCase()); return m[nth] || m[0]; };
const T = {
  vier: find('vier'), billigste: find('billigste'), preis: find('preiskampf'), runter: caps.filter((c) => norm(c.text) === 'runter').slice(-1)[0],
  rekl: find('reklamation'), gf: find('geschäftsführer'), emp: find('empfehlungen'), fehler: find('fehler'),
  fuenf: find('fünf'), verg: find('vergleichen'), maximal: find('maximal'), land: find('landkreis'), klick: find('klick'),
  schnauze: find('schnauze'), lead: find('leadportalen'),
};
const endAt = data.total + END_PAD;
const sentenceStarts = caps.filter((c, i) => i === 0 || /[.?!]$/.test(caps[i - 1].text)).map((c) => c.start);
const segStarts = data.major;

const pop = (frame, fps, start, damping = 13) => spring({frame: frame - Math.round(start * fps), fps, config: {damping, stiffness: 200}});
const fade = (frame, fps, a, b) => interpolate(frame, [a * fps, a * fps + 6, b * fps - 8, b * fps], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
const Card = ({style, children}) => (<div style={{position: 'absolute', left: 70, right: 70, top: 285, background: 'rgba(9,8,6,0.88)', border: `2px solid ${GOLD}`, borderRadius: 26, padding: '24px 32px', ...style}}>{children}</div>);

const Zoom = ({children, frame, fps}) => {
  const s = frame / fps; let idx = -1; sentenceStarts.forEach((t, i) => { if (s >= t) idx = i; });
  const t0 = sentenceStarts[Math.max(idx, 0)] || 0, t1 = sentenceStarts[idx + 1] || data.total;
  const from = idx % 2 === 0 ? 1.0 : 1.1;
  const scale = from + 0.04 * Math.min(1, (s - t0) / Math.max(0.5, t1 - t0));
  return <AbsoluteFill style={{transform: `scale(${scale})`, transformOrigin: '50% 38%', filter: 'contrast(1.1) saturate(1.12) brightness(1.03)'}}>{children}</AbsoluteFill>;
};

const pages = (() => { const out = []; let cur = []; caps.forEach((c, i) => { const prev = caps[i - 1]; const brk = cur.length >= 3 || (prev && /[.?!]$/.test(prev.text)) || (prev && c.start - prev.end > 0.45); if (brk && cur.length) { out.push(cur); cur = []; } cur.push(c); }); if (cur.length) out.push(cur); return out; })();
const Captions = ({frame, fps}) => {
  const s = frame / fps; let pi = -1; pages.forEach((pg, i) => { if (s >= pg[0].start) pi = i; });
  if (pi < 0) return null; const pg = pages[pi]; const nextStart = pages[pi + 1] ? pages[pi + 1][0].start : Infinity;
  if (s > Math.min(pg[pg.length - 1].end + 0.25, nextStart)) return null;
  const chars = pg.reduce((a, c) => a + c.text.replace(/[.,?!]/g, '').length, 0); const longest = Math.max(...pg.map((c) => c.text.replace(/[.,?!]/g, '').length));
  const base = Math.max(50, Math.min(82, 880 / (Math.max(longest * 0.74, chars * 0.4)))); const cur = pg.filter((c) => c.start <= s).length - 1;
  return (<div style={{position: 'absolute', left: 80, right: 110, top: 1290, height: 190, display: 'flex', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap', gap: '0 34px'}}>
    {pg.map((c, i) => { const active = i === cur, hl = HL.includes(norm(c.text)); const p = pop(frame, fps, c.start, 12);
      return <span key={i} style={{fontFamily: SANS, fontWeight: 900, fontSize: hl ? base * 1.08 : base, lineHeight: 1.1, textTransform: 'uppercase', color: hl ? GOLD : active ? '#fff' : 'rgba(255,255,255,0.6)', WebkitTextStroke: '10px #000', paintOrder: 'stroke fill', opacity: s >= c.start ? 1 : 0, transform: `scale(${active ? 0.86 + p * (hl ? 0.24 : 0.16) : 1}) rotate(${active && hl ? -2 : 0}deg)`, textShadow: '0 6px 24px rgba(0,0,0,0.6)'}}>{c.text.replace(/[.,]$/, '')}</span>; })}
  </div>);
};

const HookChip = ({frame, fps}) => { const a = 0.3, b = T.lead.end + 0.8; if (frame < a * fps || frame > b * fps) return null; const p = pop(frame, fps, a, 11);
  return <div style={{position: 'absolute', left: 90, right: 90, top: 300, display: 'flex', justifyContent: 'center', opacity: fade(frame, fps, a, b), transform: `scale(${0.7 + 0.3 * p})`}}><div style={{background: GOLD, color: BG, fontFamily: SANS, fontWeight: 900, fontSize: 52, padding: '14px 30px', borderRadius: 16, textAlign: 'center', lineHeight: 1.1}}>SCHNAUZE VOLL<br />VON LEADPORTALEN?</div></div>; };

const FourShops = ({frame, fps}) => { const a = T.vier.start - 0.1, b = T.billigste.end + 1.0; if (frame < a * fps || frame > b * fps) return null;
  const lose = interpolate(frame, [(T.billigste.start - 0.3) * fps, T.billigste.end * fps], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return <Card style={{opacity: fade(frame, fps, a, b)}}>
    <div style={{fontFamily: SANS, fontSize: 28, color: GOLD2, letterSpacing: 4, marginBottom: 14}}>EINE ANFRAGE, VIER BETRIEBE</div>
    <div style={{display: 'flex', gap: 14}}>{[0, 1, 2, 3].map((i) => { const win = i === 3 && lose > 0.5; const gray = i !== 3 && lose > 0.5; return <div key={i} style={{flex: 1, height: 96, borderRadius: 16, background: win ? GOLD : 'transparent', border: `4px solid ${gray ? '#5a4a2a' : win ? GOLD : '#e8d9b0'}`, opacity: gray ? 0.45 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: SANS, fontWeight: 900, fontSize: 46, color: win ? BG : gray ? RED : '#fff', transform: `scale(${0.5 + 0.5 * pop(frame, fps, a + i * 0.12)})`}}>{gray ? '✗' : win ? '✓' : i + 1}</div>; })}</div>
    <div style={{fontFamily: SANS, fontSize: 27, color: '#c9b88a', marginTop: 12}}>Quelle: photovoltaik.info (24.11.2025): bis zu fünf Betriebe pro Anfrage</div></Card>; };

const Marge = ({frame, fps}) => { const a = T.preis.start, b = T.runter.end + 0.9; if (frame < a * fps || frame > b * fps) return null;
  const w = interpolate(frame, [a * fps, (T.runter.end) * fps], [100, 22], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.quad)});
  return <Card style={{opacity: fade(frame, fps, a, b)}}>
    <div style={{display: 'flex', justifyContent: 'space-between', fontFamily: SANS, fontWeight: 900, fontSize: 44, color: '#fff'}}><span>MARGE</span><span style={{color: RED}}>↓</span></div>
    <div style={{height: 34, background: '#2a2012', borderRadius: 17, marginTop: 14}}><div style={{height: 34, width: `${w}%`, background: w < 50 ? RED : GOLD, borderRadius: 17}} /></div></Card>; };

const Stamp = ({frame, fps, a, b, text, sub, rot = -4, size = 68}) => { if (frame < a * fps || frame > b * fps) return null; const p = spring({frame: frame - a * fps, fps, config: {damping: 9, stiffness: 260}});
  return <div style={{position: 'absolute', left: 0, right: 0, top: 330, display: 'flex', justifyContent: 'center', opacity: fade(frame, fps, a, b), transform: `scale(${1.8 - 0.8 * p}) rotate(${rot}deg)`}}>
    <div style={{textAlign: 'center', border: `8px solid ${RED}`, color: RED, fontFamily: SANS, fontWeight: 900, fontSize: size, letterSpacing: 3, padding: '10px 30px', borderRadius: 14, background: 'rgba(9,8,6,0.78)'}}>{text}{sub && <div style={{fontSize: 30, color: '#fff', letterSpacing: 1, marginTop: 4}}>{sub}</div>}</div></div>; };

const Angebote = ({frame, fps}) => { const a = T.fuenf.start - 0.1, b = T.verg.end + 1.5; if (frame < a * fps || frame > b * fps) return null;
  const sw = interpolate(frame, [(T.verg.start) * fps, (T.verg.start + 0.6) * fps], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return <Card style={{opacity: fade(frame, fps, a, b), display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
    <div style={{position: 'relative', fontFamily: SANS, fontWeight: 900, fontSize: 52, color: '#fff'}}>5 ANGEBOTE<div style={{position: 'absolute', left: 0, top: '52%', height: 8, width: `${sw * 100}%`, background: RED}} /></div>
    <div style={{fontFamily: SANS, fontWeight: 900, fontSize: 52, color: GOLD, opacity: sw}}>→ 1 ANFRAGE</div></Card>; };

const Landkreis = ({frame, fps}) => { const a = T.maximal.start - 0.3, b = T.land.end + 1.6; if (frame < a * fps || frame > b * fps) return null; const p = pop(frame, fps, a, 11);
  return <div style={{position: 'absolute', left: 0, right: 0, top: 300, display: 'flex', justifyContent: 'center', opacity: fade(frame, fps, a, b), transform: `scale(${0.6 + 0.4 * p})`}}><div style={{background: GOLD, color: BG, fontFamily: SANS, fontWeight: 900, fontSize: 52, padding: '14px 30px', borderRadius: 16, textAlign: 'center', lineHeight: 1.1}}>NUR 1 BETRIEB<br />PRO LANDKREIS</div></div>; };

const LinkBanner = ({frame, fps}) => { const a = T.klick.start - 0.2; if (frame < a * fps || frame > endAt * fps) return null; const bob = Math.sin(frame / 6) * 8;
  return <div style={{position: 'absolute', left: 0, right: 0, top: 300 + bob, display: 'flex', justifyContent: 'center'}}><div style={{background: GOLD, color: BG, fontFamily: SANS, fontWeight: 900, fontSize: 54, padding: '14px 34px', borderRadius: 16}}>↓ LINK ANKLICKEN</div></div>; };

const EndCard = ({frame, fps}) => { const p = spring({frame, fps, config: {damping: 16}}); const lineW = interpolate(frame, [4, 24], [0, 520], {extrapolateRight: 'clamp', extrapolateLeft: 'clamp'});
  return <AbsoluteFill style={{background: BG, justifyContent: 'center', alignItems: 'center', padding: 90, opacity: interpolate(frame, [0, 6], [0, 1])}}>
    <div style={{fontFamily: SANS, fontSize: 36, color: GOLD, letterSpacing: 8, textTransform: 'uppercase', opacity: p}}>Digitale Gewinner</div>
    <div style={{height: 3, width: lineW, background: GOLD, margin: '36px 0'}} />
    <div style={{fontFamily: SERIF, fontSize: 96, color: '#fff', textAlign: 'center', lineHeight: 1.12, whiteSpace: 'pre-line', transform: `translateY(${(1 - p) * 50}px)`, opacity: p}}>{'Eigene Anfragen.\nNur ein Betrieb\npro Landkreis.'}</div>
    <div style={{fontFamily: SANS, fontSize: 40, color: GOLD2, marginTop: 60, opacity: interpolate(frame, [20, 34], [0, 1], {extrapolateRight: 'clamp'})}}>Link anklicken, Video erhalten</div></AbsoluteFill>; };

const sfx = (f, vol, t) => ({f, vol, t});
const SFX = [sfx('riser', 0.3, 0), sfx('hit', 0.45, 0.2),
  ...segStarts.map((s) => sfx('whoosh', 0.3, s - 0.08)),
  sfx('pop', 0.3, T.vier.start), ...[1, 2, 3].map((i) => sfx('tick', 0.25, T.vier.start + i * 0.12)), sfx('stamp', 0.4, T.billigste.start),
  sfx('pop', 0.3, T.preis.start), sfx('boom', 0.5, T.runter.end - 0.2),
  sfx('stamp', 0.5, T.rekl.start), sfx('stamp', 0.5, T.emp.start), sfx('hit', 0.4, T.fehler.start),
  sfx('pop', 0.3, T.fuenf.start), sfx('pop', 0.3, T.verg.start),
  sfx('hit', 0.45, T.maximal.start), sfx('pop', 0.3, T.klick.start),
  sfx('whoosh_long', 0.45, endAt - 0.25), sfx('ding', 0.35, endAt + 0.15)];

export const Ad1 = () => {
  const frame = useCurrentFrame(); const {fps, durationInFrames} = useVideoConfig();
  const endF = Math.round(endAt * fps); const glow = interpolate(frame, [0, 9], [1, 0], {extrapolateRight: 'clamp'});
  return (<AbsoluteFill style={{background: BG}}>
    <Sequence durationInFrames={endF + 4}>
      <Zoom frame={frame} fps={fps}><OffthreadVideo src={staticFile('ad1.mp4')} style={{width: '100%', height: '100%', objectFit: 'cover'}} /></Zoom>
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.45) 100%)'}} />
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(9,8,6,0.3) 0%, rgba(9,8,6,0) 22%, rgba(9,8,6,0) 60%, rgba(9,8,6,0.55) 100%)'}} />
      <HookChip frame={frame} fps={fps} /><FourShops frame={frame} fps={fps} /><Marge frame={frame} fps={fps} />
      <Stamp frame={frame} fps={fps} a={T.rekl.start} b={T.gf.end + 0.8} text="REKLAMATION" sub="bleibt beim Geschäftsführer" size={72} />
      <Stamp frame={frame} fps={fps} a={T.emp.start} b={T.fehler.end + 0.8} text="NUR EMPFEHLUNG?" sub="wachsen kaum" rot={4} size={62} />
      <Angebote frame={frame} fps={fps} /><Landkreis frame={frame} fps={fps} /><LinkBanner frame={frame} fps={fps} />
      <Captions frame={frame} fps={fps} />
      <AbsoluteFill style={{boxShadow: `inset 0 0 0 ${glow * 14}px ${GOLD}`}} />
      {segStarts.map((s, i) => (frame >= Math.round(s * fps) && frame < Math.round(s * fps) + 3) ? <AbsoluteFill key={i} style={{background: '#fff', opacity: 0.18 * (1 - (frame - Math.round(s * fps)) / 3)}} /> : null)}
      <div style={{position: 'absolute', left: 0, bottom: 0, height: 10, width: `${Math.min(1, frame / endF) * 100}%`, background: GOLD}} />
    </Sequence>
    <Sequence from={endF} durationInFrames={durationInFrames - endF}><EndCard frame={frame - endF} fps={fps} /></Sequence>
    {SFX.map((e, i) => <Sequence key={i} from={Math.max(0, Math.round(e.t * fps))}><Audio src={staticFile(`sfx/${e.f}.wav`)} volume={e.vol * 0.4} /></Sequence>)}
  </AbsoluteFill>);
};
