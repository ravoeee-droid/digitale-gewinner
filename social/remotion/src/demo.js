// Skript 5: "Minus 25 Prozent". Wortzeiten hier nur Platzhalter, spaeter aus Whisper.
const text = 'Das Heimsegment ist 2025 um 25 Prozent eingebrochen. Anlagen bis 30 Kilowatt, laut BSW Solar. Im ersten Quartal 2026 nochmal minus 21 Prozent. Der Markt wird nicht groesser, er wird haerter. Wer ueberlebt, braucht eigene Kundenkanaele.';
const words = text.split(' ');
let t = 0.2;
const captions = words.map((w) => { const d = 0.16 + w.length * 0.025; const c = {text: w, start: t, end: t + d}; t += d + 0.03; return c; });
export const demo = {
  videoSrc: null,
  captions,
  durationInFrames: Math.ceil((t + 3.2) * 30),
  endAt: t + 0.2,
  // Highlights: Woerter in Gold
  highlight: ['25', '21', 'minus', 'eingebrochen', 'haerter', 'eigene'],
  zooms: [[0, 1.0, 1.0], [2.5, 1.0, 1.1], [5, 1.1, 1.0], [8, 1.0, 1.12], [11, 1.12, 1.0]],
  stats: [
    {at: 1.2, until: 5.2, label: 'Heimsegment bis 30 kW 2025', from: 0, to: -25, suffix: ' %', note: 'Quelle: BSW-Solar'},
    {at: 5.6, until: 9.6, label: '1. Quartal 2026', from: 0, to: -21, suffix: ' %', note: 'Quelle: BSW-Solar'},
  ],
  endCard: {title: 'Eigene Anfragen statt gekaufter Leads', sub: 'Digitale Gewinner', cta: 'Folgen für mehr aus der PV-Branche'},
};
