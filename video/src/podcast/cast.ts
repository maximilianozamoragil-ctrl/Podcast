import type { CharacterLook } from "./Character";

export type SpeakerId = "valen" | "max" | "rashid";

export const CAST: Record<SpeakerId, CharacterLook & { color: string }> = {
  valen: {
    name: "Valen",
    hair: "bangs",
    hairColor: "#7a4a2a",
    hairShade: "#5a341c",
    skin: "#f6d0b1",
    skinShade: "#e6b391",
    shirt: "#ff6b6b",
    shirtShade: "#d94f55",
    accent: "#ff6b6b",
    outfit: "tee-chain",
    color: "#ff6b6b",
  },
  max: {
    name: "Max",
    hair: "straight",
    hairColor: "#1d1d24",
    hairShade: "#0c0c10",
    skin: "#efc29f",
    skinShade: "#dba57f",
    shirt: "#a3a6b2",
    shirtShade: "#7b7e8b",
    accent: "#4d96ff",
    outfit: "graphic-hoodie",
    color: "#4d96ff",
  },
  rashid: {
    name: "Rashid",
    hair: "curls",
    hairColor: "#6e4428",
    hairShade: "#4d2e19",
    skin: "#d9a27a",
    skinShade: "#c08860",
    shirt: "#1d1d25",
    shirtShade: "#0d0d12",
    accent: "#ffb627",
    outfit: "sparkle-hoodie",
    color: "#ffb627",
  },
};

export const ORDER: SpeakerId[] = ["valen", "max", "rashid"];
