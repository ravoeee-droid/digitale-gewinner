#!/usr/bin/env python3
"""Automatische Qualitätsprüfung für fertige Reels (9:16)."""
import json, os, re, subprocess, sys

def probe(path):
    out = subprocess.run(['ffprobe','-v','error','-select_streams','v:0','-show_entries','stream=width,height,r_frame_rate,duration','-of','json',path],capture_output=True,text=True).stdout
    s = json.loads(out)['streams'][0]
    n, d = s['r_frame_rate'].split('/')
    return int(s['width']), int(s['height']), float(n)/float(d), float(s.get('duration') or 0)

def stats(path, t, vf):
    r = subprocess.run(['ffmpeg','-loglevel','error','-ss',str(t),'-i',path,'-frames:v','1','-vf',vf+',signalstats,metadata=print:file=-','-f','null','-'],capture_output=True,text=True)
    m = re.findall(r'(YAVG|YMAX)=([\d.]+)', r.stdout)
    return {k: float(v) for k, v in m}

def sharp(path, t):
    r = subprocess.run(['ffmpeg','-loglevel','error','-ss',str(t),'-i',path,'-frames:v','1','-vf','crop=iw*0.4:ih*0.2:iw*0.3:ih*0.38,format=gray,sobel,signalstats,metadata=print:file=-','-f','null','-'],capture_output=True,text=True)
    m = re.search(r'YAVG=([\d.]+)', r.stdout)
    return float(m.group(1)) if m else 0.0

def loud(path):
    r = subprocess.run(['ffmpeg','-nostats','-i',path,'-af','loudnorm=I=-14:TP=-1.5:LRA=9:print_format=json','-f','null','-'],capture_output=True,text=True)
    m = re.search(r'\{[^{}]*"input_i"[^{}]*\}', r.stderr, re.S)
    j = json.loads(m.group(0))
    return float(j['input_i']), float(j['input_tp'])

def main(path):
    problems = []
    w, h, fps, dur = probe(path)
    size = os.path.getsize(path) / 1e6
    print(f'{os.path.basename(path)}: {w}x{h}, {fps:.0f} fps, {dur:.1f} s, {size:.1f} MB')
    if (w, h) != (1080, 1920): problems.append('Format nicht 1080x1920')
    if abs(fps - 30) > 0.5: problems.append('Bildrate nicht 30')
    if dur < 8 or dur > 90: problems.append('Länge ausserhalb 8 bis 90 s')
    face = [stats(path, dur*f, 'crop=iw*0.3:ih*0.15:iw*0.35:ih*0.38') for f in (0.15, 0.35, 0.55, 0.75)]
    ya = sum(x.get('YAVG', 0) for x in face) / len(face)
    ym = max(x.get('YMAX', 0) for x in face)
    print(f'Gesichtshelligkeit: {ya:.0f} (Ziel 105 bis 125), Spitze {ym:.0f}')
    if ya > 125: problems.append('Gesicht überbelichtet')
    if ya < 100: problems.append('Gesicht zu dunkel')
    sh = sum(sharp(path, dur*f) for f in (0.2, 0.5, 0.8)) / 3
    print(f'Schärfe-Wert: {sh:.1f} (Ziel ab 12)')
    if sh < 12: problems.append('Bild zu weich')
    i, tp = loud(path)
    print(f'Lautheit: {i:.1f} LUFS (Ziel -15 bis -13), Peak {tp:.1f} dB (max -1)')
    if not -15.5 <= i <= -12.5: problems.append('Lautheit ausserhalb -15 bis -13')
    if tp > -0.9: problems.append('Ton übersteuert')
    if size > 90: problems.append('Datei sehr groß')
    print('BESTANDEN' if not problems else 'NICHT BESTANDEN: ' + '; '.join(problems))
    return 0 if not problems else 1

if __name__ == '__main__':
    sys.exit(max(main(p) for p in sys.argv[1:]))
