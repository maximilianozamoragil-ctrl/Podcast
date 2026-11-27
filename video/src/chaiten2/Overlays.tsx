import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { fontFamily } from "../podcast/fonts";
import { Background } from "../chaiten/Background";
import { CAST, ORDER } from "../chaiten/cast";
import { CUES, SECTIONS, SEGS } from "./timeline";
import { clamp, lastSeg, OWNER, sceneAt, sectionAt, segAt, STING_CUT } from "./timing";

// ---------------- Intro (cortina 5 s) ----------------
export const Intro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const bar = spring({ frame: frame - 25, fps, config: { damping: 14 } });
  const title = spring({ frame: frame - 34, fps, config: { damping: 12 } });
  const sub = spring({ frame: frame - 55, fps, config: { damping: 14 } });
  const flash = interpolate(t, [0.95, 1.05, 1.5], [0, 0.8, 0], clamp);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ scale: String(1.25 - t * 0.04) }}>
        <Background />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.1), rgba(0,0,0,0.65))" }} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", fontFamily, textAlign: "center" }}>
        <div style={{ background: "#d32f2f", color: "#fff", fontWeight: 900, fontSize: 46, letterSpacing: 10, padding: "8px 40px", borderRadius: 8, scale: String(bar), opacity: bar }}>ÚLTIMO MINUTO</div>
        <div style={{ color: "#fff", fontWeight: 900, fontSize: 120, lineHeight: 1, marginTop: 26, textShadow: "0 8px 30px rgba(0,0,0,0.7)", opacity: title, translate: `0px ${(1 - title) * 60}px` }}>
          ERUPCIÓN DEL
          <br />
          VOLCÁN CHAITÉN
        </div>
        <div style={{ color: "#ffca28", fontWeight: 800, fontSize: 44, marginTop: 24, opacity: sub }}>Cobertura especial en vivo · Región de Los Lagos</div>
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "#fff", opacity: flash }} />
    </AbsoluteFill>
  );
};

// ---------------- Stinger (3 s) ----------------
export const Stinger: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const cue = CUES.find((c) => c.kind === "stinger" && t >= c.start && t < c.start + c.dur);
  if (!cue) return null;
  const k = t - cue.start;
  const label = cue.to === "field" ? "DESPACHO EN TERRENO" : "ESTUDIO CENTRAL";
  const sub = cue.to === "field" ? "Entrevistas al comité de emergencia" : "Síntesis y cierre";
  const colors = ["#d32f2f", "#0d47a1", "#ffca28", "#d32f2f"];
  const textO = interpolate(k, [0.9, 1.15, 2.2, 2.5], [0, 1, 1, 0], clamp);
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      {colors.map((c, i) => {
        // bars sweep in (cover by ~1.1 s) and out (by ~2.8 s)
        const inn = interpolate(k, [0.45 + i * 0.12, 0.95 + i * 0.05], [-1, 0], { ...clamp, easing: (x) => 1 - (1 - x) ** 3 });
        const out = interpolate(k, [2.1 + i * 0.08, 2.75], [0, 1], { ...clamp, easing: (x) => x * x });
        const x = (inn + out) * 2600;
        return <div key={i} style={{ position: "absolute", left: -400, top: -300 + i * 420, width: 2800, height: 440, background: c, rotate: "-12deg", translate: `${x}px 0px` }} />;
      })}
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", fontFamily, opacity: textO }}>
        <div style={{ color: "#fff", fontWeight: 900, fontSize: 100, letterSpacing: 4, textShadow: "0 6px 0 rgba(0,0,0,0.35)" }}>{label}</div>
        <div style={{ color: "#fff", fontWeight: 800, fontSize: 40, marginTop: 10 }}>{sub}</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ---------------- Outro ----------------
export const Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const cue = CUES.find((c) => c.kind === "outro")!;
  const k = t - cue.start;
  if (k < 0) return null;
  const o = interpolate(k, [0, 0.6], [0, 1], clamp);
  return (
    <AbsoluteFill style={{ background: `rgba(6,10,22,${0.85 * o})`, alignItems: "center", justifyContent: "center", fontFamily, color: "#fff", opacity: o }}>
      <div style={{ fontWeight: 900, fontSize: 70 }}>Gracias por acompañarnos</div>
      <div style={{ fontWeight: 800, fontSize: 34, color: "#ffca28", marginTop: 8 }}>Cobertura especial · Erupción del volcán Chaitén</div>
      <div style={{ display: "flex", gap: 26, marginTop: 50 }}>
        {ORDER.map((id, i) => {
          const s = spring({ frame: (k - 0.5 - i * 0.2) * fps, fps, config: { damping: 14 } });
          return (
            <div key={id} style={{ width: 300, textAlign: "center", opacity: s, translate: `0px ${(1 - s) * 40}px` }}>
              <div style={{ fontWeight: 900, fontSize: 32, color: CAST[id].color }}>{CAST[id].name}</div>
              <div style={{ fontWeight: 700, fontSize: 21, marginTop: 4 }}>{CAST[id].role}</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ---------------- HUD ----------------
const TopBar: React.FC<{ t: number }> = ({ t }) => {
  const blink = Math.floor(t * 1.2) % 2 === 0 ? 1 : 0.35;
  const mins = 16 * 60 + Math.floor(t / 60);
  const clock = `${String(Math.floor(mins / 60)).padStart(2, "0")}:${String(mins % 60).padStart(2, "0")}`;
  return (
    <div style={{ position: "absolute", left: 40, top: 30, display: "flex", gap: 14, alignItems: "center", fontFamily, fontWeight: 900 }}>
      <div style={{ background: "#d32f2f", color: "#fff", fontSize: 30, padding: "6px 18px", borderRadius: 8, letterSpacing: 2 }}>
        <span style={{ opacity: blink }}>●</span> EN VIVO
      </div>
      <div style={{ background: "rgba(10,14,22,0.82)", color: "#fff", fontSize: 28, padding: "8px 18px", borderRadius: 8 }}>ERUPCIÓN VOLCÁN CHAITÉN · REGIÓN DE LOS LAGOS</div>
      <div style={{ background: "#ffca28", color: "#111", fontSize: 28, padding: "8px 16px", borderRadius: 8 }}>{clock}</div>
    </div>
  );
};

type Item = { label: string; ok: boolean; key: string; cr: number };
const PANELS: Record<number, { title: string; items: Item[] }> = {
  4: {
    title: "Decisiones del Alcalde",
    items: [
      { label: "Comunicar alerta a la población", ok: true, key: "comunicar alerta", cr: 5 },
      { label: "Evacuar sector residencial", ok: true, key: "evacuar un sector", cr: 15 },
      { label: "Habilitar punto de encuentro", ok: true, key: "punto de encuentro", cr: 10 },
      { label: "Trasladar población vulnerable", ok: true, key: "trasladar población", cr: 15 },
      { label: "Evacuación movilidad reducida", ok: false, key: "apoyar la evacuación", cr: 10 },
      { label: "Rescatar mascotas", ok: false, key: "rescatar mascotas", cr: 10 },
    ],
  },
  5: {
    title: "Decisiones de Bomberos",
    items: [
      { label: "Desplegar bomberos en zona crítica", ok: true, key: "desplegar bomberos", cr: 20 },
      { label: "Rescatar personas aisladas", ok: false, key: "rescatar personas aisladas", cr: 20 },
      { label: "Rescatar mascotas", ok: false, key: "rescatar mascotas", cr: 10 },
    ],
  },
  6: {
    title: "Decisiones de Salud",
    items: [
      { label: "Restablecer agua potable", ok: true, key: "restablecer agua", cr: 20 },
      { label: "Desplegar personal de salud", ok: true, key: "personal de salud", cr: 15 },
      { label: "Proteger hospital o CESFAM", ok: false, key: "proteger el hospital", cr: 20 },
      { label: "Restablecer electricidad", ok: false, key: "restablecer la electricidad", cr: 15 },
    ],
  },
};

const firstMention = (block: number, key: string) => {
  const s = SEGS.find((x) => x.block === block && x.text.toLowerCase().includes(key.toLowerCase()));
  return s ? s.start : SECTIONS.find((b) => b.id === block)!.voice + 1;
};

const BUDGET = [
  { l: "Evacuar sector residencial", c: 15, col: "#ffca28" },
  { l: "Bomberos en zona crítica", c: 20, col: "#ff5a4e" },
  { l: "Agua potable", c: 20, col: "#29b6f6" },
  { l: "Personal de salud", c: 15, col: "#66bb6a" },
  { l: "Punto de encuentro", c: 10, col: "#ab47bc" },
  { l: "Alerta a la población", c: 5, col: "#ff9800" },
  { l: "Población vulnerable", c: 15, col: "#8d6e63" },
];

const Panel: React.FC<{ t: number }> = ({ t }) => {
  const { fps } = useVideoConfig();
  const sec = sectionAt(t);
  if (sceneAt(t) !== "field" || !OWNER[sec.id]) return null;
  const since = t - sec.start;
  const appear = spring({ frame: since * fps, fps, config: { damping: 16 } });
  const color = CAST[OWNER[sec.id]].color;
  const shell: React.CSSProperties = { position: "absolute", right: 36, top: 100, width: 520, background: "rgba(10,14,22,0.88)", borderRadius: 14, borderLeft: `8px solid ${color}`, padding: "16px 20px", fontFamily, color: "#fff", opacity: appear, translate: `${(1 - appear) * 60}px 0px` };
  if (sec.id === 7) {
    const grow = interpolate(t - firstMention(7, "se distribuyeron"), [0, 6], [0, 1], clamp);
    const out = [
      { label: "Habilitar un albergue", key: "habilitar un albergue" },
      { label: "Restablecer camino principal", key: "camino principal" },
      { label: "Proteger infraestructura crítica", key: "infraestructura crítica" },
    ];
    return (
      <div style={shell}>
        <div style={{ fontWeight: 900, fontSize: 26, marginBottom: 10, color }}>Presupuesto: {Math.round(grow * 100)} / 100 créditos</div>
        <div style={{ display: "flex", height: 34, borderRadius: 8, overflow: "hidden", background: "#333", marginBottom: 4 }}>
          {BUDGET.map((x) => (
            <div key={x.l} style={{ width: `${x.c * grow}%`, background: x.col, borderRight: "2px solid #0a0e16", color: "#111", fontWeight: 900, fontSize: 17, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
              {grow > 0.9 ? x.c : ""}
            </div>
          ))}
        </div>
        <div style={{ marginTop: 8, borderTop: "2px solid #444", paddingTop: 6 }}>
          {out.map((it) => (
            <div key={it.label} style={{ display: "flex", gap: 10, fontSize: 19, fontWeight: 700, lineHeight: 1.35, opacity: t >= firstMention(7, it.key) ? 1 : 0.25 }}>
              <span style={{ color: "#ef5350", fontWeight: 900 }}>✕</span>
              <span style={{ flex: 1 }}>{it.label}</span>
              <span style={{ color: "#ef9a9a", fontWeight: 900 }}>15</span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  const p = PANELS[sec.id];
  return (
    <div style={shell}>
      <div style={{ fontWeight: 900, fontSize: 26, marginBottom: 10, color }}>{p.title}</div>
      {p.items.map((it) => {
        const at = firstMention(sec.id, it.key);
        const on = t >= at;
        const s = spring({ frame: (t - at) * fps, fps, config: { damping: 12 } });
        return (
          <div key={it.label} style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 22, fontWeight: 700, padding: "5px 8px", marginBottom: 4, borderRadius: 8, background: it.ok ? "rgba(102,187,106,0.16)" : "rgba(239,83,80,0.16)", opacity: on ? 1 : 0.22, scale: on ? String(0.9 + Math.min(1, s) * 0.1) : "0.95" }}>
            <span style={{ fontWeight: 900, fontSize: 24, color: it.ok ? "#66bb6a" : "#ef5350", width: 22 }}>{it.ok ? "✓" : "✕"}</span>
            <span style={{ flex: 1 }}>{it.label}</span>
            <span style={{ fontWeight: 900, color: it.ok ? "#a5d6a7" : "#ef9a9a" }}>{it.cr} cr</span>
          </div>
        );
      })}
    </div>
  );
};

const LowerThird: React.FC<{ t: number }> = ({ t }) => {
  const { fps } = useVideoConfig();
  const seg = lastSeg(t);
  if (t < seg.start - 0.2) return null;
  const i = SEGS.indexOf(seg);
  let j = i;
  while (j > 0 && SEGS[j - 1].spk === seg.spk && SEGS[j - 1].block === seg.block) j--;
  const s = spring({ frame: (t - SEGS[j].start) * fps, fps, config: { damping: 15 } });
  const look = CAST[seg.spk];
  const role = seg.spk === "valentino" && sceneAt(t) === "field" ? "Periodista · desde el estudio central" : look.role;
  return (
    <div style={{ position: "absolute", left: 40, top: 812, display: "flex", fontFamily, translate: `${(1 - s) * -500}px 0px` }}>
      <div style={{ background: look.color, color: "#111", fontWeight: 900, fontSize: 32, padding: "6px 20px", borderRadius: "10px 0 0 10px" }}>{look.name}</div>
      <div style={{ background: "rgba(10,14,22,0.9)", color: "#fff", fontWeight: 700, fontSize: 26, padding: "10px 20px", borderRadius: "0 10px 10px 0" }}>{role}</div>
    </div>
  );
};

const Captions: React.FC<{ t: number }> = ({ t }) => {
  const s0 = segAt(t);
  const s1 = lastSeg(t);
  const seg = s0 ?? (t - s1.end < 0.6 && t >= s1.start ? s1 : undefined);
  if (!seg) return null;
  const appear = interpolate(t - seg.start, [0, 0.2], [0, 1], clamp);
  return (
    <div style={{ position: "absolute", left: 40, right: 40, top: 878, display: "flex", justifyContent: "center", opacity: appear }}>
      <div style={{ maxWidth: 1760, background: "rgba(8,10,16,0.82)", borderRadius: 12, borderBottom: `5px solid ${CAST[seg.spk].color}`, padding: "10px 26px", fontFamily, fontWeight: 800, fontSize: 34, lineHeight: 1.25, color: "#fff", textAlign: "center" }}>
        {seg.text}
      </div>
    </div>
  );
};

const TICKER =
  "ÚLTIMO MINUTO  ·  05:40 SERNAGEOMIN informa aumento abrupto de sismicidad  ·  07:10 Emisión importante de ceniza  ·  08:00 Evacuación preventiva  ·  09:20 Ceniza afecta caminos y sistemas de agua  ·  10:30 Casos respiratorios en el centro de salud  ·  12:00 Explosión mayor: alerta de lahares  ·  14:00 Salud requiere agua y luz  ·  16:00 Albergue sin cupo, ruta crítica sin despejar  ·  Respete las alertas y no reingrese a zonas evacuadas  ·  ";

const Ticker: React.FC<{ t: number }> = ({ t }) => (
  <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 54, background: "#0d1320", borderTop: "4px solid #d32f2f", overflow: "hidden", fontFamily }}>
    <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 230, background: "#d32f2f", zIndex: 2, color: "#fff", fontWeight: 900, fontSize: 26, display: "flex", alignItems: "center", justifyContent: "center" }}>CHAITÉN HOY</div>
    <div style={{ position: "absolute", left: 240 - ((t * 110) % 4600), top: 8, whiteSpace: "nowrap", color: "#fff", fontWeight: 700, fontSize: 28 }}>
      {TICKER}
      {TICKER}
      {TICKER}
    </div>
  </div>
);

// small section tag for the interview round ("Entrevista 2 de 4")
const SectionTag: React.FC<{ t: number }> = ({ t }) => {
  const sec = sectionAt(t);
  if (!OWNER[sec.id] || sceneAt(t) !== "field") return null;
  const n = sec.id - 3;
  const o = interpolate(t - sec.start, [0, 0.4, 4, 4.6], [0, 1, 1, 0], clamp);
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 480, display: "flex", justifyContent: "center", opacity: o, fontFamily }}>
      <div style={{ background: "rgba(10,14,22,0.88)", color: "#fff", fontWeight: 900, fontSize: 34, padding: "10px 26px", borderRadius: 12, borderBottom: `5px solid ${CAST[OWNER[sec.id]].color}` }}>
        ENTREVISTA {n} DE 4 · {CAST[OWNER[sec.id]].name.toUpperCase()}
      </div>
    </div>
  );
};

export const Hud: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  if (sceneAt(t) === "intro") return null;
  const cue = CUES.find((c) => c.kind === "stinger" && t >= c.start + 0.5 && t < c.start + STING_CUT + 1.2);
  const outro = CUES.find((c) => c.kind === "outro")!;
  if (t > outro.start + 0.3) return null;
  return (
    <AbsoluteFill style={{ opacity: cue ? 0 : 1 }}>
      <TopBar t={t} />
      <Panel t={t} />
      <SectionTag t={t} />
      <LowerThird t={t} />
      <Captions t={t} />
      <Ticker t={t} />
    </AbsoluteFill>
  );
};
