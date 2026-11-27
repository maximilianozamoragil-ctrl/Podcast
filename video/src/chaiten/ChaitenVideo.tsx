import React from "react";
import { Audio } from "@remotion/media";
import { AbsoluteFill, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { AshFall, Background } from "./Background";
import { Hud } from "./Hud";
import { Stage } from "./Stage";
import { ENV, HAS_AUDIO } from "./timeline";
import { activityAt, cameraAt } from "./timing";

const Camera: React.FC<{ children: React.ReactNode; depth: number }> = ({ children, depth }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { fx, zoom } = cameraAt(frame / fps);
  const z = 1 + (zoom - 1) * depth;
  const half = 960 / z;
  const cx = Math.min(1920 - half, Math.max(half, 960 + (fx - 960) * depth));
  const cy = 540 + (z - 1) * 260;
  return (
    <AbsoluteFill style={{ transform: `translate(960px, 540px) scale(${z}) translate(${-cx}px, ${-cy}px)`, transformOrigin: "0 0" }}>
      {children}
    </AbsoluteFill>
  );
};

const Scene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const activity = activityAt(t);
  const e0 = ENV[frame] ?? 0;
  const e1 = ENV[frame - 1] ?? e0;
  const e2 = ENV[frame + 1] ?? e0;
  const mouth = Math.min(1, ((e0 * 2 + e1 + e2) / 4) * 1.4);
  return (
    <>
      <Camera depth={0.5}>
        <Background />
      </Camera>
      <Camera depth={1}>
        <Stage activity={activity} mouth={mouth} />
      </Camera>
    </>
  );
};

export const ChaitenVideo: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#2c2a31" }}>
    <Scene />
    <AshFall />
    <Hud />
    {HAS_AUDIO ? <Audio src={staticFile("chaiten/voces.wav")} /> : null}
  </AbsoluteFill>
);
