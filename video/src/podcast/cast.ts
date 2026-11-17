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
    outfit: "hoodie",
    color: "#ff6b6b",
  },
  max: {
    name: "Max",
    hair: "straight",
    hairColor: "#1d1d24",
    hairShade: "#0c0c10",
    skin: "#efc29f",
    skinShade: "#dba57f",
    shirt: "#4d96ff",
    shirtShade: "#2a5fb8",
    outfit: "varsity",
    color: "#4d96ff",
  },
  rashid: {
    name: "Rashid",
    hair: "curls",
    hairColor: "#6e4428",
    hairShade: "#4d2e19",
    skin: "#d9a27a",
    skinShade: "#c08860",
    shirt: "#ffb627",
    shirtShade: "#c98208",
    outfit: "puffer",
    color: "#ffb627",
  },
};

export const ORDER: SpeakerId[] = ["valen", "max", "rashid"];
