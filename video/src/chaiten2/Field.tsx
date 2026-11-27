import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { fontFamily } from "../podcast/fonts";
import { AshFall, Background } from "../chaiten/Background";
import { CAST, COMMITTEE, ORDER, SpeakerId } from "../chaiten/cast";
import { Person } from "../chaiten/Person";
import { Activity, clamp, OWNER, sectionAt } from "./timing";

const X: Record<string, number> = { rashid: 560, maximiliano: 880, nicolas: 1200, rafael: 1520 };
const TABLE_TOP = 830;

const Member: React.FC<{ id: SpeakerId; amount: number; mouth: number; lookX: number; t: number }> = ({ id, amount, mouth, lookX, t }) => {
  const look = CAST[id];
  const idx = ORDER.indexOf(id);
  const w = 280;
  const x = X[id];
  return (
    <>
      <div style={{ position: "absolute", left: x - 260, top: 360, width: 520, height: 480, background: `radial-gradient(ellipse at 50% 55%, ${look.color}55, rgba(0,0,0,0) 65%)`, opacity: amount }} />
      <div
        style={{
          position: "absolute",
          left: x - w / 2,
          top: 405,
          width: w,
          height: (w * 420) / 300,
          translate: `0px ${Math.sin(t * 1.5 + idx * 2) * 3 + Math.sin(t * 8 + idx) * 4 * mouth * amount - amount * 10}px`,
          rotate: `${Math.sin(t * 2.1 + idx * 1.7) * 2.2 * amount}deg`,
          transformOrigin: "50% 100%",
          filter: `brightness(${0.85 + amount * 0.15})`,
        }}
      >
        <Person look={look} mouth={mouth * amount} time={t} blinkOffset={idx * 1.3} lookX={lookX} />
      </div>
      {/* gooseneck mic */}
      <div style={{ position: "absolute", left: x + 110, top: 770, width: 8, height: 70, background: "#26262e", borderRadius: 4, rotate: "-14deg" }} />
      <div style={{ position: "absolute", left: x + 90, top: 748, width: 30, height: 46, borderRadius: 15, background: "repeating-linear-gradient(0deg, #3e3e4c 0 5px, #565668 5px 9px)", border: "3px solid #1b1b22", rotate: "-20deg", boxShadow: amount > 0.3 ? `0 0 ${amount * 22}px ${look.color}` : undefined }} />
    </>
  );
};

// Valentino asking from the studio, shown as a split-screen window
const StudioWindow: React.FC<{ amount: number; mouth: number; t: number }> = ({ amount, mouth, t }) => {
  const o = interpolate(amount, [0, 1], [0, 1], clamp);
  if (o <= 0.01) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: 40,
        top: 110,
        width: 470,
        height: 330,
        borderRadius: 16,
        overflow: "hidden",
        border: "5px solid #4fc3f7",
        background: "linear-gradient(180deg, #0b1630, #13284f)",
        opacity: o,
        translate: `${(1 - o) * -80}px 0px`,
        boxShadow: "0 10px 40px rgba(0,0,0,0.5)",
      }}
    >
      <div style={{ position: "absolute", left: 125, top: 30, width: 220, height: (220 * 420) / 300 }}>
        <Person look={CAST.valentino} mouth={mouth * amount} time={t} blinkOffset={0.4} lookX={1} />
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 60, background: "#b71c1c" }} />
      <div style={{ position: "absolute", left: 14, top: 12, fontFamily, fontWeight: 900, fontSize: 20, color: "#fff", background: "rgba(0,0,0,0.5)", padding: "2px 10px", borderRadius: 6 }}>ESTUDIO CENTRAL</div>
    </div>
  );
};

export const FieldScene: React.FC<{ activity: Activity; mouth: number }> = ({ activity, mouth }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const sec = sectionAt(t);
  // camera: average the focus over the last second so section changes become pans
  let fx = 0;
  let z = 0;
  for (let i = 0; i < 10; i++) {
    const s = sectionAt(t - i * 0.12);
    const owner = OWNER[s.id];
    fx += owner ? X[owner] : 1040;
    z += owner ? 1.16 : 1.0;
  }
  fx /= 10;
  z /= 10;
  const half = 960 / z;
  const cx = Math.min(1920 - half, Math.max(half, fx));
  const cy = 540 + (z - 1) * 300;
  const cam = `translate(960px, 540px) scale(${z}) translate(${-cx}px, ${-cy}px)`;
  const bgCam = `translate(960px, 540px) scale(${1 + (z - 1) * 0.5}) translate(${-(960 + (cx - 960) * 0.5)}px, ${-540}px)`;
  const owner = OWNER[sec.id];

  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ transform: bgCam, transformOrigin: "0 0" }}>
        <Background />
      </AbsoluteFill>
      <AbsoluteFill style={{ transform: cam, transformOrigin: "0 0" }}>
        <div style={{ position: "absolute", left: 330, top: 330, width: 1460, height: 520, background: "rgba(25,28,36,0.35)" }} />
        <div style={{ position: "absolute", left: 330, top: 330, width: 1460, height: 52, background: "#c62828", color: "#fff", fontFamily, fontWeight: 900, fontSize: 30, letterSpacing: 3, display: "flex", alignItems: "center", justifyContent: "center" }}>
          COMITÉ DE EMERGENCIA · COMUNA DE CHAITÉN
        </div>
        {COMMITTEE.map((id) => {
          const target = activity.valentino > 0.5 ? null : id === owner ? null : owner;
          const dir = target ? Math.sign(X[target] - X[id]) : activity.valentino > 0.5 ? -1 : 0;
          return <Member key={id} id={id} amount={Math.max(activity[id], id === owner ? 0.35 : 0)} mouth={activity[id] > 0.5 ? mouth : 0} lookX={dir} t={t} />;
        })}
        <div style={{ position: "absolute", left: 330, width: 1460, top: TABLE_TOP, height: 26, borderRadius: 10, background: "#d9d6d0" }} />
        <div style={{ position: "absolute", left: 350, width: 1420, top: TABLE_TOP + 22, height: 300, background: "linear-gradient(180deg, #1d3557 0%, #152842 100%)" }} />
        {COMMITTEE.map((id) => (
          <div key={id} style={{ position: "absolute", left: X[id] - 95, top: TABLE_TOP + 36, width: 190, height: 40, borderRadius: 6, background: id === owner ? CAST[id].color : "#f3f1ec", color: "#15202e", fontFamily, fontWeight: 900, fontSize: 24, display: "flex", alignItems: "center", justifyContent: "center" }}>
            {CAST[id].name}
          </div>
        ))}
      </AbsoluteFill>
      <AshFall />
      <StudioWindow amount={activity.valentino} mouth={mouth} t={t} />
      <div style={{ position: "absolute", left: 40, top: 452, fontFamily, fontWeight: 900, fontSize: 24, color: "#111", background: "#ffca28", padding: "4px 14px", borderRadius: 6, opacity: activity.valentino > 0.3 ? 0 : 1 }}>
        📍 EN TERRENO · CHAITÉN
      </div>
    </AbsoluteFill>
  );
};
