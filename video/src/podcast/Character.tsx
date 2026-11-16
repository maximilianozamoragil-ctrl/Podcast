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
      {/* torso */}
      <path
        d="M40 420 C40 330 80 292 150 292 C220 292 260 330 260 420 Z"
        fill={look.shirt}
      />
      <path d="M118 292 L150 336 L182 292 Z" fill={look.shirtShade} />
      {/* neck */}
      <rect x={128} y={236} width={44} height={64} rx={18} fill={look.skinShade} />
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
