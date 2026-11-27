import React from "react";
import { AbsoluteFill, random, useCurrentFrame, useVideoConfig } from "remotion";

// Volcano crater position on the 1920 x 1080 stage
const CX = 1010;
const CY = 470;

const PUFFS = Array.from({ length: 70 }).map((_, i) => ({
  phase: random(`p${i}`),
  side: random(`s${i}`) - 0.5,
  size: 0.7 + random(`z${i}`) * 0.7,
  shade: random(`c${i}`),
}));

const Plume: React.FC<{ t: number }> = ({ t }) => {
  const PERIOD = 26; // seconds for a puff to rise from crater to top
  return (
    <g>
      {PUFFS.map((p, i) => {
        const k = ((t / PERIOD + p.phase) % 1 + 1) % 1; // 0 at crater, 1 at top
        const y = CY - 20 - k * 560;
        // the column bends with the wind towards the right as it rises
        const x = CX + p.side * (40 + k * 420) + k * k * 520;
        const r = (30 + k * 170) * p.size;
        const g = Math.round(70 + p.shade * 50 + k * 30);
        const o = Math.min(1, k * 12) * (1 - Math.max(0, k - 0.85) / 0.15) * 0.92;
        return <circle key={i} cx={x} cy={y} r={r} fill={`rgb(${g},${g - 4},${g - 8})`} opacity={o} />;
      })}
    </g>
  );
};

// Deterministic volcanic lightning flashes inside the plume
const lightningAt = (t: number) => {
  const slot = Math.floor(t / 6.5);
  const r = random(`l${slot}`);
  const start = slot * 6.5 + r * 4;
  const on = r > 0.35 && t >= start && t < start + 0.22;
  return { on, seed: slot, flicker: on ? (Math.floor((t - start) * 30) % 3 === 1 ? 0.4 : 1) : 0 };
};

const Lightning: React.FC<{ t: number }> = ({ t }) => {
  const l = lightningAt(t);
  if (!l.on) return null;
  const pts: string[] = [];
  let x = CX + 60 + random(`lx${l.seed}`) * 200;
  let y = CY - 120;
  for (let i = 0; i < 9; i++) {
    pts.push(`${x},${y}`);
    x += (random(`lx${l.seed}-${i}`) - 0.4) * 70;
    y -= 30 + random(`ly${l.seed}-${i}`) * 30;
  }
  return (
    <g opacity={l.flicker}>
      <polyline points={pts.join(" ")} stroke="#e9e4ff" strokeWidth={5} fill="none" />
      <polyline points={pts.join(" ")} stroke="#a99bff" strokeWidth={16} fill="none" opacity={0.35} />
    </g>
  );
};

const House: React.FC<{ x: number; y: number; w: number; c: string }> = ({ x, y, w, c }) => (
  <g>
    <rect x={x} y={y} width={w} height={w * 0.6} fill={c} />
    <path d={`M${x - 8} ${y} L${x + w / 2} ${y - w * 0.4} L${x + w + 8} ${y} Z`} fill="#6b5f57" />
    {/* ash layer on the roof */}
    <path d={`M${x - 8} ${y} L${x + w / 2} ${y - w * 0.4} L${x + w + 8} ${y} L${x + w} ${y - 4} L${x + w / 2} ${y - w * 0.4 + 6} L${x} ${y - 4} Z`} fill="#b9b3ab" />
    <rect x={x + w * 0.18} y={y + w * 0.18} width={w * 0.22} height={w * 0.2} fill="#ffd27a" opacity={0.75} />
    <rect x={x + w * 0.6} y={y + w * 0.18} width={w * 0.22} height={w * 0.2} fill="#ffd27a" opacity={0.5} />
  </g>
);

export const Background: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const flash = lightningAt(t).flicker;
  const glow = 0.75 + Math.sin(t * 2.1) * 0.15 + Math.sin(t * 5.3) * 0.08;

  return (
    <AbsoluteFill>
      <svg viewBox="0 0 1920 1080" width="100%" height="100%">
        <defs>
          <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#2c2a31" />
            <stop offset="0.45" stopColor="#6b5548" />
            <stop offset="0.8" stopColor="#b77c52" />
          </linearGradient>
          <radialGradient id="glow" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="#ffb347" stopOpacity="0.95" />
            <stop offset="0.4" stopColor="#ff6a2b" stopOpacity="0.5" />
            <stop offset="1" stopColor="#ff3b1f" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="mt" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#4a423f" />
            <stop offset="1" stopColor="#2c2827" />
          </linearGradient>
        </defs>
        <rect width="1920" height="1080" fill="url(#sky)" />
        <rect width="1920" height="1080" fill="#d8d0ff" opacity={flash * 0.12} />
        {/* far ridges */}
        <path d="M0 640 L180 520 L330 590 L470 500 L640 600 L760 560 L1300 590 L1480 500 L1650 570 L1800 520 L1920 560 L1920 800 L0 800 Z" fill="#4e5360" opacity={0.75} />
        {/* the volcano */}
        <circle cx={CX} cy={CY} r={260} fill="url(#glow)" opacity={glow} />
        <path d={`M560 820 C760 700 900 520 ${CX - 70} ${CY} L${CX + 70} ${CY} C1120 520 1260 700 1480 820 Z`} fill="url(#mt)" />
        {/* ash-covered flanks */}
        <path d={`M${CX - 70} ${CY} L${CX + 70} ${CY} C1080 500 1110 540 1150 590 C1100 570 1060 560 1030 580 C1000 560 960 560 900 600 C940 540 960 500 ${CX - 70} ${CY} Z`} fill="#8f8780" opacity={0.6} />
        {/* lava glow in the crater */}
        <ellipse cx={CX} cy={CY + 4} rx={72} ry={14} fill="#ff7b2e" opacity={glow} />
        <Plume t={t} />
        <Lightning t={t} />
        {/* nearer hills with forest */}
        <path d="M0 760 C200 700 380 720 560 760 C760 800 1200 790 1400 760 C1600 730 1780 720 1920 750 L1920 1080 L0 1080 Z" fill="#33382f" />
        {Array.from({ length: 34 }).map((_, i) => {
          const x = i * 58 + random(`tx${i}`) * 30;
          const h = 40 + random(`th${i}`) * 40;
          const y = 760 + Math.sin(i) * 12;
          return <path key={i} d={`M${x} ${y} L${x + 14} ${y - h} L${x + 28} ${y} Z`} fill="#28302a" />;
        })}
        {/* town of Chaitén */}
        <House x={40} y={790} w={90} c="#a8665a" />
        <House x={160} y={800} w={70} c="#5f7d96" />
        <House x={1450} y={796} w={80} c="#c4a25f" />
        <House x={1560} y={804} w={66} c="#7a6aa0" />
        <House x={1660} y={792} w={92} c="#5e8f6f" />
        <House x={1790} y={800} w={74} c="#b06c4a" />
        {/* ash haze */}
        <rect width="1920" height="1080" fill="#8e8378" opacity={0.18} />
      </svg>
    </AbsoluteFill>
  );
};

const FLAKES = Array.from({ length: 140 }).map((_, i) => ({
  x: random(`fx${i}`) * 1920,
  speed: 40 + random(`fs${i}`) * 70,
  size: 1.5 + random(`fz${i}`) * 3.5,
  sway: random(`fw${i}`) * 6,
  off: random(`fo${i}`) * 1200,
  o: 0.35 + random(`fa${i}`) * 0.5,
}));

export const AshFall: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <svg viewBox="0 0 1920 1080" width="100%" height="100%">
        {FLAKES.map((f, i) => {
          const y = ((f.off + t * f.speed) % 1180) - 50;
          const x = (f.x + t * 18 + Math.sin(t * 0.8 + i) * f.sway * 4) % 1960;
          return <circle key={i} cx={x} cy={y} r={f.size} fill="#d9d4cc" opacity={f.o} />;
        })}
      </svg>
    </AbsoluteFill>
  );
};
