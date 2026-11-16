import json, numpy as np
from sklearn.cluster import AgglomerativeClustering
d=np.load('emb.npz'); t,e,rms=d['t'],d['e'],d['rms']
tr=json.load(open('transcript.json'))
# use only windows that fall inside speech segments
speech=np.zeros(len(t),bool)
for s in tr['segments']:
    speech|=(t-0.75>=s['start']-0.1)&(t+0.75<=s['end']+0.1)
m=speech&(rms>np.percentile(rms,15))
lab=np.full(len(t),-1)
lab[m]=AgglomerativeClustering(n_clusters=3,metric='cosine',linkage='average').fit_predict(e[m])
cent=np.stack([e[lab==k].mean(0) for k in range(3)]); cent/=np.linalg.norm(cent,axis=1,keepdims=True)
sim=e@cent.T  # all windows
out=[]
for i,s in enumerate(tr['segments']):
    sel=(t>=s['start'])&(t<=s['end'])
    sc=sim[sel].mean(0) if sel.any() else sim[np.argmin(abs(t-(s['start']+s['end'])/2))]
    votes=np.bincount(sim[sel].argmax(1),minlength=3) if sel.any() else np.zeros(3,int)
    k=int(sc.argmax()); out.append(k)
    print(f"{i:2d} [{s['start']:6.1f}] C{k} votes={votes.tolist()} margin={sorted(sc)[-1]-sorted(sc)[-2]:.2f} {s['text'][:70]}")
json.dump(out,open('seg_clusters.json','w'))
