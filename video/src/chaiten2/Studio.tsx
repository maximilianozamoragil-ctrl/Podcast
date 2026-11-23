import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { fontFamily } from "../podcast/fonts";
import { Background } from "../chaiten/Background";
import { CAST } from "../chaiten/cast";
import { Person } from "../chaiten/Person";
import { SEGS, SECTIONS } from "./timeline";
import { clamp, sectionAt } from "./timing";

const WALL = { left: 960, top: 120, width: 900, height: 560 };

const TIMELINE = [
  { h: "05:40", l: "SERNAGEOMIN informa aumento abrupto de sismicidad", icon: "📈" },
  { h: "07:10", l: "Emisión importante de ceniza sobre sectores habitados", icon: "🌋" },
  { h: "08:00", l: "Evacuación preventiva de sectores expuestos", icon: "🚶" },
  { h: "09:20", l: "Ceniza afecta caminos, agua y servicios básicos", icon: "🚧" },
  { h: "10:30", l: "Personas con dificultades respiratorias", icon: "🏥" },
  { h: "11:40", l: "Mascotas dentro de casas; familias quieren volver", icon: "🐕" },
  { h: "12:00", l: "Explosión mayor: alerta de lahares", icon: "💥" },
  { h: "14:00", l: "Salud necesita agua y electricidad", icon: "💧" },
  { h: "16:00", l: "Albergue sin capacidad, personas aisladas", icon: "⛺" },
];

const mention = (key: string) => {
  const s = SEGS.find((x) => x.block === 2 && x.text.includes(key));
  return s ? s.start : 0;
};

const Chronology: React.FC<{ t: number }> = ({ t }) => {
  let cur = -1;
  TIMELINE.forEach((e, i) => {
    if (t >= mention(e.h)) cur = i;
  });
  const e = TIMELINE[Math.max(0, cur)];
  const since = t - mention(e.h);
  const pop = interpolate(since, [0, 0.35], [0.85, 1], clamp);
  return (
    <AbsoluteFill style={{ background: "rgba(8,14,28,0.78)", fontFamily, color: "#fff", padding: 36 }}>
      <div style={{ fontWeight: 900, fontSize: 30, color: "#ffca28", letterSpacing: 2 }}>CRONOLOGÍA DE LA EMERGENCIA</div>
      <div style={{ display: "flex", alignItems: "center", gap: 30, marginTop: 40, scale: String(pop), opacity: cur < 0 ? 0.3 : 1 }}>
        <div style={{ fontSize: 130, fontFamily: '"Noto Color Emoji", sans-serif' }}>{e.icon}</div>
        <div>
          <div style={{ fontWeight: 900, fontSize: 92, color: "#ffca28", lineHeight: 1 }}>{e.h}</div>
          <div style={{ fontWeight: 800, fontSize: 38, lineHeight: 1.2, marginTop: 8, maxWidth: 560 }}>{e.l}</div>
        </div>
      </div>
      {/* progress line */}
      <div style={{ position: "absolute", left: 40, right: 40, bottom: 50, height: 6, background: "#3a4660", borderRadius: 3 }} />
      {TIMELINE.map((x, i) => (
        <div key={x.h} style={{ position: "absolute", bottom: 26, left: 40 + i * ((WALL.width - 80) / 8) - 30, width: 60, textAlign: "center" }}>
          <div style={{ width: 22, height: 22, borderRadius: 11, margin: "0 auto", background: i <= cur ? "#ffca28" : "#3a4660", border: i === cur ? "4px solid #fff" : "none", marginBottom: 6 }} />
          <div style={{ fontSize: 17, fontWeight: 800, color: i <= cur ? "#fff" : "#7d8aa5" }}>{x.h}</div>
        </div>
      ))}
    </AbsoluteFill>
  );
};

const DONE = [
  "Comunicar alerta a la población",
  "Evacuar un sector residencial",
  "Habilitar punto de encuentro",
  "Trasladar población vulnerable",
  "Desplegar bomberos en zona crítica",
  "Desplegar personal de salud",
  "Restablecer agua potable",
];
const LEFT_OUT = [
  "Habilitar un albergue",
  "Rescatar personas aisladas",
  "Proteger hospital o CESFAM",
  "Restablecer camino principal",
  "Restablecer electricidad",
  "Evacuación movilidad reducida",
  "Proteger infraestructura crítica",
  "Rescatar mascotas y animales",
];

const Summary: React.FC<{ t: number; start: number }> = ({ t, start }) => {
  const { fps } = useVideoConfig();
  const row = (i: number, base: number) => spring({ frame: (t - start - base - i * 0.35) * fps, fps, config: { damping: 14 } });
  return (
    <AbsoluteFill style={{ background: "rgba(8,14,28,0.86)", fontFamily, color: "#fff", padding: "26px 30px", flexDirection: "row", gap: 24 }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 900, fontSize: 26, color: "#66bb6a", marginBottom: 10 }}>✓ SE FINANCIÓ · 100/100 créditos</div>
        {DONE.map((x, i) => (
          <div key={x} style={{ fontSize: 23, fontWeight: 700, padding: "6px 10px", marginBottom: 6, borderRadius: 8, background: "rgba(102,187,106,0.18)", opacity: row(i, 1), translate: `${(1 - row(i, 1)) * -30}px 0px` }}>
            {x}
          </div>
        ))}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 900, fontSize: 26, color: "#ef5350", marginBottom: 10 }}>✕ QUEDÓ FUERA</div>
        {LEFT_OUT.map((x, i) => (
          <div key={x} style={{ fontSize: 23, fontWeight: 700, padding: "5px 10px", marginBottom: 5, borderRadius: 8, background: "rgba(239,83,80,0.18)", opacity: row(i, 9), translate: `${(1 - row(i, 9)) * 30}px 0px` }}>
            {x}
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

const WallContent: React.FC<{ t: number }> = ({ t }) => {
  const sec = sectionAt(t);
  if (sec.table === 2) return <Chronology t={t} />;
  if (sec.table === 6) {
    const s = SECTIONS.find((x) => x.table === 6)!;
    if (t > s.voice + 1) return <Summary t={t} start={s.voice} />;
  }
  return (
    <div style={{ position: "absolute", left: 24, bottom: 24, background: "#d32f2f", color: "#fff", fontFamily, fontWeight: 900, fontSize: 30, padding: "6px 18px", borderRadius: 8 }}>
      VOLCÁN CHAITÉN · EN DIRECTO
    </div>
  );
};

export const StudioScene: React.FC<{ mouth: number; amount: number }> = ({ mouth, amount }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const push = 1 + Math.sin(t * 0.05) * 0.015 + 0.02;
  const look = CAST.valentino;
  return (
    <AbsoluteFill style={{ background: "linear-gradient(180deg, #0b1630 0%, #13284f 60%, #0d1a36 100%)", scale: String(push) }}>
      {/* light strips */}
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <div key={i} style={{ position: "absolute", left: 60 + i * 150, top: 90, width: 8, height: 560, background: "linear-gradient(180deg, rgba(79,195,247,0), rgba(79,195,247,0.55), rgba(79,195,247,0))" }} />
      ))}
      <div style={{ position: "absolute", left: 0, right: 0, top: 690, height: 400, background: "linear-gradient(180deg, #0a1226, #060b18)" }} />
      {/* video wall */}
      <div style={{ position: "absolute", ...WALL, borderRadius: 18, overflow: "hidden", border: "10px solid #050a16", boxShadow: "0 0 60px rgba(79,195,247,0.25)" }}>
        <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, scale: String(WALL.width / 1920 * 1.12), transformOrigin: "0 0", translate: `${-WALL.width * 0.06}px ${-60}px` }}>
          <Background />
        </div>
        <WallContent t={t} />
      </div>
      <div style={{ position: "absolute", left: 60, top: 110, fontFamily, fontWeight: 900, fontSize: 30, color: "#4fc3f7", letterSpacing: 6 }}>ESTUDIO CENTRAL</div>
      {/* anchor */}
      <div style={{ position: "absolute", left: 470 - 190, top: 300, width: 380, height: (380 * 420) / 300, translate: `0px ${Math.sin(t * 1.4) * 3}px`, rotate: `${Math.sin(t * 2.1) * 1.5 * amount}deg`, transformOrigin: "50% 100%" }}>
        <Person look={look} mouth={mouth * amount} time={t} blinkOffset={0.4} lookX={0} />
      </div>
      {/* lapel mic */}
      <div style={{ position: "absolute", left: 492, top: 742, width: 12, height: 18, borderRadius: 4, background: "#222" }} />
      {/* desk */}
      <div style={{ position: "absolute", left: 80, width: 800, top: 810, height: 30, borderRadius: 14, background: "#cfd8e3" }} />
      <div style={{ position: "absolute", left: 110, width: 740, top: 836, height: 260, background: "linear-gradient(180deg, #b71c1c, #6d0f0f)", borderRadius: "0 0 40px 40px", display: "flex", justifyContent: "center", paddingTop: 22, fontFamily, fontWeight: 900, fontSize: 36, color: "#fff", letterSpacing: 4 }}>
        NOTICIERO EN VIVO
      </div>
    </AbsoluteFill>
  );
};
