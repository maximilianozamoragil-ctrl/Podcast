import React from "react";
import type { Look } from "./cast";

// Character drawn in a 300 x 420 box. Head ~ y 64-256, shoulders from y 292.
const TORSO = "M30 420 C30 330 76 290 150 290 C224 290 270 330 270 420 Z";

const Neck: React.FC<{ look: Look }> = ({ look }) => (
  <rect x={128} y={236} width={44} height={66} rx={18} fill={look.skinShade} />
);

const OutfitArt: React.FC<{ look: Look }> = ({ look }) => {
  switch (look.outfit) {
    case "white-shirt":
      return (
        <g>
          <path d={TORSO} fill="#f5f7fa" />
          <path d="M70 320 C78 350 80 385 78 420 M230 320 C222 350 220 385 222 420" stroke="#d3d9e1" strokeWidth={4} fill="none" />
          <Neck look={look} />
          {/* open collar showing the neck */}
          <path d="M126 292 L150 336 L174 292 Z" fill={look.skinShade} />
          {/* collar points */}
          <path d="M120 286 L150 336 L112 326 L104 300 Z" fill="#ffffff" stroke="#cfd6df" strokeWidth={3} strokeLinejoin="round" />
          <path d="M180 286 L150 336 L188 326 L196 300 Z" fill="#ffffff" stroke="#cfd6df" strokeWidth={3} strokeLinejoin="round" />
          {/* placket + buttons */}
          <path d="M150 336 L150 420" stroke="#d3d9e1" strokeWidth={4} />
          <circle cx={156} cy={360} r={3.5} fill="#c4ccd6" />
          <circle cx={156} cy={392} r={3.5} fill="#c4ccd6" />
          {/* chest pocket */}
          <path d="M184 352 L222 352 L222 384 Q203 392 184 384 Z" fill="none" stroke="#d3d9e1" strokeWidth={3} />
        </g>
      );
    case "suit":
      return (
        <g>
          <path d={TORSO} fill="#16161a" />
          <Neck look={look} />
          {/* shirt + tie */}
          <path d="M118 290 L150 420 L182 290 Z" fill="#f2f2f5" />
          <path d="M138 300 L162 300 L156 318 L166 410 L150 422 L134 410 L144 318 Z" fill="#26262e" />
          <path d="M138 300 L162 300 L156 318 L144 318 Z" fill="#33333d" />
          {/* shirt collar */}
          <path d="M120 284 L148 312 L130 318 L114 296 Z" fill="#ffffff" />
          <path d="M180 284 L152 312 L170 318 L186 296 Z" fill="#ffffff" />
          {/* lapels */}
          <path d="M112 292 L150 420 L118 420 L96 352 L120 340 L98 318 Z" fill="#202027" stroke="#2f2f38" strokeWidth={3} strokeLinejoin="round" />
          <path d="M188 292 L150 420 L182 420 L204 352 L180 340 L202 318 Z" fill="#202027" stroke="#2f2f38" strokeWidth={3} strokeLinejoin="round" />
          {/* pocket square */}
          <path d="M204 372 L234 372 L230 380 L208 380 Z" fill="#f2f2f5" />
          <path d="M208 372 L214 362 L220 372 L226 364 L230 372 Z" fill="#ffffff" />
        </g>
      );
    case "firefighter":
      return (
        <g>
          <path d={TORSO} fill="#2a2c33" />
          {/* standing collar */}
          <Neck look={look} />
          <path d="M106 272 C108 300 120 318 140 322 L140 296 C128 292 118 284 114 270 Z" fill="#1f2026" />
          <path d="M194 272 C192 300 180 318 160 322 L160 296 C172 292 182 284 186 270 Z" fill="#1f2026" />
          {/* front closure */}
          <rect x={142} y={300} width={16} height={120} fill="#1f2026" />
          {[326, 356, 386].map((y) => (
            <rect key={y} x={140} y={y} width={20} height={8} rx={2} fill="#9aa0a8" />
          ))}
          {/* reflective bands */}
          <path d="M34 372 L266 372 L268 396 L32 396 Z" fill="#f2c230" />
          <path d="M33 380 L267 380 L267 388 L33 388 Z" fill="#e6eaef" />
          <path d="M52 330 L84 330 L84 420 L52 420 Z" fill="#f2c230" opacity={0} />
          {/* collar band */}
          <path d="M108 284 C112 298 122 308 138 312 L138 304 C124 300 116 292 112 280 Z" fill="#f2c230" />
          <path d="M192 284 C188 298 178 308 162 312 L162 304 C176 300 184 292 188 280 Z" fill="#f2c230" />
          {/* chest patch */}
          <rect x={184} y={326} width={56} height={30} rx={5} fill="#b8202a" />
          <text x={212} y={346} textAnchor="middle" fontFamily="Nunito" fontWeight={900} fontSize={11} fill="#fff">
            BOMBEROS
          </text>
          {/* radio clip */}
          <rect x={72} y={318} width={22} height={40} rx={5} fill="#111" />
          <rect x={78} y={306} width={4} height={14} fill="#111" />
        </g>
      );
    case "doctor":
      return (
        <g>
          {/* scrubs */}
          <path d={TORSO} fill="#7fb8d8" />
          <Neck look={look} />
          <path d="M122 292 L150 336 L178 292 Z" fill={look.skinShade} />
          <path d="M122 292 L150 336 L178 292" stroke="#5e9ac0" strokeWidth={5} fill="none" />
          {/* white coat */}
          <path d="M30 420 C30 330 76 290 120 288 L104 312 L132 420 Z" fill="#fbfcfd" />
          <path d="M270 420 C270 330 224 290 180 288 L196 312 L168 420 Z" fill="#fbfcfd" />
          <path d="M120 288 L96 330 L116 344 L104 312 Z" fill="#e8edf2" />
          <path d="M180 288 L204 330 L184 344 L196 312 Z" fill="#e8edf2" />
          <path d="M132 420 L104 312 M168 420 L196 312" stroke="#d7dee6" strokeWidth={3} />
          {/* stethoscope */}
          <path d="M112 300 C96 350 110 380 130 382" stroke="#3a3f47" strokeWidth={7} fill="none" strokeLinecap="round" />
          <path d="M188 300 C204 350 196 368 180 376" stroke="#3a3f47" strokeWidth={7} fill="none" strokeLinecap="round" />
          <circle cx={178} cy={382} r={12} fill="#c9ced6" stroke="#3a3f47" strokeWidth={4} />
          {/* badge + pen */}
          <rect x={200} y={346} width={42} height={26} rx={4} fill="#ffffff" stroke="#9fb0c0" strokeWidth={2} />
          <rect x={206} y={352} width={14} height={14} rx={2} fill="#66bb6a" />
          <path d="M224 356 L238 356 M224 362 L234 362" stroke="#9fb0c0" strokeWidth={2} />
          <rect x={64} y={340} width={5} height={30} rx={2} fill="#2c6cd6" />
        </g>
      );
    case "carabinero":
      return (
        <g>
          {/* olive-green Carabineros uniform jacket */}
          <path d={TORSO} fill="#4a5d3a" />
          <Neck look={look} />
          {/* light green shirt + dark tie */}
          <path d="M120 290 L150 360 L180 290 Z" fill="#c9d3b0" />
          <path d="M143 300 L157 300 L154 314 L160 356 L150 366 L140 356 L146 314 Z" fill="#2c3a24" />
          {/* lapels */}
          <path d="M114 290 L150 362 L130 380 L100 330 L118 318 L102 304 Z" fill="#3e5030" stroke="#33442a" strokeWidth={3} strokeLinejoin="round" />
          <path d="M186 290 L150 362 L170 380 L200 330 L182 318 L198 304 Z" fill="#3e5030" stroke="#33442a" strokeWidth={3} strokeLinejoin="round" />
          {/* shoulder boards with rank stars */}
          <path d="M44 318 L96 300 L100 314 L50 334 Z" fill="#2c3a24" />
          <path d="M256 318 L204 300 L200 314 L250 334 Z" fill="#2c3a24" />
          {[[62, 318], [80, 311], [238, 318], [220, 311]].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r={4} fill="#e8c24a" />
          ))}
          {/* buttons */}
          <circle cx={150} cy={392} r={5} fill="#e8c24a" />
          <circle cx={150} cy={412} r={5} fill="#e8c24a" />
          {/* chest badge (green & gold shield) */}
          <path d="M198 344 L228 344 L228 366 Q213 380 198 366 Z" fill="#e8c24a" stroke="#9c7d1f" strokeWidth={2} />
          <path d="M204 350 L222 350 L222 364 Q213 372 204 364 Z" fill="#2e6b32" />
          {/* name plate */}
          <rect x={74} y={350} width={46} height={12} rx={2} fill="#e8eadf" />
          {/* hi-vis Emergencias armband */}
          <path d="M34 384 L72 378 L74 400 L32 406 Z" fill="#ff7a1a" />
          <path d="M33 392 L73 386 L74 391 L33 397 Z" fill="#e6eaef" />
          {/* radio */}
          <rect x={236} y={352} width={18} height={36} rx={4} fill="#161616" />
          <rect x={246} y={338} width={3} height={16} fill="#161616" />
        </g>
      );
    case "vest":
    default:
      return (
        <g>
          {/* navy polo */}
          <path d={TORSO} fill="#22324a" />
          <Neck look={look} />
          <path d="M118 288 L150 318 L136 330 L110 300 Z" fill="#2c4060" />
          <path d="M182 288 L150 318 L164 330 L190 300 Z" fill="#2c4060" />
          <path d="M150 318 L150 360" stroke="#1a273a" strokeWidth={4} />
          {/* hi-vis vest */}
          <path d="M30 420 C30 330 70 296 108 292 L126 330 L126 420 Z" fill="#ff7a1a" />
          <path d="M270 420 C270 330 230 296 192 292 L174 330 L174 420 Z" fill="#ff7a1a" />
          <path d="M88 300 L100 420" stroke="#e6eaef" strokeWidth={12} />
          <path d="M212 300 L200 420" stroke="#e6eaef" strokeWidth={12} />
          <path d="M34 380 L126 380 M174 380 L266 380" stroke="#e6eaef" strokeWidth={12} />
          <path d="M88 300 L100 420 M212 300 L200 420" stroke="#c7ccd3" strokeWidth={2} />
          {/* walkie talkie */}
          <rect x={212} y={318} width={22} height={44} rx={5} fill="#161616" />
          <rect x={226} y={300} width={4} height={20} fill="#161616" />
          <rect x={216} y={326} width={14} height={8} rx={2} fill="#7de37d" />
        </g>
      );
  }
};

const Hair: React.FC<{ look: Look; layer: "back" | "front" }> = ({ look, layer }) => {
  const c = look.hairColor;
  const s = look.hairShade;
  if (look.hair === "fringe") {
    if (layer === "back")
      return <path d="M60 160 C56 74 102 42 150 42 C198 42 244 74 240 160 L234 190 L66 190 Z" fill={s} />;
    return (
      <g>
        <path d="M62 140 C60 72 102 46 150 46 C198 46 240 72 238 140 C230 118 214 106 196 102 L104 102 C86 106 70 118 62 140 Z" fill={c} />
        {/* combed-forward fringe */}
        <path d="M70 132 C74 90 110 74 152 76 C194 78 226 94 230 130 L218 122 L208 138 L194 116 L180 134 L168 112 L154 132 L142 110 L128 130 L116 110 L102 132 L90 114 Z" fill={c} />
        <path d="M118 84 L112 108 M146 82 L140 108 M176 86 L166 112 M204 96 L194 116" stroke={s} strokeWidth={3} strokeLinecap="round" opacity={0.6} />
        <path d="M63 140 L65 182 L76 182 L78 136 Z" fill={c} />
        <path d="M237 140 L235 182 L224 182 L222 136 Z" fill={c} />
      </g>
    );
  }
  if (look.hair === "side") {
    if (layer === "back")
      return <path d="M62 160 C56 76 102 44 152 44 C204 44 246 76 240 160 L234 196 L68 196 Z" fill={s} />;
    return (
      <g>
        <path d="M62 150 C58 74 104 44 154 44 C206 44 244 78 240 150 C232 124 220 112 208 106 C176 118 132 122 92 112 C78 120 68 134 62 150 Z" fill={c} />
        <path d="M80 132 C96 94 150 78 214 100 C196 108 170 116 150 120 C130 124 108 128 80 132 Z" fill={c} />
        <path d="M110 112 C140 100 170 96 200 100" stroke={s} strokeWidth={3} fill="none" opacity={0.6} strokeLinecap="round" />
        <path d="M118 66 C150 56 180 60 210 76" stroke="#ffffff" strokeWidth={6} fill="none" opacity={0.22} strokeLinecap="round" />
        <path d="M64 150 L66 186 L76 186 L76 140 Z" fill={c} />
        <path d="M238 150 L236 186 L226 186 L226 140 Z" fill={c} />
      </g>
    );
  }
  if (look.hair === "slick") {
    if (layer === "back")
      return <path d="M60 160 C54 72 102 36 152 36 C204 36 248 72 240 160 L234 192 L66 192 Z" fill={s} />;
    return (
      <g>
        {/* hair combed straight back, high hairline */}
        <path d="M62 148 C56 66 104 34 152 34 C204 34 248 68 240 148 C236 126 228 110 218 100 C190 86 112 86 84 100 C74 110 66 126 62 148 Z" fill={c} />
        {[0, 1, 2, 3, 4].map((i) => (
          <path
            key={i}
            d={`M${96 + i * 26} 96 C${92 + i * 26} 70 ${110 + i * 20} 50 ${130 + i * 16} 42`}
            stroke="#3a3a42"
            strokeWidth={3}
            fill="none"
            opacity={0.8}
            strokeLinecap="round"
          />
        ))}
        <path d="M110 58 C140 44 176 44 206 60" stroke="#ffffff" strokeWidth={6} fill="none" opacity={0.18} strokeLinecap="round" />
        <path d="M63 148 L65 182 L75 182 L77 136 Z" fill={c} />
        <path d="M237 148 L235 182 L225 182 L223 136 Z" fill={c} />
      </g>
    );
  }
  if (look.hair === "short") {
    if (layer === "back")
      return <path d="M62 160 C58 80 102 50 152 50 C202 50 244 80 238 160 L232 188 L68 188 Z" fill={s} />;
    return (
      <g>
        <path d="M64 146 C60 80 104 50 152 50 C202 50 242 80 236 146 C232 126 224 112 214 104 C186 96 116 96 88 104 C78 112 68 126 64 146 Z" fill={c} />
        {/* textured crop */}
        {Array.from({ length: 14 }).map((_, i) => (
          <circle key={i} cx={92 + (i % 7) * 20} cy={70 + Math.floor(i / 7) * 18 + (i % 2) * 4} r={2.5} fill="#2c2b2a" />
        ))}
        <path d="M65 146 L67 178 L76 178 L78 134 Z" fill={c} opacity={0.85} />
        <path d="M235 146 L233 178 L224 178 L222 134 Z" fill={c} opacity={0.85} />
      </g>
    );
  }
  // curls
  const ring: Array<[number, number, number]> = [
    [68, 140, 17], [70, 112, 18], [84, 86, 19], [106, 66, 19], [132, 54, 19], [160, 52, 19],
    [188, 60, 19], [212, 78, 19], [228, 104, 18], [232, 134, 17], [102, 96, 17], [128, 84, 17],
    [156, 80, 17], [184, 88, 17], [206, 104, 15], [92, 114, 14], [146, 66, 16], [176, 70, 15],
  ];
  if (layer === "back") return <ellipse cx={150} cy={112} rx={94} ry={76} fill={s} />;
  return (
    <g>
      {ring.map(([x, y, r], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r={r} fill={c} />
          <path
            d={`M${x - r * 0.5} ${y + r * 0.1} a ${r * 0.5} ${r * 0.5} 0 1 1 ${r * 0.9} ${r * 0.2}`}
            stroke="#3b3029"
            strokeWidth={2.5}
            fill="none"
            opacity={0.8}
          />
        </g>
      ))}
    </g>
  );
};


const Hat: React.FC<{ look: Look }> = ({ look }) => {
  if (look.hat !== "carabinero") return null;
  // Carabineros service cap: olive crown, dark band, black visor, gold badge
  return (
    <g>
      <path d="M50 108 C44 64 96 30 152 30 C212 30 260 62 252 108 Z" fill="#4a5d3a" />
      <path d="M70 70 C100 44 200 44 232 70" stroke="#5c7149" strokeWidth={8} fill="none" opacity={0.7} />
      <rect x={56} y={98} width={190} height={24} rx={6} fill="#2c3a24" />
      <path d="M62 120 C90 146 210 146 240 120 L236 116 C206 132 96 132 66 116 Z" fill="#111" />
      <path d="M70 120 C100 140 200 140 232 120" stroke="#333" strokeWidth={3} fill="none" />
      <path d="M140 70 L162 70 L166 92 L151 104 L136 92 Z" fill="#e8c24a" stroke="#9c7d1f" strokeWidth={2} />
      <circle cx={151} cy={86} r={6} fill="#2e6b32" />
      <path d="M100 110 L202 110" stroke="#e8c24a" strokeWidth={3} />
    </g>
  );
};

type Props = { look: Look; mouth: number; time: number; blinkOffset: number; lookX?: number };

export const Person: React.FC<Props> = ({ look, mouth, time, blinkOffset, lookX = 0 }) => {
  const blinkPhase = (time + blinkOffset) % 4.1;
  const eyeOpen = blinkPhase < 0.12 ? 0.1 : 1;
  const m = Math.max(0, Math.min(1, mouth));
  const px = lookX * 4; // pupils look toward whoever is talking

  return (
    <svg viewBox="0 0 300 420" width="100%" height="100%" style={{ overflow: "visible" }}>
      <OutfitArt look={look} />
      <Hair look={look} layer="back" />
      <ellipse cx={64} cy={168} rx={14} ry={20} fill={look.skinShade} />
      <ellipse cx={236} cy={168} rx={14} ry={20} fill={look.skinShade} />
      <ellipse cx={150} cy={160} rx={86} ry={96} fill={look.skin} />
      {/* light ash dust on the cheeks */}
      <ellipse cx={100} cy={198} rx={16} ry={9} fill="#ff8a80" opacity={0.25} />
      <ellipse cx={200} cy={198} rx={16} ry={9} fill="#ff8a80" opacity={0.25} />
      <g>
        <ellipse cx={118} cy={168} rx={14} ry={15 * eyeOpen} fill="#ffffff" />
        <ellipse cx={182} cy={168} rx={14} ry={15 * eyeOpen} fill="#ffffff" />
        <ellipse cx={118 + px} cy={169} rx={9} ry={11 * eyeOpen} fill="#2b2118" />
        <ellipse cx={182 + px} cy={169} rx={9} ry={11 * eyeOpen} fill="#2b2118" />
        {eyeOpen > 0.5 ? (
          <>
            <circle cx={121 + px} cy={164} r={3} fill="#fff" />
            <circle cx={185 + px} cy={164} r={3} fill="#fff" />
          </>
        ) : null}
      </g>
      <path d={`M100 ${144 - m * 5} Q118 ${136 - m * 6} 136 ${145 - m * 4}`} stroke={look.hairShade} strokeWidth={7} strokeLinecap="round" fill="none" />
      <path d={`M164 ${145 - m * 4} Q182 ${136 - m * 6} 200 ${144 - m * 5}`} stroke={look.hairShade} strokeWidth={7} strokeLinecap="round" fill="none" />
      <path d="M150 176 Q142 196 153 201" stroke={look.skinShade} strokeWidth={5} fill="none" strokeLinecap="round" />
      {m < 0.08 ? (
        <path d="M130 222 Q150 232 170 222" stroke="#7a2e2e" strokeWidth={6} fill="none" strokeLinecap="round" />
      ) : (
        <g>
          <path d={`M128 220 Q150 ${220 + 8 + m * 30} 172 220 Q150 ${216 - m * 4} 128 220 Z`} fill="#6e2626" />
          <ellipse cx={150} cy={220 + 4 + m * 12} rx={9 + m * 4} ry={2 + m * 5} fill="#e5636a" />
        </g>
      )}
      <Hair look={look} layer="front" />
      <Hat look={look} />
    </svg>
  );
};
