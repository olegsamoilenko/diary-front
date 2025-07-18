export type Theme = "light" | "calmMind" | "lightMint" | "lightPeach" | "dark";
export type ThemeContextType = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  colorScheme: Theme;
};

export type LogoTheme = {
  light?: any;
  calmMind: any;
  orange?: any;
  dark?: any;
  sandDune?: any;
  yellowBokeh?: any;
};
