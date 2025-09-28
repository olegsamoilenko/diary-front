import { BackgroundSettings } from "@/types";
import { StatusBarStyle } from "expo-status-bar";

export type ColorTheme = {
  // General
  background: string;
  backgroundImage: BackgroundSettings;
  backgroundAdditional: string;
  primary: string;
  disabledPrimary: string;
  secondary: string;
  text: string;
  textAdditional: string;
  textInPrimary: string;
  link: string;
  border: string;
  error: string;
  notification: string;
  // calendar
  calendarBackground?: string;
  calendarEnableDayBorder: string;
  calendarDisableDayBorder: string;
  calendarDayLabels: string;
  calendarDayDisabled: string;
  // tabs
  tabBackground: string;
  tabIcon: string;
  tabIconSelected: string;
  // input
  inputBackground: string;
  inputBorder: string;
  inputPlaceholder: string;
  // Icon
  icon: string;
  // diary
  card: string;
  diaryNotesBackground: string;
  aiCommentBackground: string;
  questionBackground: string;
  answerBackground: string;
  //  settings
  blockBackground: string;
  // barStyle
  barStyle: StatusBarStyle | undefined;
  // rich
  toolbarBackground: string;
  toolbarIcon: string;
  // Modal
  modalBackground: string;
};
