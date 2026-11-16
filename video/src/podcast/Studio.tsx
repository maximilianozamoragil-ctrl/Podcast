import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { Character } from "./Character";
import { CAST, ORDER, SpeakerId } from "./cast";
import { fontFamily } from "./fonts";

export const SEAT_X: Record<SpeakerId, number> = { valen: 470, max: 960, rashid: 1450 };
export const DESK_TOP = 830;

export type Activity = Record<SpeakerId, number>;

export const StudioBackground: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: "linear-gradient(180deg, #1f1d45 0%, #2b275c 55%, #3a3373 100%)" }}>
      {/* acoustic panels */}
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: 30 + i * 240,
            top: 30,
            width: 200,
            height: 620,
            borderRadius: 26,
            background: "rgba(255,255,255,0.03)",
          }}
        />
      ))}
      {/* ON AIR sign */}
      <div
        style={{
          position: "absolute",
          left: 70,
          top: 60,
          fontFamily,
          fontWeight: 900,
          fontSize: 30,
          color: "#ff5c6c",
          border: "4px solid #ff5c6c",
          borderRadius: 14,
          padding: "4px 16px",
          boxShadow: "0 0 24px rgba(255,92,108,0.6)",
          letterSpacing: 2,
        }}
      >
        ● ON AIR
      </div>
      {/* plants */}
      <div style={{ position: "absolute", right: 70, top: 470, fontSize: 130, fontFamily: '"Noto Color Emoji"' }}>🪴</div>
      <div style={{ position: "absolute", left: 70, top: 470, fontSize: 130, fontFamily: '"Noto Color Emoji"' }}>🪴</div>
    </AbsoluteFill>
  );
};

const Seat: React.FC<{ id: SpeakerId; amount: number; mouth: number }> = ({ id, amount, mouth }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const look = CAST[id];
  const idx = ORDER.indexOf(id);
  const breathe = Math.sin(t * 1.6 + idx * 2) * 4;
  const talkBob = Math.sin(t * 9 + idx) * 5 * mouth * amount;
  const tilt = Math.sin(t * 2.3 + idx * 1.7) * 2.5 * amount;
  const x = SEAT_X[id];
  const w = 300;

  return (
    <>
      {/* spotlight */}
      <div
        style={{
          position: "absolute",
          left: x - 280,
          top: 420,
          width: 560,
          height: 520,
          background: `radial-gradient(ellipse at 50% 50%, ${look.color}66, rgba(0,0,0,0) 65%)`,
          opacity: amount,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: x - w / 2,
          top: 478,
          width: w,
          height: (w * 420) / 300,
          translate: `0px ${breathe + talkBob - amount * 16}px`,
          rotate: `${tilt}deg`,
          scale: String(1 + amount * 0.06),
          transformOrigin: "50% 100%",
          filter: `brightness(${0.8 + amount * 0.2})`,
        }}
      >
        <Character look={look} mouth={mouth * amount} time={t} blinkOffset={idx * 1.3} />
      </div>
      {/* microphone arm + mic, beside the face */}
      <div
        style={{
          position: "absolute",
          left: x + 150,
          top: 690,
          width: 14,
          height: 150,
          background: "#2a2a36",
          borderRadius: 7,
          rotate: "18deg",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: x + 108,
          top: 640,
          width: 58,
          height: 90,
          borderRadius: 29,
          background: "repeating-linear-gradient(0deg, #4a4a5c 0 6px, #5f5f75 6px 10px)",
          border: "5px solid #23232e",
          rotate: "-30deg",
          boxShadow: `0 0 ${amount * 30}px ${look.color}`,
        }}
      />
    </>
  );
};

export const Seats: React.FC<{ activity: Activity; mouth: number }> = ({ activity, mouth }) => (
  <>
    {ORDER.map((id) => (
      <Seat key={id} id={id} amount={activity[id]} mouth={mouth} />
    ))}
  </>
);

export const Desk: React.FC = () => (
  <>
    <div
      style={{
        position: "absolute",
        left: 40,
        right: 40,
        top: DESK_TOP,
        height: 30,
        borderRadius: 16,
        background: "#a0714b",
      }}
    />
    <div
      style={{
        position: "absolute",
        left: 70,
        right: 70,
        top: DESK_TOP + 24,
        height: 260,
        background: "linear-gradient(180deg, #6e472c 0%, #3e2718 100%)",
        boxShadow: "0 -6px 30px rgba(0,0,0,0.35)",
      }}
    />
  </>
);

export const NameTags: React.FC<{ activity: Activity }> = ({ activity }) => (
  <>
    {ORDER.map((id) => {
      const a = activity[id];
      const look = CAST[id];
      return (
        <div
          key={id}
          style={{
            position: "absolute",
            left: SEAT_X[id] - 100,
            top: DESK_TOP - 8,
            width: 200,
            textAlign: "center",
            fontFamily,
            fontWeight: 900,
            fontSize: 34,
            color: a > 0.5 ? "#1b1838" : "#ffffffcc",
            background: a > 0.5 ? look.color : "#2c2450",
            border: `3px solid ${look.color}`,
            borderRadius: 999,
            padding: "2px 0",
            scale: String(1 + a * 0.1),
          }}
        >
          {look.name}
        </div>
      );
    })}
  </>
);
