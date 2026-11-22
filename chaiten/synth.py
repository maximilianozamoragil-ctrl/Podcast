"""Generate every caption segment with XTTS-v2, one reference voice per character."""
import os, sys, json, re, time
os.environ["COQUI_TOS_AGREED"] = "1"
sys.path.insert(0, os.path.dirname(__file__))
from parse import parse, sentences, norm
import torch, soundfile as sf, numpy as np
torch.set_num_threads(4)
from TTS.api import TTS

REFS = sys.argv[1]; OUT = sys.argv[2]
os.makedirs(OUT, exist_ok=True)
tts = TTS("tts_models/multilingual/multi-dataset/xtts_v2")
segs = []
for b in parse():
    for ti, turn in enumerate(b["turns"]):
        for s in sentences(turn["text"]):
            segs.append({"block": b["n"], "spk": turn["spk"], "text": s, "tts": norm(s)})
json.dump(segs, open(os.path.join(OUT, "segs.json"), "w"), ensure_ascii=False, indent=1)
for i, sg in enumerate(segs):
    path = os.path.join(OUT, f"{i:03d}.wav")
    if os.path.exists(path): continue
    expected = len(sg["tts"]) / 13.0
    best = None
    for attempt in range(3):
        torch.manual_seed(1234 + attempt * 77 + i)
        wav = tts.tts(text=sg["tts"], speaker_wav=os.path.join(REFS, sg["spk"] + ".wav"), language="es",
                      speed=0.9, temperature=0.65, repetition_penalty=5.0)
        wav = np.asarray(wav, dtype=np.float32); dur = len(wav) / 24000
        ok = 0.55 * expected < dur < 1.7 * expected
        if best is None or ok: best = wav
        if ok: break
        print(f"retry {i} dur={dur:.1f} expected={expected:.1f}", flush=True)
    sf.write(path, best, 24000)
    print(f"{i+1}/{len(segs)} {sg['spk']} {len(best)/24000:.1f}s", flush=True)
print("DONE")
