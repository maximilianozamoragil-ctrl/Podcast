"""Original, procedurally generated news music (no samples): cortina, bed, stinger, closing pad."""
import numpy as np
from scipy.signal import lfilter

SR = 44100
BPM = 120
BEAT = 60 / BPM
rng = np.random.default_rng(3)


def hz(m):
    return 440.0 * 2 ** ((m - 69) / 12)


def t_(d):
    return np.arange(int(d * SR)) / SR


def lowpass(x, cutoff):
    a = np.exp(-2 * np.pi * cutoff / SR)
    return lfilter([1 - a], [1, -a], x)


def highpass(x, cutoff):
    return x - lowpass(x, cutoff)


def saw(f, d, detune=0.0):
    t = t_(d)
    out = np.zeros_like(t)
    for dt in (-detune, 0.0, detune) if detune else (0.0,):
        ph = (t * f * (1 + dt)) % 1.0
        out += 2 * ph - 1
    return out / (3 if detune else 1)


def adsr(n, a=0.005, d=0.1, s=0.6, r=0.1):
    e = np.ones(n) * s
    na, nd, nr = int(a * SR), int(d * SR), int(r * SR)
    na = min(na, n); e[:na] = np.linspace(0, 1, na)
    nd = min(nd, n - na); e[na:na + nd] = np.linspace(1, s, nd)
    if nr and n > nr: e[-nr:] *= np.linspace(1, 0, nr)
    return e


def place(buf, x, at):
    i = int(at * SR)
    if i >= len(buf): return
    j = min(len(buf), i + len(x))
    buf[i:j] += x[: j - i]


def reverb(x, seconds=1.4, mix=0.25):
    n = int(seconds * SR)
    ir = rng.standard_normal(n) * np.exp(-np.linspace(0, 7, n))
    ir = lowpass(ir, 5000)
    ir /= np.sqrt(np.sum(ir ** 2))
    L = len(x) + n
    N = 1 << (L - 1).bit_length()
    wet = np.fft.irfft(np.fft.rfft(x, N) * np.fft.rfft(ir, N), N)[: len(x)]
    return x * (1 - mix) + wet * mix


def timpani(f=55, d=1.2):
    t = t_(d)
    fr = f * (1 + 0.6 * np.exp(-t * 30))
    ph = 2 * np.pi * np.cumsum(fr) / SR
    body = np.sin(ph) * np.exp(-t * 3.2)
    click = lowpass(rng.standard_normal(len(t)), 1200) * np.exp(-t * 40) * 0.6
    return body + click


def tick(d=0.04):
    t = t_(d)
    return highpass(rng.standard_normal(len(t)), 6000) * np.exp(-t * 120)


def brass(notes, d, cutoff=2200):
    x = sum(saw(hz(m), d, detune=0.004) for m in notes) / len(notes)
    x = lowpass(x, cutoff)
    return x * adsr(len(x), a=0.02, d=0.25, s=0.55, r=0.25)


def pluck(m, d=0.12, cutoff=3000):
    x = lowpass(saw(hz(m), d), cutoff)
    return x * adsr(len(x), a=0.002, d=0.08, s=0.15, r=0.03)


PROG = [(50, [62, 65, 69]), (46, [58, 62, 65]), (53, [57, 60, 65]), (48, [55, 60, 64])]  # Dm Bb F C


def cortina(duration, with_hits=True):
    """Urgent 120 bpm news theme. One chord per bar (2 s)."""
    buf = np.zeros(int(duration * SR))
    bar = 4 * BEAT
    nb = int(np.ceil(duration / bar))
    for b in range(nb):
        root, chord = PROG[b % 4]
        t0 = b * bar
        # 16th-note pulse
        for k in range(16):
            m = root + 12 + (12 if k % 4 == 2 else 0) + (7 if k % 8 == 7 else 0)
            place(buf, pluck(m) * (0.9 if k % 4 == 0 else 0.55), t0 + k * BEAT / 4)
        # clock ticks on 8ths
        for k in range(8):
            place(buf, tick() * (0.35 if k % 2 else 0.5), t0 + k * BEAT / 2)
        # bass
        place(buf, lowpass(saw(hz(root - 12), bar * 0.95), 400) * adsr(int(bar * 0.95 * SR), d=0.3, s=0.7, r=0.2) * 0.8, t0)
        if with_hits:
            place(buf, brass(chord, BEAT * 1.5) * 0.9, t0)
            place(buf, brass(chord, BEAT * 0.5) * 0.6, t0 + BEAT * 2.5)
            place(buf, timpani(hz(root - 24)) * 1.1, t0)
            place(buf, timpani(hz(root - 24)) * 0.7, t0 + BEAT * 2)
    buf = reverb(buf, 1.2, 0.18)
    return buf / (np.abs(buf).max() + 1e-9)


def intro_hit():
    """Opening impact: rising sweep into a big chord + timpani."""
    d = 5.0
    buf = np.zeros(int(d * SR))
    t = t_(1.0)
    sweep = rng.standard_normal(len(t))
    sweep = highpass(lowpass(sweep, 1500 + 6000 * t[-1]), 300) * np.linspace(0, 1, len(t)) ** 2
    place(buf, sweep * 0.5, 0)
    place(buf, brass([50, 57, 62, 65, 69], 3.2, cutoff=3000) * 1.2, 1.0)
    place(buf, timpani(hz(26), 2.5) * 1.6, 1.0)
    for k in range(6):
        place(buf, timpani(hz(26), 0.4) * (0.3 + k * 0.1), 0.4 + k * 0.1)
    buf = reverb(buf, 2.0, 0.3)
    return buf / (np.abs(buf).max() + 1e-9)


def stinger():
    """3 s 'ráfaga de noticias': whoosh, impact, stab with tail."""
    d = 3.0
    buf = np.zeros(int(d * SR))
    t = t_(1.0)
    n = rng.standard_normal(len(t))
    w = np.concatenate([lowpass(n[i:i + 2205], 400 + 9000 * (i / len(n)) ** 2) for i in range(0, len(n), 2205)])
    place(buf, highpass(w, 200) * np.linspace(0, 1, len(w)) ** 3 * 0.9, 0)
    place(buf, timpani(40, 1.8) * 1.4, 1.0)
    noise = rng.standard_normal(int(0.3 * SR)) * np.exp(-np.linspace(0, 12, int(0.3 * SR)))
    place(buf, lowpass(noise, 2500) * 0.7, 1.0)
    place(buf, brass([62, 65, 69, 74], 0.6, cutoff=3500) * 1.0, 1.0)
    for k, m in enumerate([74, 77, 81]):
        place(buf, pluck(m, 0.2) * 0.6, 1.0 + 0.12 * (k + 1))
    buf = reverb(buf, 1.8, 0.35)
    buf *= np.concatenate([np.ones(len(buf) - int(0.4 * SR)), np.linspace(1, 0, int(0.4 * SR))])
    return buf / (np.abs(buf).max() + 1e-9)


def closing(duration):
    """Soft closing theme: warm pad + gentle arpeggio (same progression)."""
    buf = np.zeros(int(duration * SR))
    bar = 4.0
    for b in range(int(np.ceil(duration / bar))):
        root, chord = PROG[b % 4]
        pad = sum(saw(hz(m - 12), bar + 1.0, detune=0.006) for m in chord) / 3
        pad = lowpass(pad, 900) * adsr(len(pad), a=1.0, d=0.5, s=0.8, r=1.0)
        place(buf, pad * 0.7, b * bar)
        place(buf, lowpass(saw(hz(root - 12), bar), 300) * adsr(int(bar * SR), a=0.3, s=0.8, r=0.5) * 0.5, b * bar)
        for k in range(8):
            m = chord[k % 3] + (12 if k >= 4 else 0)
            place(buf, pluck(m, 0.35, 2200) * 0.35, b * bar + k * 0.5)
    buf = reverb(buf, 2.2, 0.35)
    return buf / (np.abs(buf).max() + 1e-9)
