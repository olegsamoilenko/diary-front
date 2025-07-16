import { BackgroundSettings } from "@/types";

export type ColorTheme = {
  // General
  background: BackgroundSettings;
  backgroundColor: string;
  backgroundAdditional: string;
  card: string;
  primary: string;
  secondary: string;
  text: string;
  textAdditional: string;
  textInPrimary: string;
  link: string;
  border: string;
  error: string;
  // calendar
  calendarBackground?: string;
  calendarEnableDayBorder: string;
  calendarDisableDayBorder: string;
  calendarDayLabels: string;
  // tabs
  tabBackground: string;
  tabIcon: string;
  tabIconSelected: string;
  // input
  inputBackground: string;
  // diary
  diaryNotesBackground: string;
  aiCommentBackground: string;
  //  settings
  blockBackground: string;
  // barStyle
  barStyle: string;
  // rich
  toolbarBackground: string;
  toolbarIcon: string;
};
