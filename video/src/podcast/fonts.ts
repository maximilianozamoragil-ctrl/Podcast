import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

export const fontFamily = "Nunito";

loadFont({
  family: fontFamily,
  url: staticFile("fonts/Nunito.woff2"),
  weight: "200 1000",
});
