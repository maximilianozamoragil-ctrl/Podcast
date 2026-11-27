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
        while len(p)>200:
            cut=None
            for sep in ["; ", ": ", " —", ", ", " y "]:
                idx=[m.start() for m in re.finditer(re.escape(sep), p) if 60<m.start()<200]
                if idx: cut=idx[-1]+(len(sep) if sep in ["; ",": ",", "] else 0); break
            if cut is None: break
            out.append(p[:cut].strip()); p=p[cut:].strip()
        out.append(p.strip())
    return [o for o in out if o]


NUM = {"0":"cero","5":"cinco","10":"diez","15":"quince","20":"veinte","35":"treinta y cinco","100":"cien"}
TIMES = {"05:40":"las cinco y cuarenta","07:10":"las siete y diez","08:00":"las ocho","09:20":"las nueve y veinte",
         "10:30":"las diez y media","11:40":"las once y cuarenta","12:00":"las doce","14:00":"las catorce horas","16:00":"las dieciséis horas"}

def norm(s):
    for k, v in TIMES.items():
        s = s.replace("las " + k, v).replace("la " + k, v).replace(k, v)
    s = s.replace("SERNAGEOMIN", "Sernageomín").replace("CESFAM", "Cesfam")
    s = re.sub(r"\((\d+) créditos\)", lambda m: ", " + NUM[m.group(1)] + " créditos,", s)
    s = re.sub(r"\b(\d+)\b", lambda m: NUM.get(m.group(1), m.group(1)), s)
    s = s.replace("—", ", ").replace('"', "").replace("...", ".")
    s = re.sub(r"\s*,\s*,", ",", s); s = re.sub(r",\s*([.?:;])", r"\1", s); s = re.sub(r"\s+", " ", s)
    s = s.replace("¿", "").replace("?", ".")  # XTTS tends to mangle ¿?; keep intonation simple
    return s.strip(" ,")

