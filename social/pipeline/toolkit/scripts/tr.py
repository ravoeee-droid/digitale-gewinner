import json,subprocess,sys,numpy as np
from faster_whisper import WhisperModel
m=WhisperModel('medium',device='cpu',compute_type='int8')
for n in sys.argv[1:]:
    raw=subprocess.run(['ffmpeg','-loglevel','error','-i',f'v{n}.mp4','-vn','-ac','1','-ar','16000','-f','f32le','-'],capture_output=True).stdout
    a=np.frombuffer(raw,dtype=np.float32)
    seg,_=m.transcribe(a,language='de',word_timestamps=True,vad_filter=False)
    w=[(x.word.strip(),round(x.start,2),round(x.end,2)) for s in seg for x in s.words]
    json.dump(w,open(f'words{n}.json','w'),ensure_ascii=False)
    print(n,' '.join(x[0] for x in w),flush=True)
