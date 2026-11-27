import { interpolate } from "remotion";
import { ORDER, SEAT_X, SpeakerId } from "./cast";
import { BLOCKS, SEGS, Seg } from "./timeline";

export const CARD_SECONDS = 3;
const RAMP = 0.3;

export const segAt = (t: number): Seg | undefined => SEGS.find((s) => t >= s.start && t <= s.end);

// most recent segment that started at or before t (or the next one if none yet)
export const lastSeg = (t: number): Seg => {
  let found: Seg = SEGS[0];
  for (const s of SEGS) {
    if (s.start <= t + 0.15) found = s;
    else break;
  }
  return found;
};

export type Activity = Record<SpeakerId, number>;

export const activityAt = (t: number): Activity => {
  const a = Object.fromEntries(ORDER.map((id) => [id, 0])) as Activity;
  for (const s of SEGS) {
    if (t < s.start - RAMP || t > s.end + 0.9 + RAMP) continue;
    const v = interpolate(t, [s.start - RAMP, s.start, s.end + 0.9, s.end + 0.9 + RAMP], [0, 1, 1, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    a[s.spk] = Math.max(a[s.spk], v);
  }
  return a;
};

export const inCard = (t: number) => BLOCKS.some((b) => t >= b.start && t < b.start + CARD_SECONDS);

export const blockAt = (t: number) => {
  let b = BLOCKS[0];
  for (const x of BLOCKS) if (x.start <= t) b = x;
  return b;
};

// Smoothed camera: averages the target over the last ~1 s so cuts become pans.
export const cameraAt = (t: number) => {
  const N = 12;
  let fx = 0;
  let z = 0;
  for (let i = 0; i < N; i++) {
    const tt = t - (i / (N - 1)) * 1.1;
    const s = lastSeg(Math.max(0, tt));
    const card = inCard(tt) || tt < 0;
    fx += card ? 960 : SEAT_X[s.spk];
    z += card ? 1 : 1.2;
  }
  fx /= N;
  z /= N;
  return { fx, zoom: z };
};
