import v4011 from './v4011.json';
import v4012 from './v4012.json';
import v4013 from './v4013.json';
import {END_LEN, END_PAD} from './Reel3.jsx';

const norm = (s) => s.replace(/[.,?!„“"]/g, '').replace(/ %$/, '').toLowerCase();
const fixWords = (words) => { const out = []; words.forEach((w) => { if (w.text.startsWith('-') && out.length) { out[out.length - 1].text += w.text; out[out.length - 1].end = w.end; } else if (w.text === '%' && out.length) { out[out.length - 1].text += ' %'; out[out.length - 1].end = w.end; } else out.push({...w}); }); return out; };
const fin = (words) => words.map((w, i) => (w.text === '10' && words[i + 1] && words[i + 1].text === 'mal') ? {...w, text: '10'} : w).map((w, i, a) => (w.text === 'mal' && a[i - 1] && a[i - 1].text === '10') ? {...w, text: 'Mal'} : w);
const mk = (raw) => { const words = fin(fixWords(raw.words)); return {words, duration: raw.duration}; };
const F = (words) => ({
  at: (t, nth = 0) => { const m = words.filter((w) => norm(w.text) === t.toLowerCase()); const w = m[nth] || m[0]; if (!w) throw new Error('Wort nicht gefunden: ' + t); return w; },
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

export const dur = (c) => Math.ceil((c.data.duration + END_PAD + END_LEN) * 30);
