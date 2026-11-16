// Small animation building blocks for the topic screen.
// All `at` values are ABSOLUTE seconds in the podcast audio, so they can be
// matched directly against the transcript timestamps.
import React, { createContext, useContext } from "react";
import { Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { fontFamily } from "./fonts";

export const SceneStart = createContext(0);

const useLocal = (at: number) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const start = useContext(SceneStart);
  return { f: frame - (at - start) * fps, fps, frame };
};

export const EMOJI_FONT = '"Noto Color Emoji", "Apple Color Emoji", sans-serif';

type PopProps = {
  at: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
  from?: "scale" | "up" | "left" | "right";
  float?: number;
};

export const Pop: React.FC<PopProps> = ({ at, children, style, from = "scale", float = 0 }) => {
  const { f, fps } = useLocal(at);
  const s = spring({ frame: f, fps, config: { damping: 12, stiffness: 140 } });
  const o = interpolate(f, [0, 6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const bob = float ? Math.sin(f / fps * 2.2) * float : 0;
  const tr =
    from === "up"
      ? `0px ${(1 - s) * 60 + bob}px`
      : from === "left"
        ? `${(1 - s) * -120}px ${bob}px`
        : from === "right"
          ? `${(1 - s) * 120}px ${bob}px`
          : `0px ${bob}px`;
  return (
    <div
      style={{
        opacity: o,
        scale: from === "scale" ? String(Math.max(0, s)) : undefined,
        translate: tr,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export const Emoji: React.FC<{ e: string; size?: number; style?: React.CSSProperties }> = ({
  e,
  size = 150,
  style,
}) => (
  <div style={{ fontFamily: EMOJI_FONT, fontSize: size, lineHeight: 1, textAlign: "center", ...style }}>{e}</div>
);

export const Title: React.FC<{
  children: React.ReactNode;
  size?: number;
  color?: string;
  style?: React.CSSProperties;
}> = ({ children, size = 64, color = "#ffffff", style }) => (
  <div
    style={{
      fontFamily,
      fontWeight: 900,
      fontSize: size,
      color,
      lineHeight: 1.1,
      textAlign: "center",
      letterSpacing: -0.5,
      ...style,
    }}
  >
    {children}
  </div>
);

export const Label: React.FC<{ children: React.ReactNode; color?: string; size?: number; style?: React.CSSProperties }> = ({
  children,
  color = "#ffffffd9",
  size = 36,
  style,
}) => (
  <div style={{ fontFamily, fontWeight: 800, fontSize: size, color, textAlign: "center", lineHeight: 1.15, ...style }}>
    {children}
  </div>
);

export const Chip: React.FC<{ children: React.ReactNode; color: string; style?: React.CSSProperties }> = ({
  children,
  color,
  style,
}) => (
  <div
    style={{
      fontFamily,
      fontWeight: 900,
      fontSize: 34,
      color: "#1b1838",
      background: color,
      borderRadius: 999,
      padding: "8px 26px",
      display: "inline-block",
      ...style,
    }}
  >
    {children}
  </div>
);

export const Counter: React.FC<{
  at: number;
  to: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  size?: number;
  color?: string;
}> = ({ at, to, prefix = "", suffix = "", duration = 1.4, size = 120, color = "#7CFFB2" }) => {
  const { f, fps } = useLocal(at);
  const v = interpolate(f, [0, duration * fps], [0, to], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  return (
    <div style={{ fontFamily, fontWeight: 900, fontSize: size, color, lineHeight: 1, textAlign: "center" }}>
      {prefix}
      {Math.round(v)}
      {suffix}
    </div>
  );
};

// Animated red cross drawn over its children
export const Cross: React.FC<{ at: number; children: React.ReactNode; size?: number }> = ({
  at,
  children,
  size = 170,
}) => {
  const { f, fps } = useLocal(at);
  const p = interpolate(f, [0, 0.4 * fps], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div style={{ position: "relative", width: size, height: size, display: "flex", alignItems: "center", justifyContent: "center" }}>
      {children}
      <svg viewBox="0 0 100 100" style={{ position: "absolute", inset: 0 }}>
        <line x1={12} y1={12} x2={12 + 76 * p} y2={12 + 76 * p} stroke="#ff4d5e" strokeWidth={10} strokeLinecap="round" />
        <line x1={88} y1={12} x2={88 - 76 * Math.max(0, p * 2 - 1)} y2={12 + 76 * Math.max(0, p * 2 - 1)} stroke="#ff4d5e" strokeWidth={10} strokeLinecap="round" opacity={p > 0.5 ? 1 : 0} />
      </svg>
    </div>
  );
};

// Horizontal bar that grows to `pct`
export const Bar: React.FC<{ at: number; pct: number; color: string; width?: number; label: string }> = ({
  at,
  pct,
  color,
  width = 560,
  label,
}) => {
  const { f, fps } = useLocal(at);
  const p = interpolate(f, [0, 1.2 * fps], [0, pct], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
      <div style={{ fontFamily, fontWeight: 800, fontSize: 30, color: "#fff", width: 200, textAlign: "right" }}>{label}</div>
      <div style={{ width, height: 46, borderRadius: 23, background: "rgba(255,255,255,0.12)", overflow: "hidden" }}>
        <div style={{ width: `${p}%`, height: "100%", borderRadius: 23, background: color }} />
      </div>
    </div>
  );
};

export const Arrow: React.FC<{ at: number; color?: string; size?: number }> = ({ at, color = "#ffffffaa", size = 70 }) => (
  <Pop at={at}>
    <div style={{ fontFamily, fontWeight: 900, fontSize: size, color }}>→</div>
  </Pop>
);

export const Row: React.FC<{ children: React.ReactNode; gap?: number; style?: React.CSSProperties }> = ({
  children,
  gap = 40,
  style,
}) => <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap, ...style }}>{children}</div>;

export const Col: React.FC<{ children: React.ReactNode; gap?: number; style?: React.CSSProperties }> = ({
  children,
  gap = 14,
  style,
}) => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap, ...style }}>
    {children}
  </div>
);

// Pulsing wrapper (always on while the scene is visible)
export const Pulse: React.FC<{ children: React.ReactNode; amount?: number }> = ({ children, amount = 0.05 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return <div style={{ scale: String(1 + Math.sin((frame / fps) * 4) * amount) }}>{children}</div>;
};
