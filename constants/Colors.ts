import type { ColorTheme } from "@/types";
const Base = {
  light: {
    background: "#",
    backgroundAdditional: "#",
    card: "#",
    primary: "#",
    secondary: "#",
    text: "#",
    textAdditional: "#",
    textInPrimary: "",
    link: "#0000ff",
    border: "#",
    // calendar
    calendarBackground: "#",
    calendarEnableDayBorder: "#",
    calendarDisableDayBorder: "#",
    error: "#B9130F",
    tabIcon: "#",
    tabIconSelected: "#",
    inputBackground: "#",
    diaryNotesBackground: "#",
    aiCommentBackground: "#",
  },
};

const tintColorLight = "#344360";
const tintColorDark = "#fff";
const primaryColorDark = "#344360";

export const Colors: Record<string, ColorTheme> = {
  light: {
    // General
    background: "#FFFFFF",
    backgroundAdditional: "#babfc8",
    card: "#FFFFFF",
    primary: "#344360",
    secondary: "",
    text: "#2E3A59",
    textAdditional: "#687076",
    textInPrimary: "#FFFFFF",
    link: "#0000ff",
    border: "#E0E0E0",
    calendarEnableDayBorder: "#bfbdbd",
    calendarDisableDayBorder: "#f4f4f4",
    error: "#B9130F",
    // icon
    tabIcon: "#687076",
    tabIconSelected: tintColorLight,
    // input
    inputBackground: "#ffffff",
    // diary
    diaryNotesBackground: "#EFE7DA",
    aiCommentBackground: "#ECECEC",
  },

  lightModern: {
    background: "#F9F6F2",
    backgroundAdditional: "#EFE7E3",
    card: "#FFFFFF",
    primary: "#FFAB91",
    secondary: "#F5E3E0",
    text: "#303336",
    textAdditional: "#AD9B8E",
    textInPrimary: "#FFFFFF",
    link: "#FF5722",
    border: "#E1D3CA",
    calendarEnableDayBorder: "#FFAB91",
    calendarDisableDayBorder: "#F3DDD8",
    error: "#F07167",
    tabIcon: "#E7BFA9",
    tabIconSelected: "#FFAB91",
    inputBackground: "#F5EDEB",
    diaryNotesBackground: "#FFF7F0",
    aiCommentBackground: "#F9E1DA",
  },

  chocolateBrownie: {
    background: "#d8cbb8",
    backgroundAdditional: "#b19f84",
    card: "#fff",
    primary: "#523634",
    secondary: "#523634",
    text: "#242833",
    textAdditional: "#687076",
    textInPrimary: "#FFFFFF",
    link: "#2D7FF9",
    border: "#E5EAF0",
    calendarEnableDayBorder: "#8e6f6d",
    calendarDisableDayBorder: "#a39494",
    error: "#FF5151",
    tabIcon: "#717375",
    tabIconSelected: "#2D7FF9",
    inputBackground: "#F1F4F8",
    diaryNotesBackground: "#ede6dc",
    aiCommentBackground: "#F7F9FB",
  },

  dark: {
    // General
    background: "#151718",
    backgroundAdditional: "#282c2e",
    card: "#151718",
    primary: "#344360",
    secondary: "",
    text: "#ECEDEE",
    textAdditional: "#a5a5a6",
    textInPrimary: "#FFFFFF",
    link: "#",
    border: "#2A2D2F",
    calendarEnableDayBorder: "#5b6165",
    calendarDisableDayBorder: "#1e2022",
    error: "#B9130F",
    // icon
    tabIcon: "#9BA1A6",
    tabIconSelected: tintColorDark,
    // input
    inputBackground: "#000000",
    // diary
    diaryNotesBackground: "#4b5255",
    aiCommentBackground: "",
  },

  dark2: {
    // General
    background: "#151718",
    backgroundAdditional: "#282c2e",
    card: "#151718",
    primary: "#344360",
    secondary: "",
    text: "#ECEDEE",
    textAdditional: "#a5a5a6",
    textInPrimary: "#FFFFFF",
    link: "#",
    border: "#2A2D2F",
    calendarEnableDayBorder: "#5b6165",
    calendarDisableDayBorder: "#1e2022",
    error: "#B9130F",
    // icon
    tabIcon: "#9BA1A6",
    tabIconSelected: tintColorDark,
    // input
    inputBackground: "#000000",
    // diary
    diaryNotesBackground: "#4b5255",
    aiCommentBackground: "",
  },

  dark3: {
    // General
    background: "#151718",
    backgroundAdditional: "#282c2e",
    card: "#151718",
    primary: "#344360",
    secondary: "",
    text: "#ECEDEE",
    textAdditional: "#a5a5a6",
    textInPrimary: "#FFFFFF",
    link: "#",
    border: "#2A2D2F",
    calendarEnableDayBorder: "#5b6165",
    calendarDisableDayBorder: "#1e2022",
    error: "#B9130F",
    // icon
    tabIcon: "#9BA1A6",
    tabIconSelected: tintColorDark,
    // input
    inputBackground: "#000000",
    // diary
    diaryNotesBackground: "#4b5255",
    aiCommentBackground: "",
  },
};
