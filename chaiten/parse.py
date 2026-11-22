"""Parse guion.txt into blocks/turns/sentences."""
import re
def parse(path="guion.txt"):
    blocks=[]
    for line in open(path,encoding="utf-8"):
        line=line.strip()
        if not line: continue
        if line.startswith("#B"):
            n,title=line[2:].split(" ",1)
            blocks.append({"n":int(n),"title":title,"turns":[]}); continue
        spk,text=line.split(":",1)
        blocks[-1]["turns"].append({"spk":spk.strip(),"text":text.strip()})
    return blocks

def sentences(text):
    # split on sentence end; keep pieces <= ~220 chars by splitting on ; or : or —
    parts=re.split(r'(?<=[.!?…])\s+(?=[A-ZÁÉÍÓÚ¿¡"])', text)
    out=[]
    for p in parts:
        while len(p)>230:
            cut=None
            for sep in ["; ", ": ", " —", ", y ", ", "]:
                idx=[m.start() for m in re.finditer(re.escape(sep), p) if 60<m.start()<230]
                if idx: cut=idx[-1]+(len(sep) if sep in ["; ",": ",", y ",", "] else 0); break
            if cut is None: break
            out.append(p[:cut].strip()); p=p[cut:].strip()
        out.append(p.strip())
    return [o for o in out if o]
