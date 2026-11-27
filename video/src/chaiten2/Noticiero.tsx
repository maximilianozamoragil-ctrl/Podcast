import React from "react";
import { Audio } from "@remotion/media";
import { AbsoluteFill, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { FieldScene } from "./Field";
import { Hud, Intro, Outro, Stinger } from "./Overlays";
import { StudioScene } from "./Studio";
import { ENV } from "./timeline";
import { activityAt, mouthAt, sceneAt } from "./timing";

export const Noticiero: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const scene = sceneAt(t);
  const activity = activityAt(t);
  const mouth = mouthAt(frame, ENV);
  return (
    <AbsoluteFill style={{ backgroundColor: "#0b1630" }}>
      {scene === "intro" ? <Intro /> : null}
      {scene === "studio" ? (
<StudioScene mouth={mouth} amount={activity.valentino} />
      ) : null}
      {scene === "field" ? <FieldScene activity={activity} mouth={mouth} /> : null}
      <Hud />
      <Stinger />
      <Outro />
      <Audio src={staticFile("chaiten2/noticiero.wav")} />
    </AbsoluteFill>
  );
};
