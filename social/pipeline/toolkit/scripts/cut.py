import json,re,subprocess,sys
KEEPP=0.28
for n in sys.argv[1:]:
    words=json.load(open(f'words{n}.json'))
    out=subprocess.run(['ffmpeg','-nostats','-i',f'v{n}.mp4','-af','silencedetect=noise=-38dB:d=0.18','-f','null','-'],capture_output=True,text=True).stderr
    st=[float(x) for x in re.findall(r'silence_start: ([\d.]+)',out)]; en=[(float(a),float(b)) for a,b in re.findall(r'silence_end: ([\d.]+) \| silence_duration: ([\d.]+)',out)]
    sil=[(e-d,e,d) for e,d in en]
    dur=float(subprocess.run(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0',f'v{n}.mp4'],capture_output=True,text=True).stdout)
    end=dur
    if n=='4020':
        w=[x for x in words if x[0].startswith('verglichen')][0]; end=min(dur,w[2]+0.25)
    # Anfang: erste Silbe minus 0.15
    start=max(0,words[0][1]-0.2)
    removed=[(0,start)] if start>0.05 else []
    for s,e,d in sil:
        if s<start or e>end: continue
        if d>KEEPP+0.12:
            m=(s+e)/2; removed.append((m-(d-KEEPP)/2,m+(d-KEEPP)/2))
    removed.append((end,dur)); removed.sort()
    keep=[];pos=0.0
    for a,b in removed:
        if a>pos+0.12: keep.append((round(pos,3),round(a,3)))
        pos=max(pos,b)
    keep=[k for k in keep if k[1]-k[0]>0.12]
    json.dump(keep,open(f'keep{n}.json','w'))
    pv=[f"[0:v]trim={a}:{b},setpts=PTS-STARTPTS[v{i}]" for i,(a,b) in enumerate(keep)]
    pa=[f"[0:a]atrim={a}:{b},asetpts=PTS-STARTPTS,afade=t=in:d=0.01,afade=t=out:st={max(0,b-a-0.01):.3f}:d=0.01[a{i}]" for i,(a,b) in enumerate(keep)]
    k=len(keep); fc=";".join(pv+pa)+";"+"".join(f"[v{i}][a{i}]" for i in range(k))+f"concat=n={k}:v=1:a=1[v][a]"
    subprocess.run(['ffmpeg','-loglevel','error','-y','-i',f'v{n}.mp4','-filter_complex',fc,'-map','[v]','-map','[a]','-c:v','libx264','-crf','16','-preset','medium','-c:a','aac','-b:a','224k',f'cut{n}.mp4'],check=True)
    print(n,'Original %.1f s -> Schnitt %.1f s, %d Stücke'%(dur,sum(b-a for a,b in keep),k),flush=True)
