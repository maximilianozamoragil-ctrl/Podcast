import json, math
from parse import parse, sentences
FPS=30
blocks=parse(); t=0.0; segs=[]; bl=[]
for b in blocks:
    bl.append({"n":b["n"],"title":b["title"],"start":round(t,2)}); t+=3.0
    for turn in b["turns"]:
        for s in sentences(turn["text"]):
            d=len(s.split())/2.3
            segs.append({"spk":turn["spk"],"text":s,"start":round(t,2),"end":round(t+d,2),"block":b["n"]}); t+=d+0.5
        t+=0.6
t+=3
env=[]
for f in range(int(t*FPS)):
    x=f/FPS; v=0
    for s in segs:
        if s["start"]<=x<=s["end"]: v=abs(math.sin(x*11))*0.8+0.1
    env.append(round(v,2))
out=f"""// AUTO-GENERATED. Placeholder timing until the real voice track exists.
import type {{ SpeakerId }} from "./cast";
export type Seg = {{ spk: SpeakerId; text: string; start: number; end: number; block: number }};
export const BLOCKS: {{ n: number; title: string; start: number }}[] = {json.dumps(bl,ensure_ascii=False)};
export const SEGS: Seg[] = {json.dumps(segs,ensure_ascii=False)};
export const ENV: number[] = {json.dumps(env)};
export const DURATION = {round(t,2)};
export const HAS_AUDIO = false;
"""
open("../video/src/chaiten/timeline.ts","w").write(out)
print(len(segs), round(t/60,2),"min")
