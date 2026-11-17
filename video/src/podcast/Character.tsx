import React from "react";

export type HairStyle = "bangs" | "straight" | "curls";

export type CharacterLook = {
  name: string;
  hair: HairStyle;
  hairColor: string;
  hairShade: string;
  skin: string;
  skinShade: string;
  shirt: string;
  shirtShade: string;
  outfit: Outfit;
};

export type Outfit = "hoodie" | "varsity" | "puffer";

const TORSO = "M40 420 C40 330 80 292 150 292 C220 292 260 330 260 420 Z";
const Neck: React.FC<{ look: CharacterLook }> = ({ look }) => (
  <rect x={128} y={236} width={44} height={64} rx={18} fill={look.skinShade} />
);

// Streetwear outfits. Only the top ~100 units show above the desk, so the
// recognisable details (hood, collar, chain, patches) sit near the neckline.
const Outfit: React.FC<{ look: CharacterLook }> = ({ look }) => {
  const c = look.shirt;
  const s = look.shirtShade;
  if (look.outfit === "hoodie") {
    return (
      <g>
        <path d={TORSO} fill={c} />
        {/* seams from shoulder */}
        <path d="M78 330 C84 360 86 390 86 420 M222 330 C216 360 214 390 214 420" stroke={s} strokeWidth={4} fill="none" opacity={0.7} />
        {/* hood lying behind the neck */}
        <path d="M84 312 C80 262 220 262 216 312 C206 330 94 330 84 312 Z" fill={s} />
        <Neck look={look} />
        {/* hood opening in front */}
        <path d="M104 300 C120 334 180 334 196 300 C188 318 112 318 104 300 Z" fill={c} />
        <path d="M104 300 C120 334 180 334 196 300" stroke={s} strokeWidth={5} fill="none" />
        {/* drawstrings */}
        <path d="M134 322 C132 342 134 362 130 384" stroke="#fff" strokeWidth={5} fill="none" strokeLinecap="round" />
        <path d="M166 322 C168 342 166 362 170 384" stroke="#fff" strokeWidth={5} fill="none" strokeLinecap="round" />
        <rect x={125} y={382} width={10} height={16} rx={3} fill="#cfcfd8" />
        <rect x={165} y={382} width={10} height={16} rx={3} fill="#cfcfd8" />
        {/* small chest logo */}
        <circle cx={208} cy={360} r={12} fill="#fff" opacity={0.9} />
        <path d="M201 360 L206 365 L215 354" stroke={s} strokeWidth={4} fill="none" strokeLinecap="round" />
      </g>
    );
  }
  if (look.outfit === "varsity") {
    return (
      <g>
        {/* white tee underneath */}
        <path d={TORSO} fill="#f4f1ea" />
        {/* jacket body, open in the middle */}
        <path d="M40 420 C40 330 80 296 128 294 L140 420 Z" fill={c} />
        <path d="M260 420 C260 330 220 296 172 294 L160 420 Z" fill={c} />
        {/* cream leather sleeves at the shoulders */}
        <path d="M40 420 C40 352 56 318 86 304 C74 340 72 380 76 420 Z" fill="#f2e6cc" />
        <path d="M260 420 C260 352 244 318 214 304 C226 340 228 380 224 420 Z" fill="#f2e6cc" />
        <Neck look={look} />
        {/* striped ribbed collar */}
        <path d="M110 298 C124 290 128 300 140 330 L150 420" stroke={s} strokeWidth={14} fill="none" />
        <path d="M190 298 C176 290 172 300 160 330 L150 420" stroke={s} strokeWidth={14} fill="none" />
        <path d="M110 298 C124 290 128 300 140 330 L150 420" stroke="#f4f1ea" strokeWidth={4} fill="none" />
        <path d="M190 298 C176 290 172 300 160 330 L150 420" stroke="#f4f1ea" strokeWidth={4} fill="none" />
        {/* chest letter patch */}
        <circle cx={100} cy={340} r={22} fill="#f2e6cc" />
        <text x={100} y={351} textAnchor="middle" fontFamily="Nunito" fontWeight={900} fontSize={30} fill={s}>
          {look.name[0]}
        </text>
        {/* snaps */}
        <circle cx={132} cy={368} r={4} fill="#f2e6cc" />
        <circle cx={134} cy={398} r={4} fill="#f2e6cc" />
      </g>
    );
  }
  // puffer vest over a black tee, with a chain
  return (
    <g>
      <path d={TORSO} fill="#24242c" />
      <Neck look={look} />
      {/* tee neckline */}
      <path d="M124 296 C134 312 166 312 176 296" stroke="#3a3a46" strokeWidth={6} fill="none" />
      {/* silver chain */}
      <path d="M126 300 C128 344 172 344 174 300" stroke="#d9dde6" strokeWidth={5} strokeDasharray="6 4" fill="none" />
      <circle cx={150} cy={338} r={7} fill="#d9dde6" />
      {/* vest panels */}
      <path d="M60 420 C60 350 86 306 120 300 L132 420 Z" fill={c} />
      <path d="M240 420 C240 350 214 306 180 300 L168 420 Z" fill={c} />
      {/* quilting */}
      {[336, 366, 396].map((y) => (
        <g key={y}>
          <path d={`M${66 + (y - 336) * -0.1} ${y} Q96 ${y + 8} 126 ${y}`} stroke={s} strokeWidth={4} fill="none" />
          <path d={`M174 ${y} Q204 ${y + 8} ${234 + (y - 336) * 0.1} ${y}`} stroke={s} strokeWidth={4} fill="none" />
        </g>
      ))}
      {/* high collar */}
      <path d="M112 300 C110 280 124 274 132 282 L134 306 Z" fill={s} />
      <path d="M188 300 C190 280 176 274 168 282 L166 306 Z" fill={s} />
      {/* zipper edges */}
      <path d="M128 304 L134 420 M172 304 L166 420" stroke="#d9dde6" strokeWidth={3} />
    </g>
  );
};

type Props = {
  look: CharacterLook;
  // 0..1 how open the mouth is
  mouth: number;
  // seconds, used for blinking / idle motion
  time: number;
  blinkOffset: number;
};

const Hair: React.FC<{ look: CharacterLook; layer: "back" | "front" }> = ({
  look,
  layer,
}) => {
  const c = look.hairColor;
  const s = look.hairShade;
  if (look.hair === "bangs") {
    if (layer === "back") {
      // short men's cut: back of the head only
      return (
        <path
          d="M60 160 C56 74 102 42 150 42 C198 42 244 74 240 160 L234 190 L66 190 Z"
          fill={s}
        />
      );
    }
    return (
      <g>
        {/* crown */}
        <path
          d="M62 140 C60 72 102 46 150 46 C198 46 240 72 238 140 C230 118 214 106 196 102 L104 102 C86 106 70 118 62 140 Z"
          fill={c}
        />
        {/* straight fringe */}
        {/* messy, textured fringe */}
        <path
          d="M74 128 C78 92 110 80 150 80 C192 80 222 94 226 126 L214 120 L206 140 L192 118 L178 136 L166 114 L152 134 L140 112 L126 132 L114 112 L100 134 L92 116 Z"
          fill={c}
        />
        <path d="M120 96 L114 112 M150 92 L140 112 M180 96 L166 114 M204 104 L192 118" stroke={s} strokeWidth={3} strokeLinecap="round" opacity={0.5} />
        {/* short sideburns */}
        <path d="M63 140 L65 180 L76 180 L78 136 Z" fill={c} />
        <path d="M237 140 L235 180 L224 180 L222 136 Z" fill={c} />
      </g>
    );
  }
  if (look.hair === "straight") {
    if (layer === "back") {
      return (
        <path
          d="M62 160 C56 76 102 44 152 44 C204 44 246 76 240 160 L234 196 L68 196 Z"
          fill={s}
        />
      );
    }
    return (
      <g>
        <path
          d="M62 150 C58 74 104 44 154 44 C206 44 244 78 240 150 C232 124 220 112 208 106 C176 118 132 122 92 112 C78 120 68 134 62 150 Z"
          fill={c}
        />
        {/* side-swept straight fringe */}
        <path
          d="M80 132 C96 94 150 78 214 100 C196 108 170 116 150 120 C130 124 108 128 80 132 Z"
          fill={c}
        />
        <path d="M110 112 C140 100 170 96 200 100" stroke={s} strokeWidth={3} fill="none" opacity={0.6} strokeLinecap="round" />
        <path d="M120 70 C150 60 180 62 210 78" stroke="#ffffff" strokeWidth={5} fill="none" opacity={0.18} strokeLinecap="round" />
        {/* sideburns */}
        <path d="M64 150 L66 186 L76 186 L76 140 Z" fill={c} />
        <path d="M238 150 L236 186 L226 186 L226 140 Z" fill={c} />
      </g>
    );
  }
  // short curls
  const curls: Array<[number, number, number]> = [];
  const ring = [
    [70, 134, 17],
    [74, 108, 18],
    [88, 84, 19],
    [110, 66, 19],
    [136, 56, 19],
    [164, 56, 19],
    [190, 66, 19],
    [212, 84, 19],
    [226, 108, 18],
    [230, 134, 17],
    [104, 96, 17],
    [130, 86, 17],
    [158, 84, 17],
    [184, 92, 17],
    [204, 106, 15],
    [96, 112, 14],
    [148, 70, 16],
  ];
  for (const r of ring) curls.push(r as [number, number, number]);
  if (layer === "back") {
    return <ellipse cx={150} cy={110} rx={92} ry={72} fill={s} />;
  }
  return (
    <g>
      {curls.map(([x, y, r], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r={r} fill={c} />
          <path
            d={`M${x - r * 0.5} ${y + r * 0.1} a ${r * 0.5} ${r * 0.5} 0 1 1 ${r * 0.9} ${r * 0.2}`}
            stroke={s}
            strokeWidth={2.5}
            fill="none"
            opacity={0.7}
          />
        </g>
      ))}
    </g>
  );
};

export const Character: React.FC<Props> = ({ look, mouth, time, blinkOffset }) => {
  // Blink for ~0.12s every ~3.7s
  const blinkPhase = (time + blinkOffset) % 3.7;
  const eyeOpen = blinkPhase < 0.12 ? 0.1 : 1;
  const m = Math.max(0, Math.min(1, mouth));

  return (
    <svg viewBox="0 0 300 420" width="100%" height="100%" style={{ overflow: "visible" }}>
      <Outfit look={look} />
      <Hair look={look} layer="back" />
      {/* ears */}
      <ellipse cx={64} cy={168} rx={14} ry={20} fill={look.skinShade} />
      <ellipse cx={236} cy={168} rx={14} ry={20} fill={look.skinShade} />
      {/* head */}
      <ellipse cx={150} cy={160} rx={86} ry={96} fill={look.skin} />
      {/* cheeks */}
      <ellipse cx={100} cy={196} rx={16} ry={9} fill="#ff8a80" opacity={0.35} />
      <ellipse cx={200} cy={196} rx={16} ry={9} fill="#ff8a80" opacity={0.35} />
      {/* eyes */}
      <g>
        <ellipse cx={118} cy={168} rx={11} ry={13 * eyeOpen} fill="#2b2118" />
        <ellipse cx={182} cy={168} rx={11} ry={13 * eyeOpen} fill="#2b2118" />
        {eyeOpen > 0.5 ? (
          <>
            <circle cx={122} cy={163} r={3.5} fill="#fff" />
            <circle cx={186} cy={163} r={3.5} fill="#fff" />
          </>
        ) : null}
      </g>
      {/* brows (lift a little while talking) */}
      <path
        d={`M102 ${144 - m * 5} Q118 ${136 - m * 6} 134 ${144 - m * 5}`}
        stroke={look.hairShade}
        strokeWidth={6}
        strokeLinecap="round"
        fill="none"
      />
      <path
        d={`M166 ${144 - m * 5} Q182 ${136 - m * 6} 198 ${144 - m * 5}`}
        stroke={look.hairShade}
        strokeWidth={6}
        strokeLinecap="round"
        fill="none"
      />
      {/* nose */}
      <path d="M150 178 Q143 196 152 200" stroke={look.skinShade} strokeWidth={5} fill="none" strokeLinecap="round" />
      {/* mouth */}
      {m < 0.08 ? (
        <path d="M128 220 Q150 236 172 220" stroke="#7a2e2e" strokeWidth={6} fill="none" strokeLinecap="round" />
      ) : (
        <g>
          <path
            d={`M126 218 Q150 ${218 + 10 + m * 34} 174 218 Q150 ${214 - m * 4} 126 218 Z`}
            fill="#7a2e2e"
          />
          <ellipse cx={150} cy={218 + 4 + m * 14} rx={10 + m * 4} ry={3 + m * 5} fill="#ff6f73" />
        </g>
      )}
      <Hair look={look} layer="front" />
      {/* headphones */}
      <path
        d="M58 160 C52 64 104 30 150 30 C196 30 248 64 242 160"
        stroke="#2d2d3a"
        strokeWidth={12}
        fill="none"
        strokeLinecap="round"
      />
      <rect x={42} y={140} width={30} height={58} rx={13} fill="#2d2d3a" />
      <rect x={228} y={140} width={30} height={58} rx={13} fill="#2d2d3a" />
      <rect x={48} y={148} width={10} height={42} rx={5} fill={look.shirt} />
      <rect x={242} y={148} width={10} height={42} rx={5} fill={look.shirt} />
    </svg>
  );
};
