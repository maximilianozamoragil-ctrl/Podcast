import { interpolate } from "remotion";
import { ORDER, SpeakerId } from "../chaiten/cast";
import { CUES, SECTIONS, SEGS, Seg, Section } from "./timeline";

export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export const segAt = (t: number): Seg | undefined => SEGS.find((s) => t >= s.start && t <= s.end);

export const lastSeg = (t: number): Seg => {
  let found: Seg = SEGS[0];
  for (const s of SEGS) {
    if (s.start <= t + 0.15) found = s;
    else break;
  }
  return found;
};

export const sectionAt = (t: number): Section => {
  let s = SECTIONS[0];
  for (const x of SECTIONS) if (x.start <= t) s = x;
  return s;
};

// The interviewee each field section belongs to
export const OWNER: Record<number, SpeakerId> = { 4: "rashid", 5: "maximiliano", 6: "nicolas", 7: "rafael" };

// Moment inside a stinger where the picture changes (the impact hit)
export const STING_CUT = 1.15;

export type Scene = "intro" | "studio" | "field" | "outro";

export const sceneAt = (t: number): Scene => {
  const intro = CUES.find((c) => c.kind === "intro")!;
  if (t < intro.start + intro.dur) return "intro";
  let scene: Scene = "studio";
  for (const c of CUES) {
    if (c.kind === "stinger" && t >= c.start + STING_CUT) scene = c.to === "field" ? "field" : "studio";
  }
  return scene;
};

export type Activity = Record<SpeakerId, number>;

export const activityAt = (t: number): Activity => {
  const a = Object.fromEntries(ORDER.map((id) => [id, 0])) as Activity;
  for (const s of SEGS) {
    if (t < s.start - 0.3 || t > s.end + 0.9) continue;
    const v = interpolate(t, [s.start - 0.3, s.start, s.end + 0.6, s.end + 0.9], [0, 1, 1, 0], clamp);
    a[s.spk] = Math.max(a[s.spk], v);
  }
  return a;
};

export const mouthAt = (frame: number, env: number[]) => {
  const e0 = env[frame] ?? 0;
  const e1 = env[frame - 1] ?? e0;
  const e2 = env[frame + 1] ?? e0;
  return Math.min(1, ((e0 * 2 + e1 + e2) / 4) * 1.4);
};
