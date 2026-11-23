"""Parse chaiten2/guion.txt: '#S id|tableBlock|title|scene' headers followed by 'speaker: text' lines."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "chaiten"))
from parse import sentences, norm  # noqa: E402

def parse(path=os.path.join(os.path.dirname(os.path.abspath(__file__)), "guion.txt")):
    secs = []
    for line in open(path, encoding="utf-8"):
        line = line.strip()
        if not line: continue
        if line.startswith("#S "):
            sid, tb, title, scene = line[3:].split("|")
            secs.append({"id": int(sid), "table": int(tb), "title": title, "scene": scene, "turns": []}); continue
        spk, text = line.split(":", 1)
        secs[-1]["turns"].append({"spk": spk.strip(), "text": text.strip()})
    return secs

def norm2(s):
    return norm(s).replace("horas horas", "horas")
