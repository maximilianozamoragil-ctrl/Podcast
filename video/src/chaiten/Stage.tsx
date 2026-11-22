import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { fontFamily } from "../podcast/fonts";
import { CAST, COMMITTEE, ORDER, SEAT_X, SpeakerId } from "./cast";
import { Person } from "./Person";
import { Activity, lastSeg } from "./timing";

export const TABLE_TOP = 830;

const Mic: React.FC<{ x: number; glow: string; on: number }> = ({ x, glow, on }) => (
  <>
    <div style={{ position: "absolute", left: x + 150, top: 770, width: 8, height: 70, background: "#26262e", borderRadius: 4, rotate: "-14deg" }} />
    <div
      style={{
        position: "absolute",
        left: x + 130,
        top: 748,
        width: 30,
        height: 46,
        borderRadius: 15,
        background: "repeating-linear-gradient(0deg, #3e3e4c 0 5px, #565668 5px 9px)",
        border: "3px solid #1b1b22",
        rotate: "-20deg",
        boxShadow: on > 0.3 ? `0 0 ${on * 22}px ${glow}` : undefined,
      }}
    />
  </>
);

const Seat: React.FC<{ id: SpeakerId; amount: number; mouth: number; lookX: number }> = ({ id, amount, mouth, lookX }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const look = CAST[id];
  const idx = ORDER.indexOf(id);
  const host = id === "valentino";
  const w = host ? 300 : 270;
  const top = host ? 400 : 410;
  const x = SEAT_X[id];
  const breathe = Math.sin(t * 1.5 + idx * 2) * 3;
  const talkBob = Math.sin(t * 8 + idx) * 4 * mouth * amount;
  const tilt = Math.sin(t * 2.1 + idx * 1.7) * 2.2 * amount;

  return (
    <>
      <div
        style={{
          position: "absolute",
          left: x - 260,
          top: 360,
          width: 520,
          height: 480,
          background: `radial-gradient(ellipse at 50% 55%, ${look.color}55, rgba(0,0,0,0) 65%)`,
          opacity: amount,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: x - w / 2,
          top,
          width: w,
          height: (w * 420) / 300,
          translate: `0px ${breathe + talkBob - amount * 10}px`,
          rotate: `${tilt}deg`,
          transformOrigin: "50% 100%",
          filter: `brightness(${0.82 + amount * 0.18})`,
        }}
      >
        <Person look={look} mouth={mouth * amount} time={t} blinkOffset={idx * 1.3} lookX={lookX} />
      </div>
    </>
  );
};

// Valentino's handheld microphone with a channel flag
const HandMic: React.FC<{ amount: number }> = ({ amount }) => {
  const x = SEAT_X.valentino;
  const lift = amount * -18;
  return (
    <div style={{ position: "absolute", left: x + 40, top: 628 + lift, width: 120, height: 200 }}>
      <div style={{ position: "absolute", left: 30, top: 0, width: 46, height: 46, borderRadius: 23, background: "radial-gradient(circle at 35% 35%, #8a8a96, #2d2d35)" }} />
      <div
        style={{
          position: "absolute",
          left: 22,
          top: 40,
          width: 62,
          height: 42,
          background: "#d32f2f",
          borderRadius: 6,
          color: "#fff",
          fontFamily,
          fontWeight: 900,
          fontSize: 13,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          lineHeight: 1,
        }}
      >
        EN
        <br />
        VIVO
      </div>
      <div style={{ position: "absolute", left: 44, top: 80, width: 18, height: 70, background: "#1e1e24", borderRadius: 6 }} />
      {/* hand */}
      <div style={{ position: "absolute", left: 32, top: 100, width: 44, height: 40, borderRadius: 18, background: CAST.valentino.skin, border: `3px solid ${CAST.valentino.skinShade}` }} />
      {/* white sleeve */}
      <div style={{ position: "absolute", left: 30, top: 134, width: 50, height: 70, borderRadius: 14, background: "#f5f7fa", border: "3px solid #d3d9e1" }} />
    </div>
  );
};

export const Stage: React.FC<{ activity: Activity; mouth: number }> = ({ activity, mouth }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const speaker = lastSeg(t).spk;

  return (
    <>
      {/* emergency tent canopy behind the committee */}
      <div style={{ position: "absolute", left: 640, top: 330, width: 1250, height: 520, background: "rgba(25,28,36,0.35)" }} />
      <div
        style={{
          position: "absolute",
          left: 640,
          top: 330,
          width: 1250,
          height: 52,
          background: "#c62828",
          color: "#fff",
          fontFamily,
          fontWeight: 900,
          fontSize: 30,
          letterSpacing: 3,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        COMITÉ DE EMERGENCIA · COMUNA DE CHAITÉN
      </div>
      {ORDER.map((id) => {
        const dir = id === speaker ? 0 : Math.sign(SEAT_X[speaker] - SEAT_X[id]);
        return <Seat key={id} id={id} amount={activity[id]} mouth={mouth} lookX={dir} />;
      })}
      {/* committee table */}
      <div style={{ position: "absolute", left: 640, width: 1250, top: TABLE_TOP, height: 26, borderRadius: 10, background: "#d9d6d0" }} />
      <div
        style={{
          position: "absolute",
          left: 660,
          width: 1210,
          top: TABLE_TOP + 22,
          height: 300,
          background: "linear-gradient(180deg, #1d3557 0%, #152842 100%)",
        }}
      />
      {COMMITTEE.map((id) => (
        <React.Fragment key={id}>
          <Mic x={SEAT_X[id] - 40} glow={CAST[id].color} on={activity[id]} />
          {/* table name card */}
          <div
            style={{
              position: "absolute",
              left: SEAT_X[id] - 95,
              top: TABLE_TOP + 36,
              width: 190,
              height: 40,
              borderRadius: 6,
              background: activity[id] > 0.5 ? CAST[id].color : "#f3f1ec",
              color: "#15202e",
              fontFamily,
              fontWeight: 900,
              fontSize: 24,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 0 rgba(0,0,0,0.3)",
            }}
          >
            {CAST[id].name}
          </div>
        </React.Fragment>
      ))}
      {/* reporter's stand-up desk */}
      <div style={{ position: "absolute", left: 150, width: 360, top: 840, height: 26, borderRadius: 10, background: "#d9d6d0" }} />
      <div
        style={{
          position: "absolute",
          left: 170,
          width: 320,
          top: 862,
          height: 230,
          background: "linear-gradient(180deg, #b71c1c 0%, #7f1212 100%)",
          color: "#fff",
          fontFamily,
          fontWeight: 900,
          fontSize: 30,
          textAlign: "center",
          paddingTop: 18,
          letterSpacing: 2,
        }}
      >
        COBERTURA ESPECIAL
      </div>
      <HandMic amount={activity.valentino} />
    </>
  );
};
