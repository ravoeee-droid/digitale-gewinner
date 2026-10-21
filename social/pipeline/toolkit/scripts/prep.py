#!/usr/bin/env python3
"""Farbkorrektur + Stimme + Wort-Mapping für ein geschnittenes Video.
Aufruf (im Ordner toolkit):  python3 scripts/prep.py <nr> <geschnittenes_video.mp4> <words.json> <keep.json>
Erzeugt public/v<nr>.mp4 (1080x1920 graded, Stimme bearbeitet, -14 LUFS) und src/v<nr>.json (Wortzeiten)."""
import json, re, subprocess, sys
n, src, wjson, kjson = sys.argv[1:5]
h = int(subprocess.run(['ffprobe', '-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=height', '-of', 'csv=p=0', src], capture_output=True, text=True).stdout.strip().split('\n')[0])
w = int(subprocess.run(['ffprobe', '-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=width', '-of', 'csv=p=0', src], capture_output=True, text=True).stdout.strip().split('\n')[0])
# KI-hochskaliert 1080x1970: oben/unten beschneiden; echtes 1080x1920: unverändert; sonst skalieren+beschneiden
geo = 'crop=1080:1920:0:15' if (w, h) == (1080, 1970) else ('null' if (w, h) == (1080, 1920) else 'scale=1080:1920:force_original_aspect_ratio=increase:flags=lanczos,crop=1080:1920')
sharp = 'cas=strength=0.35,unsharp=5:5:0.4:5:5:0.0' if h > 1000 else 'cas=strength=0.5,unsharp=5:5:0.6:5:5:0.0'
VF = f"hqdn3d=1.2:1:2:1.5,{geo},{sharp},eq=contrast=1.04,curves=all='0/0.02 0.2/0.215 0.5/0.55 0.8/0.81 1/0.96',eq=saturation=1.06,colorbalance=rm=0.0:gm=0.01:bm=0.015:rh=-0.01:bh=0.02,noise=alls=3:allf=t,format=yuv420p"
AF = "highpass=f=90,afftdn=nf=-30:nt=w,equalizer=f=250:t=q:w=1.2:g=-3,equalizer=f=500:t=q:w=1.5:g=-1.5,equalizer=f=3200:t=q:w=1:g=2.5,equalizer=f=9000:t=h:w=0.7:g=1.5,deesser=i=0.4:m=0.5:f=0.5,acompressor=threshold=-26dB:ratio=3.5:attack=4:release=90:makeup=3,loudnorm=I=-14:TP=-1.5:LRA=7"
subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-i', src, '-vf', VF, '-af', AF, '-c:v', 'libx264', '-crf', '14', '-preset', 'medium', '-c:a', 'aac', '-b:a', '224k', '-ar', '48000', '-movflags', '+faststart', f'public/v{n}.mp4'], check=True)
keep = json.load(open(kjson)); words = json.load(open(wjson))
offs = []; t = 0.0
for a, b in keep: offs.append((a, b, t)); t += b - a
out = []
for text, s, e in words:
    pos = next((s - a + o for a, b, o in offs if a - 0.03 <= s < b), None)
    if pos is None: continue  # Wort lag in einem entfernten Bereich
    pe = next((e - a + o for a, b, o in offs if a <= e <= b + 0.03), pos + 0.2)
    if pe < pos + 0.08: pe = pos + 0.2
    out.append({'text': text.strip(), 'start': round(pos, 3), 'end': round(pe, 3)})
for i in range(len(out) - 1):
    if out[i]['end'] > out[i + 1]['start']: out[i]['end'] = out[i + 1]['start']
json.dump({'words': out, 'duration': round(t, 3)}, open(f'src/v{n}.json', 'w'), ensure_ascii=False)
print(n, len(out), 'Wörter, Länge', round(t, 1), 'Quelle', w, 'x', h)
