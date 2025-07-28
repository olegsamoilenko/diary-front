export type Theme =
  | "system"
  | "avocado"
  | "heart"
  | "light"
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
  system?: any;
  avocado?: any;
  heart?: any;
  light?: any;
  calmMind: any;
  orange?: any;
  dark?: any;
  sandDune?: any;
  ball?: any;
  yellowBokeh?: any;
};
