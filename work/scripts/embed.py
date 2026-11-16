import sys, numpy as np, soundfile as sf, onnxruntime as ort, kaldi_native_fbank as knf
audio, sr = sf.read(sys.argv[1], dtype='float32'); assert sr == 16000
sess = ort.InferenceSession('/tmp/claude-0/models/wespeaker.onnx')
def fbank(x):
    o = knf.FbankOptions(); o.frame_opts.dither = 0; o.frame_opts.samp_freq = 16000; o.mel_opts.num_bins = 80
    f = knf.OnlineFbank(o); f.accept_waveform(16000, (x * 32768).tolist()); f.input_finished()
    F = np.stack([f.get_frame(i) for i in range(f.num_frames_ready)])
    return F - F.mean(0)
win, hop = 1.5, 0.25
ts, embs, energy = [], [], []
t = 0.0
while t + win <= len(audio) / sr:
    seg = audio[int(t * sr):int((t + win) * sr)]
    e = sess.run(None, {'feats': fbank(seg)[None].astype(np.float32)})[0][0]
    embs.append(e / np.linalg.norm(e)); ts.append(t + win / 2); energy.append(float(np.sqrt((seg ** 2).mean())))
    t += hop
np.savez(sys.argv[2], t=np.array(ts), e=np.array(embs), rms=np.array(energy))
print(len(ts), 'windows')
