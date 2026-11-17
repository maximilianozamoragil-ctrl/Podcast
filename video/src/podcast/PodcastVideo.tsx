import React, { useMemo } from "react";
import { Audio } from "@remotion/media";
import { AbsoluteFill, interpolate, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { CAST, ORDER, SpeakerId } from "./cast";
import { ENVELOPE, TURNS, WORDS, Word } from "./data";
import { fontFamily } from "./fonts";
import { SceneStart } from "./kit";
import { SCENES } from "./scenes";
import { Activity, Desk, DESK_TOP, NameTags, Seats, StudioBackground } from "./Studio";

const RAMP = 0.25; // seconds to fade a speaker's spotlight in/out

const activityAt = (t: number): Activity => {
  const a: Activity = { valen: 0, max: 0, rashid: 0 };
  for (const turn of TURNS) {
    if (t < turn.start - RAMP || t > turn.end + RAMP + 0.4) continue;
    const v = interpolate(t, [turn.start - RAMP, turn.start, turn.end + 0.4, turn.end + 0.4 + RAMP], [0, 1, 1, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    a[turn.spk] = Math.max(a[turn.spk], v);
  }
  return a;
};

const Cast: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const activity = activityAt(t);
  // smooth the loudness a bit so the mouth doesn't flicker
  const e0 = ENVELOPE[frame] ?? 0;
  const e1 = ENVELOPE[frame - 1] ?? e0;
  const e2 = ENVELOPE[frame + 1] ?? e0;
  const mouth = Math.min(1, ((e0 * 2 + e1 + e2) / 4) * 1.3);
  return (
    <>
      <Seats activity={activity} mouth={mouth} />
      <Desk />
      <NameTags activity={activity} />
    </>
  );
};

// ---------- Topic screen ----------
const SCREEN = { left: 300, top: 36, width: 1320, height: 470 };

const Screen: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <div
      style={{
        position: "absolute",
        ...SCREEN,
        borderRadius: 36,
        background: "linear-gradient(160deg, #12112b 0%, #1b1a40 100%)",
        border: "8px solid #0c0b1e",
        boxShadow: "0 20px 60px rgba(0,0,0,0.5), inset 0 0 80px rgba(120,110,255,0.12)",
        overflow: "hidden",
      }}
    >
      {SCENES.map((s) => (
        <Sequence
          key={s.name}
          name={s.name}
          from={Math.round(s.from * fps)}
          durationInFrames={Math.round((s.to - s.from) * fps)}
          layout="none"
        >
          <SceneStart.Provider value={s.from}>
            <SceneFrame duration={s.to - s.from}>{s.el}</SceneFrame>
          </SceneStart.Provider>
        </Sequence>
      ))}
    </div>
  );
};

const SceneFrame: React.FC<{ duration: number; children: React.ReactNode }> = ({ duration, children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const out = interpolate(frame, [duration * fps - 8, duration * fps], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill
      style={{
        alignItems: "center",
        justifyContent: "center",
        padding: 30,
        opacity: out,
        scale: String(0.96 + out * 0.04),
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

// ---------- Captions ----------
type Page = { words: Word[]; startMs: number; endMs: number; spk: SpeakerId };

const MAX_WORDS = 8;

const buildPages = (): Page[] => {
  const pages: Page[] = [];
  let cur: Word[] = [];
  const flush = () => {
    if (cur.length) {
      pages.push({ words: cur, startMs: cur[0].startMs, endMs: cur[cur.length - 1].endMs, spk: cur[0].spk });
    }
    cur = [];
  };
  WORDS.forEach((w, i) => {
    const prev = WORDS[i - 1];
    if (prev && (prev.spk !== w.spk || w.startMs - prev.endMs > 700 || cur.length >= MAX_WORDS)) flush();
    // prefer breaking after punctuation when the page is already long
    cur.push(w);
    if (cur.length >= 6 && /[.,?!;:]$/.test(w.text.trim())) flush();
  });
  flush();
  // keep each page on screen until the next one starts (short gaps only)
  for (let i = 0; i < pages.length - 1; i++) {
    const gap = pages[i + 1].startMs - pages[i].endMs;
    pages[i].endMs += Math.min(gap, 600);
  }
  return pages;
};

const Captions: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pages = useMemo(buildPages, []);
  const ms = (frame / fps) * 1000;
  const page = pages.find((p) => ms >= p.startMs - 80 && ms <= p.endMs + 200);
  if (!page) return null;
  const color = CAST[page.spk].color;
  const appear = interpolate(ms, [page.startMs - 80, page.startMs + 80], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        position: "absolute",
        left: 130,
        right: 130,
        top: DESK_TOP + 44,
        height: 160,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: appear,
        translate: `0px ${(1 - appear) * 10}px`,
      }}
    >
      <div
        style={{
          fontFamily,
          fontWeight: 900,
          fontSize: 52,
          lineHeight: 1.2,
          maxWidth: 1560,
          textAlign: "center",
          color: "#ffffff",
          textShadow: "0 4px 0 rgba(0,0,0,0.35)",
        }}
      >
        <span
          style={{
            fontSize: 34,
            color: "#1b1838",
            background: color,
            borderRadius: 12,
            padding: "2px 14px",
            marginRight: 16,
            verticalAlign: "middle",
            textShadow: "none",
          }}
        >
          {CAST[page.spk].name}
        </span>
        {page.words.map((w, i) => {
          const active = ms >= w.startMs && ms < w.endMs + 60;
          const spoken = ms >= w.startMs;
          return (
            <span
              key={i}
              style={{
                color: active ? color : spoken ? "#ffffff" : "#ffffff88",
                whiteSpace: "pre-wrap",
              }}
            >
              {w.text}
            </span>
          );
        })}
      </div>
    </div>
  );
};

export const PodcastVideo: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#1f1d45" }}>
      <StudioBackground />
      <Screen />
      <Cast />
      <Captions />
      <Audio src={staticFile("podcast.m4a")} />
    </AbsoluteFill>
  );
};

export const SPEAKERS = ORDER;
