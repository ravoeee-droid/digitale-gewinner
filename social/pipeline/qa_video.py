#!/usr/bin/env python3
"""Automatische Qualitätsprüfung für fertige Reels (9:16).

python3 qa_video.py video.mp4 [--words v4013.json] [--hook]
  --words  prüft Untertitel-Timing gegen das Audio (Median-Versatz, Whisper)
  --hook   prüft, ob in den ersten 3 s Label und Hook sichtbar sind
"""
import json, os, re, subprocess, sys
import numpy as np


def ff(args):
    return subprocess.run(['ffmpeg', '-loglevel', 'error'] + args, capture_output=True)


def probe(path):
    out = subprocess.run(['ffprobe', '-v', 'error', '-select_streams', 'v:0', '-show_entries',
                          'stream=width,height,r_frame_rate,duration', '-of', 'json', path],
                         capture_output=True, text=True).stdout
    s = json.loads(out)['streams'][0]
    n, d = s['r_frame_rate'].split('/')
    dur = float(s.get('duration') or 0)
    if not dur:
        dur = float(json.loads(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'json', path], capture_output=True, text=True).stdout)['format']['duration'])
    return int(s['width']), int(s['height']), float(n) / float(d), dur


def frame(path, t):
    w, h = 270, 480
    r = ff(['-ss', f'{t:.2f}', '-i', path, '-frames:v', '1', '-vf', f'scale={w}:{h}', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'])
    return np.frombuffer(r.stdout, dtype=np.uint8).reshape(h, w, 3).astype(np.float32) if r.stdout else None


def skin(img):
    """Hautpixel (YCbCr-Bereich) im mittleren Bildbereich; gibt Helligkeit der Haut zurück."""
    R, G, B = img[..., 0], img[..., 1], img[..., 2]
    Y = 0.299 * R + 0.587 * G + 0.114 * B
    Cb = 128 - 0.168736 * R - 0.331264 * G + 0.5 * B
    Cr = 128 + 0.5 * R - 0.418688 * G - 0.081312 * B
    m = (Cb > 77) & (Cb < 127) & (Cr > 133) & (Cr < 173) & (Y > 40)
    h, w = m.shape
    m[:int(h * 0.2)] = False; m[int(h * 0.8):] = False  # Untertitel und Rand ausblenden
    if m.sum() < 400:
        return None, m.sum()
    return float(Y[m].mean()), int(m.sum())


def sharp(img):
    g = img.mean(axis=2)
    h, w = g.shape
    c = g[int(h * 0.3):int(h * 0.6), int(w * 0.3):int(w * 0.7)]
    return float(np.abs(np.diff(c, axis=1)).mean() + np.abs(np.diff(c, axis=0)).mean())


def loud(path):
    r = subprocess.run(['ffmpeg', '-nostats', '-i', path, '-af', 'loudnorm=I=-14:TP=-1.5:LRA=9:print_format=json', '-f', 'null', '-'], capture_output=True, text=True)
    j = json.loads(re.search(r'\{[^{}]*"input_i"[^{}]*\}', r.stderr, re.S).group(0))
    return float(j['input_i']), float(j['input_tp'])


def hook_check(path):
    """Gold-Label (Zielgruppe) und große weiße Hook-Zeile im oberen Drittel zwischen 0,5 und 2,5 s."""
    ok_gold = ok_white = False
    for t in (0.6, 1.2, 2.0):
        img = frame(path, t)
        if img is None: continue
        top = img[int(480 * 0.08):int(480 * 0.40)]
        R, G, B = top[..., 0], top[..., 1], top[..., 2]
        gold = (R > 190) & (G > 140) & (G < 200) & (B < 110)
        white = (R > 235) & (G > 235) & (B > 235)
        if gold.mean() > 0.012: ok_gold = True
        if white.mean() > 0.015: ok_white = True
    return ok_gold, ok_white


def sync_check(path, words_json):
    from faster_whisper import WhisperModel
    r = ff(['-i', path, '-vn', '-ac', '1', '-ar', '16000', '-f', 'f32le', '-'])
    a = np.frombuffer(r.stdout, dtype=np.float32)
    seg, _ = WhisperModel('medium', device='cpu', compute_type='int8').transcribe(a, language='de', word_timestamps=True)
    ws = [(re.sub(r'[.,?!%\-]', '', w.word.strip()).lower().replace(' ', ''), w.start) for s in seg for w in s.words]
    cw = [(re.sub(r'[.,?!%\-]', '', w['text']).lower().replace(' ', ''), w['start']) for w in json.load(open(words_json))['words']]
    j = 0; diffs = []
    for t, s in cw:
        for q in range(j, min(j + 6, len(ws))):
            if ws[q][0] == t:
                diffs.append(s - ws[q][1]); j = q + 1; break
    if len(diffs) < 0.6 * len(cw):
        return None, len(diffs), len(cw)
    return float(np.median(diffs)), len(diffs), len(cw)


def main(path, words=None, hook=False):
    problems = []
    w, h, fps, dur = probe(path)
    size = os.path.getsize(path) / 1e6
    print(f'{os.path.basename(path)}: {w}x{h}, {fps:.0f} fps, {dur:.1f} s, {size:.1f} MB')
    if (w, h) != (1080, 1920): problems.append('Format nicht 1080x1920')
    if abs(fps - 30) > 0.5: problems.append('Bildrate nicht 30')
    if dur < 8 or dur > 60: problems.append('Länge ausserhalb 8 bis 60 s (Ziel 20 bis 35 s)')
    ys, shs = [], []
    for f in (0.1, 0.3, 0.5, 0.7, 0.85):
        img = frame(path, dur * f)
        if img is None: continue
        y, n = skin(img)
        if y is not None: ys.append(y)
        shs.append(sharp(img))
    if ys:
        ya = float(np.mean(ys))
        print(f'Hauthelligkeit: {ya:.0f} (Ziel 95 bis 135)')
        if ya > 135: problems.append('Gesicht überbelichtet')
        if ya < 90: problems.append('Gesicht zu dunkel')
    else:
        print('Hauthelligkeit: Gesicht nicht erkannt, bitte Standbild prüfen')
    sh = float(np.mean(shs)) if shs else 0
    print(f'Schärfe-Wert: {sh:.1f} (Ziel ab 6)')
    if sh < 6: problems.append('Bild zu weich')
    i, tp = loud(path)
    print(f'Lautheit: {i:.1f} LUFS (Ziel -15 bis -13), Peak {tp:.1f} dB (max -1)')
    if not -15.5 <= i <= -12.5: problems.append('Lautheit ausserhalb -15 bis -13')
    if tp > -0.9: problems.append('Ton übersteuert')
    if hook:
        g, wh = hook_check(path)
        print(f'Hook in den ersten 3 s: Zielgruppen-Label {"ja" if g else "NEIN"}, Hook-Zeile {"ja" if wh else "NEIN"}')
        if not g: problems.append('Zielgruppen-Label fehlt in den ersten 3 s')
        if not wh: problems.append('Hook-Zeile fehlt in den ersten 3 s')
    if words:
        m, a, b = sync_check(path, words)
        if m is None:
            print(f'Untertitel-Timing: zu wenig Treffer ({a}/{b}), bitte von Hand prüfen')
        else:
            print(f'Untertitel-Timing: Median-Versatz {m:+.2f} s ({a}/{b} Wörter, Ziel unter 0,25 s)')
            if abs(m) > 0.25: problems.append('Untertitel nicht synchron')
    if size > 120: problems.append('Datei sehr groß')
    print('BESTANDEN' if not problems else 'NICHT BESTANDEN: ' + '; '.join(problems))
    return 0 if not problems else 1


if __name__ == '__main__':
    args = sys.argv[1:]
    words = None
    if '--words' in args:
        i = args.index('--words'); words = args[i + 1]; del args[i:i + 2]
    hook = '--hook' in args
    args = [a for a in args if a != '--hook']
    sys.exit(max(main(p, words, hook) for p in args))
