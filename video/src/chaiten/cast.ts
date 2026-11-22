export type SpeakerId = "valentino" | "rashid" | "maximiliano" | "nicolas" | "rafael";

export type Hair = "fringe" | "curls" | "slick" | "side" | "short";
export type Outfit = "white-shirt" | "suit" | "firefighter" | "doctor" | "vest";

export type Look = {
  name: string;
  role: string;
  accent: string; // accent label shown in the lower third
  hair: Hair;
  hairColor: string;
  hairShade: string;
  skin: string;
  skinShade: string;
  outfit: Outfit;
  color: string; // UI colour
};

export const CAST: Record<SpeakerId, Look> = {
  valentino: {
    name: "Valentino",
    role: "Periodista · Conducción en vivo",
    accent: "Argentina",
    hair: "fringe",
    hairColor: "#3d2416",
    hairShade: "#26150c",
    skin: "#f4d2b5",
    skinShade: "#e2b493",
    outfit: "white-shirt",
    color: "#4fc3f7",
  },
  rashid: {
    name: "Rashid",
    role: "Alcalde y encargado de emergencias",
    accent: "Venezuela",
    hair: "curls",
    hairColor: "#18130f",
    hairShade: "#070504",
    skin: "#dcaa82",
    skinShade: "#c48d66",
    outfit: "suit",
    color: "#ffca28",
  },
  maximiliano: {
    name: "Maximiliano",
    role: "Jefe de Bomberos",
    accent: "Chile",
    hair: "slick",
    hairColor: "#141416",
    hairShade: "#050506",
    skin: "#efc6a3",
    skinShade: "#dba987",
    outfit: "firefighter",
    color: "#ff5a4e",
  },
  nicolas: {
    name: "Nicolás",
    role: "Encargado de Salud",
    accent: "Chile",
    hair: "side",
    hairColor: "#9b7651",
    hairShade: "#77593a",
    skin: "#f6d6bd",
    skinShade: "#e5bb9b",
    outfit: "doctor",
    color: "#66bb6a",
  },
  rafael: {
    name: "Rafael",
    role: "Encargado de Emergencias · Logística",
    accent: "Chile",
    hair: "short",
    hairColor: "#121110",
    hairShade: "#040404",
    skin: "#b97f57",
    skinShade: "#a06a45",
    outfit: "vest",
    color: "#ff9800",
  },
};

export const COMMITTEE: SpeakerId[] = ["rashid", "maximiliano", "nicolas", "rafael"];
export const ORDER: SpeakerId[] = ["valentino", ...COMMITTEE];

// horizontal centre of each person on the 1920px stage
export const SEAT_X: Record<SpeakerId, number> = {
  valentino: 330,
  rashid: 830,
  maximiliano: 1115,
  nicolas: 1400,
  rafael: 1685,
};
