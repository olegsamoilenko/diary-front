import { Colors } from "@/constants/Colors";

export const NavigationThemes = {
  light: {
    dark: false,
    colors: Colors["light"],
    fonts: {},
  },
  calmMind: {
    dark: false,
    colors: Colors["calmMind"],
    fonts: {},
  },
  orange: {
    dark: false,
    colors: Colors["orange"],
    fonts: {},
  },
  dark: {
    dark: true,
    colors: Colors["dark"],
    fonts: {},
  },
  sandDune: {
    dark: false,
    colors: Colors["sandDune"],
    fonts: {},
  },
  yellowBokeh: {
    dark: false,
    colors: Colors["yellowBokeh"],
    fonts: {},
  },
};

export const DefaultTheme = {
  theme: NavigationThemes.light,
  font: {
    title: "Ubuntu",
    name: "Ubuntu",
  },
};
