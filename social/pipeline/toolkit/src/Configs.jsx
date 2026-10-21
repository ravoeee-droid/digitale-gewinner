import v4011 from './v4011.json';
import v4012 from './v4012.json';
import v4013 from './v4013.json';
import v4019 from './v4019.json';
import v4020 from './v4020.json';
import v4021 from './v4021.json';
import v4022 from './v4022.json';
import {END_LEN, END_PAD} from './Reel3.jsx';

const norm = (s) => s.replace(/[.,?!„“"]/g, '').replace(/ %$/, '').toLowerCase();
const fixWords = (words) => { const out = []; words.forEach((w) => { if (w.text.startsWith('-') && out.length) { out[out.length - 1].text += w.text; out[out.length - 1].end = w.end; } else if (w.text === '%' && out.length) { out[out.length - 1].text += ' %'; out[out.length - 1].end = w.end; } else out.push({...w}); }); return out; };
const fin = (words) => words.map((w, i) => (w.text === '10' && words[i + 1] && words[i + 1].text === 'mal') ? {...w, text: '10'} : w).map((w, i, a) => (w.text === 'mal' && a[i - 1] && a[i - 1].text === '10') ? {...w, text: 'Mal'} : w);
const mk = (raw) => { const words = fin(fixWords(raw.words)); return {words, duration: raw.duration}; };
// Wortsuche mit Toleranz: exakt, sonst Abstand 1 (Whisper schreibt Wörter manchmal anders). Nichts gefunden: Warnung, Grafik wird übersprungen (Zeit = NaN) statt Render-Abbruch.
const lev = (a, b) => { const d = Array.from({length: a.length + 1}, (_, i) => [i]); for (let j = 1; j <= b.length; j++) d[0][j] = j; for (let i = 1; i <= a.length; i++) for (let j = 1; j <= b.length; j++) d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)); return d[a.length][b.length]; };
const MISS = {text: '', start: NaN, end: NaN, missing: true};
const F = (words) => ({
  at: (t, nth = 0) => { const q = t.toLowerCase(); let m = words.filter((w) => norm(w.text) === q); if (!m.length && q.length >= 4) m = words.filter((w) => lev(norm(w.text), q) <= 1);
    const w = m[nth] || m[0]; if (!w) { console.warn('Wort nicht gefunden: ' + t); return MISS; } return w; },
  sentence: (n) => { const out = []; let cur = []; words.forEach((w) => { cur.push(w); if (/[.?!]$/.test(w.text)) { out.push(cur); cur = []; } }); if (cur.length) out.push(cur); const s = out[n - 1]; return s ? {a: s[0].start, b: s[s.length - 1].end} : {a: NaN, b: NaN}; },
});

const d11 = mk(v4011), f11 = F(d11.words);
export const cfg4011 = {src: 'v4011.mp4', data: d11, hook: {until: 2.9, lines: [{t: 'Was kostet dich'}, {t: 'ein Auftrag', gold: true}, {t: 'wirklich?'}]}, hl: ['80', '800', '10', 'rechner', 'beispiel'],
  graphics: [
    {type: 'equation', a: f11.at('Sagen').start - 0.1, b: f11.at('Beispiel').end + 0.6, times: [f11.at('80').start, f11.at('10').start, f11.at('800').start]},
    {type: 'cta', a: f11.at('Rechner', 1).start - 0.6, b: d11.duration, kicker: 'Kostenlos', title: 'Kommentiere „Rechner“', sub: 'digitalegewinner.de/rechner'},
  ],
  end: {headline: 'Dein echter Preis\npro Auftrag.', sub: 'Rechner kostenlos\ndigitalegewinner.de/rechner'},
  sfx: [{f: 'tick', v: 0.1, t: f11.at('80').start}, {f: 'tick', v: 0.1, t: f11.at('10').start}, {f: 'tick', v: 0.12, t: f11.at('800').start}, {f: 'pop', v: 0.1, t: f11.at('Rechner', 1).start - 0.6}]};

const d12 = mk(v4012), f12 = F(d12.words);
const t22 = f12.at('22').start, t11 = f12.at('11');
export const cfg4012 = {src: 'v4012.mp4', data: d12, hook: {until: Math.min(2.9, t22 - 0.3), lines: [{t: '„Nur noch'}, {t: 'ein Angebot“', gold: true}]}, hl: ['22', '11', '72', '72 %', 'beschäftigt', 'engpass', 'chef'],
  graphics: [
    {type: 'clock', a: t22 - 0.1, b: t11.end + 1.4, switchAt: t11.start},
    {type: 'donut', a: f12.at('72').start - 0.1, b: f12.at('Digitalisierung').end + 1.1, value: 72, text: 'der Handwerksbetriebe: zu beschäftigt für Digitalisierung', source: 'Bitkom, 28.08.2025 · Handwerk allgemein'},
  ],
  end: {headline: 'Zu beschäftigt,\num Zeit zu sparen?', sub: 'Schick das Video an den Kollegen,\nder noch im Büro sitzt.'},
  sfx: [{f: 'pop', v: 0.1, t: t22 - 0.1}, {f: 'tick', v: 0.1, t: t11.start}, {f: 'pop', v: 0.1, t: f12.at('72').start - 0.1}]};

const raw13 = JSON.parse(JSON.stringify(v4013)); if (raw13.words[2] && norm(raw13.words[2].text) === 'mit') raw13.words[2].text = 'nur über';
const d13 = mk(raw13), f13 = F(d13.words);
export const cfg4013 = {src: 'v4013.mp4', data: d13, hook: {until: 3.0, tag: 'PV-Unternehmer', lines: [{t: 'Nur Empfehlungen?'}], sub: 'Dann bist du abhängig vom Zufall.'}, hl: ['empfehlungen', 'bitkom', '40', 'website', 'google', 'kommentare', 'analysecall'],
  graphics: [
    {type: 'stat', a: f13.at('40').start - 0.1, b: f13.at('raus').end + 1.3, value: 40, text: 'sagen: Ein Betrieb ohne Website ist für sie raus', source: 'Bitkom, 12.06.2025 · Handwerk allgemein'},
    {type: 'search', a: f13.at('Gib').start - 0.1, b: f13.at('sieht').end + 0.9},
    {type: 'cta', a: f13.at('Oder', 1).start - 0.1, b: d13.duration, kicker: 'Kostenlos', title: '15-Minuten-Analyse', sub: 'Link in der Bio'},
  ],
  end: {headline: 'Was findet\ndein nächster Kunde?', sub: 'Kostenlose 15-Minuten-Analyse\nLink in der Bio'},
  sfx: [{f: 'sting', v: 0.22, t: 0.05}, {f: 'pop', v: 0.1, t: f13.at('40').start - 0.1}, {f: 'pop', v: 0.1, t: f13.at('Gib').start - 0.1}, {f: 'pop', v: 0.1, t: f13.at('Oder', 1).start - 0.1}]};


// ---------- Tag 2 (neuer Dreh 21.10.2026, Atelier-Look, Wort-für-Wort-Untertitel, B-Roll) ----------
const sfxCuts = (segs, v = 0.06) => segs.map((g) => ({f: 'whoosh', v, t: g.a}));
const hookEnd = (f) => f.sentence(1).b + 0.35;

const d19 = mk(v4019), f19 = F(d19.words);
const b19 = [{...f19.sentence(2), src: 'b22977.mp4'}, {...f19.sentence(3), src: 'b23694.mp4'}, {...f19.sentence(4), src: 'b24217.mp4'}, {...f19.sentence(5), src: 'b39854.mp4'}, {...f19.sentence(7), src: 'b46623.mp4'}];
export const cfg4019 = {src: 'v4019.mp4', data: d19, capMode: 'word', broll: b19,
  hook: {until: hookEnd(f19), tag: 'PV-Unternehmer', lines: [{t: 'Nur über Empfehlungen?'}], sub: 'Das ist keine Strategie. Das ist Hoffnung.'},
  hl: ['empfehlungen', 'strategie', 'hoffnung', 'klingelt', 'still', 'stolz'],
  graphics: [{type: 'cta', a: f19.sentence(8).a - 0.1, b: d19.duration, kicker: 'Ein Wort genügt', title: 'Schreib „Empfehlung“', sub: 'Ich zeige dir, wie'}],
  end: {headline: 'Du verdienst ein Telefon,\ndas klingelt.', sub: 'Schreib EMPFEHLUNG\nund ich zeige dir, wie.'},
  sfx: [{f: 'sting', v: 0.22, t: 0.05}, ...sfxCuts(b19), {f: 'hit', v: 0.1, t: f19.at('Hoffnung').start}]};

const d20 = mk(v4020), f20 = F(d20.words);
export const cfg4020 = {src: 'v4020.mp4', data: d20, capMode: 'word', broll: [],
  hook: {until: hookEnd(f20), tag: 'PV-Unternehmer', lines: [{t: '„Sie sind der dritte'}, {t: 'Solarbetrieb heute.“', gold: true}], sub: 'Da weißt du schon, wie es ausgeht.'},
  hl: ['dritte', 'euro', 'preis', 'dreien', 'einzige', 'verglichen'], graphics: [],
  end: {headline: 'Einer von dreien\noder der Einzige?', sub: 'digitalegewinner.de'},
  sfx: [{f: 'sting', v: 0.22, t: 0.05}]};

const fix21 = (w) => w.map((x, i) => (norm(x.text) === 'uns' && w[i - 1] && norm(w[i - 1].text) === 'für') ? {...x, text: 'sie'} : x); // Bitkom sagt "für sie"
const d21 = mk({...v4021, words: fix21(v4021.words)}), f21 = F(d21.words);
export const cfg4021 = {src: 'v4021.mp4', data: d21, capMode: 'word', broll: [],
  hook: {until: hookEnd(f21), tag: 'Photovoltaik-Betrieb', lines: [{t: 'Google dich.'}, {t: 'Jetzt.', gold: true}], sub: 'Das sieht dein Kunde, bevor er dich anruft.'},
  hl: ['google', 'bitkom', '40', 'prozent', 'raus', 'unfair', 'eindruck'],
  graphics: [{type: 'search', a: f21.sentence(1).a, b: f21.sentence(3).b, text: 'Dein Firmenname'},
    {type: 'stat', a: f21.at('40').start - 0.1, b: f21.sentence(5).b + 0.3, value: 40, text: 'sagen: Ein Betrieb ohne Website ist für sie raus', source: 'Bitkom, 12.06.2025 · Handwerk allgemein'},
    {type: 'cta', a: f21.sentence(8).a - 0.1, b: d21.duration, kicker: 'Ein Wort genügt', title: 'Schreib „Google“', sub: 'Ich schaue drauf und sage dir, was ich sehe'}],
  end: {headline: 'Was sieht dein\nnächster Kunde?', sub: 'Schreib GOOGLE\nund ich schaue drauf.'},
  sfx: [{f: 'sting', v: 0.22, t: 0.05}, {f: 'pop', v: 0.1, t: f21.at('40').start - 0.1}]};

const d22 = mk(v4022), f22 = F(d22.words);
export const cfg4022 = {src: 'v4022.mp4', data: d22, capMode: 'word', broll: [],
  hook: {until: hookEnd(f22), tag: 'Photovoltaik-Betrieb', lines: [{t: 'Du sagst Kunden ab.'}], sub: 'Nicht weil du willst. Weil dir die Leute fehlen.'},
  hl: ['monteure', 'nichts', 'alleine', 'zveh', 'sichtbarkeitsproblem', 'absagst'],
  graphics: [{type: 'stat', a: f22.sentence(5).a, b: f22.sentence(5).b + 0.4, value: 46.5, decimals: 1, text: 'der Betriebe im Elektrohandwerk suchen Personal', source: 'ZVEH, Herbst 2025 · Elektrohandwerk allgemein'},
    {type: 'cta', a: f22.sentence(9).a - 0.1, b: d22.duration, kicker: 'Ein Wort genügt', title: 'Schreib „Monteure“', sub: 'Ich zeige dir, was Bewerber sehen'}],
  end: {headline: 'Kein Personalmangel.\nSichtbarkeit.', sub: 'Schreib MONTEURE\nund ich zeige dir, was Bewerber sehen.'},
  sfx: [{f: 'sting', v: 0.22, t: 0.05}, {f: 'pop', v: 0.1, t: f22.sentence(5).a}]};

export const dur = (c) => Math.ceil((c.data.duration + END_PAD + END_LEN) * 30);
