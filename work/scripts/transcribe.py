import json, sys
from faster_whisper import WhisperModel
m = WhisperModel('medium', device='cpu', compute_type='int8', cpu_threads=4)
import soundfile as sf
audio,_=sf.read(sys.argv[1],dtype="float32")
segs, info = m.transcribe(audio, word_timestamps=True, vad_filter=True, beam_size=5)
print('lang', info.language, info.language_probability, flush=True)
out=[]
for s in segs:
    out.append({'start':s.start,'end':s.end,'text':s.text,'words':[{'w':w.word,'s':w.start,'e':w.end,'p':w.probability} for w in s.words]})
    print(f"[{s.start:6.1f}-{s.end:6.1f}] {s.text}", flush=True)
json.dump({'language':info.language,'segments':out}, open(sys.argv[2],'w'), ensure_ascii=False, indent=1)
print('DONE')
