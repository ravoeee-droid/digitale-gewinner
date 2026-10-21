import json,re,subprocess,sys
TOOL='/tmp/claude-0/-home-user/827b180c-78c1-5a61-b5d2-d26fc4f6618f/scratchpad/toolkit'
VF="hqdn3d=1.2:1:2:1.5,crop=1080:1920:0:15,cas=strength=0.35,unsharp=5:5:0.4:5:5:0.0,eq=contrast=1.04,curves=all='0/0.02 0.2/0.215 0.5/0.55 0.8/0.81 1/0.96',eq=saturation=1.06,colorbalance=rm=0.0:gm=0.01:bm=0.015:rh=-0.01:bh=0.02,noise=alls=3:allf=t,format=yuv420p"
AF="highpass=f=90,afftdn=nf=-30:nt=w,equalizer=f=250:t=q:w=1.2:g=-3,equalizer=f=500:t=q:w=1.5:g=-1.5,equalizer=f=3200:t=q:w=1:g=2.5,equalizer=f=9000:t=h:w=0.7:g=1.5,deesser=i=0.4:m=0.5:f=0.5,acompressor=threshold=-26dB:ratio=3.5:attack=4:release=90:makeup=3,loudnorm=I=-14:TP=-1.5:LRA=7"
DROP={'4013':(20.2,23.0)}
FIX={'unterschreibst':'unterschreibt','nirgendswo':'nirgendwo','tanken':'Tanken','Empfehlungen.':'Empfehlungen.'}
DU={'Du','Dein','Deine','Deinen','Deinem','Deiner','Dir','Dich','Dein','Deines'}
def main(n):
    subprocess.run(['ffmpeg','-loglevel','error','-y','-i',f'../upres/up{n}.mp4','-i',f'cut{n}.mp4','-map','0:v','-map','1:a','-vf',VF,'-af',AF,'-c:v','libx264','-crf','14','-preset','medium','-c:a','aac','-b:a','224k','-ar','48000','-movflags','+faststart',f'{TOOL}/public/v{n}.mp4'],check=True)
    keep=json.load(open(f'keep{n}.json'));w=json.load(open(f'words{n}.json'))
    offs=[];t=0.0
    for a,b in keep: offs.append((a,b,t)); t+=b-a
    words=[];prev=''
    for text,s,e in w:
        text=text.strip()
        if n in DROP and DROP[n][0]<=s<=DROP[n][1]: continue
        core=re.sub(r'[.,?!]','',text)
        if core in DU and prev and not re.search(r'[.?!]$',prev): text=text.replace(core,core[0].lower()+core[1:],1)
        core=re.sub(r'[.,?!]','',text)
        for k,v in FIX.items():
            if core==k.strip('.'): text=text.replace(core,v.strip('.'),1)
        pos=None
        for a,b,o in offs:
            if a-0.03<=s<b: pos=s-a+o;break
        if pos is None:
            nxt=[o for a,b,o in offs if a>s]; pos=nxt[0] if nxt else t
        pe=None
        for a,b,o in offs:
            if a<=e<=b+0.03: pe=e-a+o;break
        if pe is None or pe<pos+0.08: pe=pos+0.2
        words.append({'text':text,'start':round(pos,3),'end':round(pe,3)}); prev=text
    for i in range(len(words)-1):
        if words[i]['end']>words[i+1]['start']: words[i]['end']=words[i+1]['start']
    json.dump({'words':words,'duration':round(t,3)},open(f'{TOOL}/src/v{n}.json','w'),ensure_ascii=False)
    print(n,len(words),'Wörter, Länge',round(t,1))
for n in sys.argv[1:]: main(n)
