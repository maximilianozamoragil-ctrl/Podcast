import json, re
tr=json.load(open('transcript.json')); cl=json.load(open('seg_clusters.json'))
SPK={0:'max',1:'valen',2:'rashid'}
# (segment index or None for all, original token stripped of punctuation, replacement) ; '' = merge into previous word
FIX=[(None,'Varen','Valen'),(None,'Rajiv','Rashid'),(None,'Rajit','Rashid'),
 (18,'vía','biorreactor'),(18,'reactor',''),(18,'ricos','con'),
 (22,'naves','nuggets'),(22,'ITYAS','Eat Just'),(23,'Singapore','Singapur'),
 (31,'de','E.'),(39,'lo',''),(39,'gran','logran'),(26,'vivieramos','viviéramos'),
 (56,'prometeora','prometedora'),(85,'Vogue','Vow'),(85,'albondia','albóndiga'),
 (54,'bioreactores','biorreactores'),(0,'Vídeo','Video')]
words=[]
for i,s in enumerate(tr['segments']):
    spk=SPK[cl[i]]
    for w in s['words']:
        txt=w['w']; core=re.sub(r'^[\s¿¡]+|[\s.,;:?!]+$','',txt)
        for si,o,r in FIX:
            if (si is None or si==i) and core==o:
                if r=='':
                    words[-1]['endMs']=int(w['e']*1000); words[-1]['text']+=txt[txt.index(core)+len(core):]; txt=None
                else: txt=txt.replace(o,r)
                break
        if txt is None: continue
        words.append({'text':txt if txt.startswith(' ') else ' '+txt,'startMs':int(w['s']*1000),'endMs':int(w['e']*1000),'spk':spk,'seg':i})
# speaker turns from segments
turns=[]
for i,s in enumerate(tr['segments']):
    spk=SPK[cl[i]]
    if turns and turns[-1]['spk']==spk and s['start']-turns[-1]['end']<1.5: turns[-1]['end']=s['end']
    else: turns.append({'spk':spk,'start':s['start'],'end':s['end']})
env=json.load(open('env.json'))
open('../video/src/podcast/data.ts','w').write(
 "// Generated from the podcast audio (Whisper transcript + voice clustering).\n"
 "import type { SpeakerId } from './cast';\n\n"
 "export type Word = { text: string; startMs: number; endMs: number; spk: SpeakerId; seg: number };\n"
 "export type Turn = { spk: SpeakerId; start: number; end: number };\n\n"
 f"export const WORDS: Word[] = {json.dumps(words,ensure_ascii=False)};\n\n"
 f"export const TURNS: Turn[] = {json.dumps([{**t,'start':round(t['start'],2),'end':round(t['end'],2)} for t in turns])};\n\n"
 f"// Loudness per frame at 30 fps (0..1), drives the mouth animation.\nexport const ENVELOPE: number[] = {json.dumps(env)};\n")
print(len(words),'words',len(turns),'turns')
print(''.join(w['text'] for w in words if w['seg'] in (18,22,31,39,85)))
