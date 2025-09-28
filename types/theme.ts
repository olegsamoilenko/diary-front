import { ETheme } from "@/types";

export type Theme = `${ETheme}`;

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
