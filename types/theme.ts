export type Theme =
  | "light"
  | "neonIce"
  | "avocado"
  | "heart"
  | "space"
  | "calmMind"
  | "orange"
  | "dark"
  | "sandDune"
  | "ball"
  | "yellowBokeh";
export type ThemeContextType = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  colorScheme: Theme;
};

export type LogoTheme = {
  light?: any;
  neonIce?: any;
  avocado?: any;
  heart?: any;
  space?: any;
  calmMind: any;
  orange?: any;
  dark?: any;
  sandDune?: any;
  ball?: any;
  yellowBokeh?: any;
};
