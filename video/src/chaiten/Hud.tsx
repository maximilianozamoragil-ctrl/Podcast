import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { fontFamily } from "../podcast/fonts";
import { CAST, SpeakerId } from "./cast";
import { BLOCKS, SEGS } from "./timeline";
import { blockAt, CARD_SECONDS, segAt, lastSeg } from "./timing";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// ---------- top bar ----------
const TopBar: React.FC<{ t: number }> = ({ t }) => {
  const blink = Math.floor(t * 1.2) % 2 === 0 ? 1 : 0.35;
  // on-air clock starts at 16:40 and advances with the video
  const mins = 16 * 60 + 40 + Math.floor(t / 60);
  const hh = String(Math.floor(mins / 60)).padStart(2, "0");
  const mm = String(mins % 60).padStart(2, "0");
  return (
    <div style={{ position: "absolute", left: 40, top: 30, display: "flex", gap: 14, alignItems: "center", fontFamily, fontWeight: 900 }}>
      <div style={{ background: "#d32f2f", color: "#fff", fontSize: 30, padding: "6px 18px", borderRadius: 8, letterSpacing: 2 }}>
        <span style={{ opacity: blink }}>●</span> EN VIVO
      </div>
      <div style={{ background: "rgba(10,14,22,0.82)", color: "#fff", fontSize: 28, padding: "8px 18px", borderRadius: 8 }}>
        ERUPCIÓN VOLCÁN CHAITÉN · REGIÓN DE LOS LAGOS
      </div>
      <div style={{ background: "#ffca28", color: "#111", fontSize: 28, padding: "8px 16px", borderRadius: 8 }}>
        {hh}:{mm}
      </div>
    </div>
  );
};

// ---------- decisions panel ----------
type Item = { label: string; cr: number; ok: boolean; key: string };

const PANELS: Record<number, { title: string; items: Item[] }> = {
  2: {
    title: "Decisiones del Alcalde",
    items: [
      { label: "Comunicar alerta a la población", cr: 5, ok: true, key: "comunicar alerta" },
      { label: "Evacuar sector residencial", cr: 15, ok: true, key: "evacuar un sector" },
      { label: "Habilitar punto de encuentro", cr: 10, ok: true, key: "punto de encuentro" },
      { label: "Trasladar población vulnerable", cr: 15, ok: true, key: "trasladar población" },
      { label: "Evacuación movilidad reducida", cr: 10, ok: false, key: "movilidad reducida (10" },
      { label: "Rescatar mascotas", cr: 10, ok: false, key: "rescatar mascotas" },
    ],
  },
  3: {
    title: "Decisiones de Bomberos",
    items: [
      { label: "Desplegar bomberos en zona crítica", cr: 20, ok: true, key: "desplegar bomberos" },
      { label: "Rescatar personas aisladas", cr: 20, ok: false, key: "rescatar personas aisladas" },
      { label: "Rescatar mascotas", cr: 10, ok: false, key: "rescatar mascotas" },
    ],
  },
  4: {
    title: "Decisiones de Salud",
    items: [
      { label: "Restablecer agua potable", cr: 20, ok: true, key: "restablecer agua" },
      { label: "Desplegar personal de salud", cr: 15, ok: true, key: "personal de salud" },
      { label: "Proteger hospital o CESFAM", cr: 20, ok: false, key: "proteger el hospital" },
      { label: "Restablecer electricidad", cr: 15, ok: false, key: "restablecer la electricidad" },
    ],
  },
  5: {
    title: "Acciones NO financiadas",
    items: [
      { label: "Habilitar un albergue", cr: 15, ok: false, key: "habilitar un albergue" },
      { label: "Restablecer camino principal", cr: 15, ok: false, key: "camino principal" },
      { label: "Proteger infraestructura crítica", cr: 15, ok: false, key: "infraestructura crítica" },
    ],
  },
};

const OWNER: Record<number, SpeakerId> = { 2: "rashid", 3: "maximiliano", 4: "nicolas", 5: "rafael" };

const TIMELINE = [
  { h: "05:40", l: "Alerta sísmica SERNAGEOMIN" },
  { h: "07:10", l: "Emisión de ceniza" },
  { h: "08:00", l: "Evacuación preventiva" },
  { h: "09:20", l: "Caminos y agua afectados" },
  { h: "10:30", l: "Casos respiratorios" },
  { h: "11:40", l: "Mascotas en casas" },
  { h: "12:00", l: "Explosión mayor · lahares" },
  { h: "14:00", l: "Salud pide agua y luz" },
  { h: "16:00", l: "Albergue sin cupo" },
];

// first time (in seconds) a block segment mentions `key`
const firstMention = (block: number, key: string) => {
  const s = SEGS.find((x) => x.block === block && x.text.toLowerCase().includes(key.toLowerCase()));
  return s ? s.start : BLOCKS.find((b) => b.n === block)!.start + CARD_SECONDS + 1;
};

const PanelShell: React.FC<{ title: string; appear: number; children: React.ReactNode; color: string }> = ({ title, appear, children, color }) => (
  <div
    style={{
      position: "absolute",
      right: 36,
      top: 100,
      width: 520,
      background: "rgba(10,14,22,0.86)",
      borderRadius: 14,
      borderLeft: `8px solid ${color}`,
      padding: "16px 20px",
      fontFamily,
      color: "#fff",
      opacity: appear,
      translate: `${(1 - appear) * 60}px 0px`,
    }}
  >
    <div style={{ fontWeight: 900, fontSize: 26, marginBottom: 10, color }}>{title}</div>
    {children}
  </div>
);

const Panel: React.FC<{ t: number }> = ({ t }) => {
  const { fps } = useVideoConfig();
  const b = blockAt(t);
  const since = t - (b.start + CARD_SECONDS);
  if (since < 0) return null;
  const appear = spring({ frame: since * fps, fps, config: { damping: 16 } });
  const spk = lastSeg(t).spk;

  if (b.n === 1) {
    return (
      <PanelShell title="Cronología del día" appear={appear} color="#ffca28">
        {TIMELINE.map((e) => {
          const at = firstMention(1, e.h);
          const on = t >= at;
          const fresh = interpolate(t - at, [0, 0.3, 2.5, 3.5], [0, 1, 1, 0], clamp);
          return (
            <div key={e.h} style={{ display: "flex", gap: 12, fontSize: 22, padding: "3px 6px", borderRadius: 6, opacity: on ? 1 : 0.3, background: `rgba(255,202,40,${fresh * 0.28})` }}>
              <span style={{ fontWeight: 900, color: on ? "#ffca28" : "#bbb", width: 70 }}>{e.h}</span>
              <span style={{ fontWeight: 700 }}>{e.l}</span>
            </div>
          );
        })}
      </PanelShell>
    );
  }

  if (b.n === 6 || b.n === 5) {
    const budget = [
      { l: "Evacuar sector residencial", c: 15, col: "#ffca28" },
      { l: "Bomberos en zona crítica", c: 20, col: "#ff5a4e" },
      { l: "Agua potable", c: 20, col: "#29b6f6" },
      { l: "Personal de salud", c: 15, col: "#66bb6a" },
      { l: "Punto de encuentro", c: 10, col: "#ab47bc" },
      { l: "Alerta a la población", c: 5, col: "#ff9800" },
      { l: "Población vulnerable", c: 15, col: "#8d6e63" },
    ];
    const grow = interpolate(since, [0.5, 6], [0, 1], clamp);
    const used = Math.round(grow * 100);
    const extra = b.n === 5 ? PANELS[5] : null;
    return (
      <PanelShell title={`Presupuesto: ${used} / 100 créditos`} appear={appear} color="#ff9800">
        <div style={{ display: "flex", height: 34, borderRadius: 8, overflow: "hidden", background: "#333", marginBottom: 10 }}>
          {budget.map((x) => (
            <div key={x.l} style={{ width: `${x.c * grow}%`, background: x.col, borderRight: "2px solid #0a0e16" }} />
          ))}
        </div>
        {budget.map((x) => (
          <div key={x.l} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 19, fontWeight: 700, lineHeight: 1.35 }}>
            <span style={{ width: 14, height: 14, borderRadius: 3, background: x.col, display: "inline-block" }} />
            <span style={{ flex: 1 }}>{x.l}</span>
            <span style={{ fontWeight: 900 }}>{x.c}</span>
          </div>
        ))}
        {extra ? (
          <div style={{ marginTop: 10, borderTop: "2px solid #444", paddingTop: 8 }}>
            {extra.items.map((it) => {
              const on = t >= firstMention(5, it.key);
              return (
                <div key={it.label} style={{ display: "flex", gap: 10, fontSize: 19, fontWeight: 700, opacity: on ? 1 : 0.25, lineHeight: 1.35 }}>
                  <span style={{ color: "#ef5350", fontWeight: 900 }}>✕</span>
                  <span style={{ flex: 1, textDecoration: "line-through", textDecorationColor: "#ef5350" }}>{it.label}</span>
                  <span style={{ fontWeight: 900, color: "#ef9a9a" }}>{it.cr}</span>
                </div>
              );
            })}
          </div>
        ) : (
          <div style={{ marginTop: 10, fontWeight: 900, fontSize: 22, color: "#ffca28" }}>0 créditos restantes</div>
        )}
      </PanelShell>
    );
  }

  const p = PANELS[b.n];
  if (!p) return null;
  return (
    <PanelShell title={p.title} appear={appear} color={CAST[OWNER[b.n] ?? spk].color}>
      {p.items.map((it) => {
        const at = firstMention(b.n, it.key);
        const on = t >= at;
        const s = spring({ frame: (t - at) * fps, fps, config: { damping: 12 } });
        return (
          <div
            key={it.label}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              fontSize: 22,
              fontWeight: 700,
              padding: "5px 8px",
              marginBottom: 4,
              borderRadius: 8,
              background: it.ok ? "rgba(102,187,106,0.16)" : "rgba(239,83,80,0.16)",
              opacity: on ? 1 : 0.22,
              scale: on ? String(0.9 + Math.min(1, s) * 0.1) : "0.95",
            }}
          >
            <span style={{ fontWeight: 900, fontSize: 24, color: it.ok ? "#66bb6a" : "#ef5350", width: 22 }}>{it.ok ? "✓" : "✕"}</span>
            <span style={{ flex: 1 }}>{it.label}</span>
            <span style={{ fontWeight: 900, color: it.ok ? "#a5d6a7" : "#ef9a9a" }}>{it.cr} cr</span>
          </div>
        );
      })}
    </PanelShell>
  );
};

// ---------- lower third + captions ----------
const LowerThird: React.FC<{ t: number }> = ({ t }) => {
  const { fps } = useVideoConfig();
  const seg = lastSeg(t);
  // find when the current turn began
  const i = SEGS.indexOf(seg);
  let j = i;
  while (j > 0 && SEGS[j - 1].spk === seg.spk && SEGS[j - 1].block === seg.block) j--;
  const since = t - SEGS[j].start;
  if (since < -0.2) return null;
  const s = spring({ frame: since * fps, fps, config: { damping: 15 } });
  const look = CAST[seg.spk];
  return (
    <div style={{ position: "absolute", left: 40, top: 812, display: "flex", fontFamily, translate: `${(1 - s) * -500}px 0px` }}>
      <div style={{ background: look.color, color: "#111", fontWeight: 900, fontSize: 32, padding: "6px 20px", borderRadius: "10px 0 0 10px" }}>{look.name}</div>
      <div style={{ background: "rgba(10,14,22,0.9)", color: "#fff", fontWeight: 700, fontSize: 26, padding: "10px 20px", borderRadius: "0 10px 10px 0" }}>{look.role}</div>
    </div>
  );
};

const Captions: React.FC<{ t: number }> = ({ t }) => {
  const seg = segAt(t) ?? (() => {
    const s = lastSeg(t);
    return t - s.end < 0.7 && t >= s.start ? s : undefined;
  })();
  if (!seg) return null;
  const look = CAST[seg.spk];
  const appear = interpolate(t - seg.start, [0, 0.2], [0, 1], clamp);
  return (
    <div style={{ position: "absolute", left: 40, right: 40, top: 878, display: "flex", justifyContent: "center", opacity: appear }}>
      <div
        style={{
          maxWidth: 1760,
          background: "rgba(8,10,16,0.82)",
          borderRadius: 12,
          borderBottom: `5px solid ${look.color}`,
          padding: "10px 26px",
          fontFamily,
          fontWeight: 800,
          fontSize: 34,
          lineHeight: 1.25,
          color: "#fff",
          textAlign: "center",
        }}
      >
        {seg.text}
      </div>
    </div>
  );
};

// ---------- news ticker ----------
const TICKER =
  "ÚLTIMO MINUTO  ·  05:40 SERNAGEOMIN informa aumento abrupto de sismicidad  ·  07:10 Emisión importante de ceniza sobre sectores habitados  ·  08:00 Evacuación preventiva de sectores expuestos  ·  09:20 Ceniza afecta caminos y sistemas de agua  ·  10:30 Personas con problemas respiratorios en el centro de salud  ·  12:00 Explosión mayor: alerta de lahares en cauces y quebradas  ·  14:00 Salud requiere agua y luz para seguir operando  ·  16:00 Albergue sin cupo, ruta crítica sin despejar  ·  Manténgase alejado de cauces y quebradas  ·  Siga las instrucciones de las autoridades  ·  ";

const Ticker: React.FC<{ t: number }> = ({ t }) => {
  const W = 5200;
  const x = -((t * 110) % W);
  return (
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 54, background: "#0d1320", borderTop: "4px solid #d32f2f", overflow: "hidden", fontFamily }}>
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 230, background: "#d32f2f", zIndex: 2, color: "#fff", fontWeight: 900, fontSize: 26, display: "flex", alignItems: "center", justifyContent: "center" }}>
        CHAITÉN HOY
      </div>
      <div style={{ position: "absolute", left: 240 + x, top: 8, whiteSpace: "nowrap", color: "#fff", fontWeight: 700, fontSize: 28 }}>
        {TICKER}
        {TICKER}
        {TICKER}
      </div>
    </div>
  );
};

// ---------- block title card ----------
const BlockCard: React.FC<{ t: number }> = ({ t }) => {
  const b = BLOCKS.find((x) => t >= x.start && t < x.start + CARD_SECONDS);
  if (!b) return null;
  const k = t - b.start;
  const inn = interpolate(k, [0, 0.4], [0, 1], clamp);
  const out = interpolate(k, [CARD_SECONDS - 0.4, CARD_SECONDS], [1, 0], clamp);
  const o = Math.min(inn, out);
  const [head, ...rest] = b.title.split(" — ");
  return (
    <AbsoluteFill style={{ background: `rgba(8,10,16,${0.55 * o})`, alignItems: "center", justifyContent: "center" }}>
      <div style={{ fontFamily, textAlign: "center", opacity: o, scale: String(0.92 + 0.08 * inn) }}>
        <div style={{ display: "inline-block", background: "#d32f2f", color: "#fff", fontWeight: 900, fontSize: 34, padding: "4px 22px", borderRadius: 8, letterSpacing: 4 }}>
          BLOQUE {b.n}
        </div>
        <div style={{ color: "#fff", fontWeight: 900, fontSize: 78, marginTop: 18, textShadow: "0 6px 20px rgba(0,0,0,0.6)" }}>{head}</div>
        {rest.length ? <div style={{ color: "#ffca28", fontWeight: 800, fontSize: 44, marginTop: 6 }}>{rest.join(" — ")}</div> : null}
      </div>
    </AbsoluteFill>
  );
};

export const Hud: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  return (
    <AbsoluteFill>
      <TopBar t={t} />
      <Panel t={t} />
      <LowerThird t={t} />
      <Captions t={t} />
      <Ticker t={t} />
      <BlockCard t={t} />
    </AbsoluteFill>
  );
};
