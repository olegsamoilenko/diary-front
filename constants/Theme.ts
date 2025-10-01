import { Colors } from "@/constants/Colors";

const defaultFonts = {
  regular: {
    fontFamily: "System",
    fontWeight: "400" as const,
  },
  medium: {
    fontFamily: "System",
    fontWeight: "500" as const,
  },
  bold: {
    fontFamily: "System",
    fontWeight: "700" as const,
  },
  heavy: {
    fontFamily: "System",
    fontWeight: "900" as const,
  },
};

export const NavigationThemes = {
  light: {
    dark: false,
    colors: Colors["light"],
    fonts: defaultFonts,
  },
  silentPeaks: {
    dark: false,
    colors: Colors["silentPeaks"],
    fonts: defaultFonts,
  },
  goldenHour: {
    dark: false,
    colors: Colors["goldenHour"],
    fonts: defaultFonts,
  },
  vintagePaper: {
    dark: false,
    colors: Colors["vintagePaper"],
    fonts: defaultFonts,
  },
  zenMind: {
    dark: false,
    colors: Colors["zenMind"],
    fonts: defaultFonts,
  },
  mindset: {
    dark: false,
    colors: Colors["mindset"],
    fonts: defaultFonts,
  },
  balance: {
    dark: false,
    colors: Colors["balance"],
    fonts: defaultFonts,
  },
  leafScape: {
    dark: false,
    colors: Colors["leafScape"],
    fonts: defaultFonts,
  },
  pastelCollage: {
    dark: false,
    colors: Colors["pastelCollage"],
    fonts: defaultFonts,
  },
  seaWhisper: {
    dark: false,
    colors: Colors["seaWhisper"],
    fonts: defaultFonts,
  },
  whiteLotus: {
    dark: false,
    colors: Colors["whiteLotus"],
    fonts: defaultFonts,
  },
  slowDown: {
    dark: false,
    colors: Colors["slowDown"],
    fonts: defaultFonts,
  },
  fallLight: {
    dark: false,
    colors: Colors["fallLight"],
    fonts: defaultFonts,
  },
  pinkWhisper: {
    dark: false,
    colors: Colors["pinkWhisper"],
    fonts: defaultFonts,
  },
  paperRose: {
    dark: false,
    colors: Colors["paperRose"],
    fonts: defaultFonts,
  },
  blueBloom: {
    dark: false,
    colors: Colors["blueBloom"],
    fonts: defaultFonts,
  },
  softWaves: {
    dark: false,
    colors: Colors["softWaves"],
    fonts: defaultFonts,
  },
  calmMind: {
    dark: false,
    colors: Colors["calmMind"],
    fonts: defaultFonts,
  },
  orange: {
    dark: false,
    colors: Colors["orange"],
    fonts: defaultFonts,
  },
  ball: {
    dark: true,
    colors: Colors["ball"],
    fonts: defaultFonts,
  },
  goodLuck: {
    dark: true,
    colors: Colors["goodLuck"],
    fonts: defaultFonts,
  },
  oceanDepths: {
    dark: true,
    colors: Colors["oceanDepths"],
    fonts: defaultFonts,
  },
  dreamAchieve: {
    dark: true,
    colors: Colors["dreamAchieve"],
    fonts: defaultFonts,
  },
  cipheredNight: {
    dark: true,
    colors: Colors["cipheredNight"],
    fonts: defaultFonts,
  },
  neonFocus: {
    dark: true,
    colors: Colors["neonFocus"],
    fonts: defaultFonts,
  },
  compass: {
    dark: true,
    colors: Colors["compass"],
    fonts: defaultFonts,
  },
  timeToLive: {
    dark: true,
    colors: Colors["timeToLive"],
    fonts: defaultFonts,
  },
  dark: {
    dark: true,
    colors: Colors["dark"],
    fonts: defaultFonts,
  },
};

export const DefaultTheme = {
  theme: NavigationThemes.light,
  font: {
    title: "Ubuntu",
    name: "Ubuntu",
  },
};
