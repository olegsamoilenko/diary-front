export type Theme =
  | "light"
  | "silentPeaks"
  | "goldenHour"
  | "vintagePaper"
  | "zenMind"
  | "mindset"
  | "fallLight"
  | "seaWhisper"
  | "whiteLotus"
  | "balance"
  | "slowDown"
  | "pinkWhisper"
  | "blueBloom"
  | "softWaves"
  | "calmMind"
  | "orange"
  | "dark"
  | "goodLuck"
  | "oceanDepths"
  | "dreamAchieve"
  | "compass"
  | "neonFocus"
  | "cipheredNight"
  | "timeToLive"
  | "ball";
export type ThemeContextType = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  colorScheme: Theme;
  resetToSystem: () => void;
};

export type LogoTheme = {
  light?: any;
  silentPeaks?: any;
  goldenHour?: any;
  vintagePaper?: any;
  zenMind?: any;
  fallLight?: any;
  mindset?: any;
  seaWhisper?: any;
  whiteLotus?: any;
  balance?: any;
  slowDown?: any;
  pinkWhisper?: any;
  blueBloom?: any;
  softWaves?: any;
  calmMind?: any;
  orange?: any;
  dark?: any;
  goodLuck?: any;
  oceanDepths?: any;
  dreamAchieve?: any;
  compass?: any;
  neonFocus?: any;
  cipheredNight?: any;
  timeToLive?: any;
  ball?: any;
};
