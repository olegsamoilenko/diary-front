export type Theme =
  | "light"
  | "lightPastel"
  | "lightMint"
  | "lightPeach"
  | "dark";
export type ThemeContextType = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  colorScheme: Theme;
};
