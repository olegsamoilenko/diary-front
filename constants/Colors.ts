import type { ColorTheme } from "@/types";
const Base = {
  light: {
    background: {
      id: 0,
      value: "#0",
      type: "color | image",
      url: undefined,
    },
    backgroundColor: "#",
    backgroundAdditional: "#",
    primary: "#",
    secondary: "#",
    text: "#",
    textAdditional: "#",
    textInPrimary: "",
    link: "#0000ff",
    border: "#",
    error: "#B9130F",
    // calendar
    calendarBackground: "#",
    calendarEnableDayBorder: "#",
    calendarDisableDayBorder: "#",
    calendarDayLabels: "#",
    // tabs
    tabBackground: "#",
    tabIcon: "#",
    tabIconSelected: "#",
    // input
    inputBackground: "#",
    // diary
    card: "#",
    diaryNotesBackground: "#",
    aiCommentBackground: "#",
    // settings
    blockBackground: "#",
    // barStyle
    barStyle: "",
    // rich
    toolbarBackground: "#",
    toolbarIcon: "#",
  },
};

const tintColorLight = "#344360";
const tintColorDark = "#fff";
const primaryColorDark = "#344360";

export const Colors: Record<string, ColorTheme> = {
  light: {
    // General
    background: {
      id: 201,
      value: "#FFFFFF",
      type: "color",
    },
    backgroundColor: "#FFFFFF",
    backgroundAdditional: "#babfc8",

    primary: "#344360",
    secondary: "#4a5365",
    text: "#2E3A59",
    textAdditional: "#687076",
    textInPrimary: "#FFFFFF",
    link: "#0000ff",
    border: "#E0E0E0",
    error: "#B9130F",
    // calendar
    calendarBackground: "#",
    calendarEnableDayBorder: "#bfbdbd",
    calendarDisableDayBorder: "#f4f4f4",
    calendarDayLabels: "#888",

    // tabs
    tabBackground: "#FFFFFF",
    tabIcon: "#687076",
    tabIconSelected: "#344360",
    // input
    inputBackground: "#ffffff",
    // diary
    card: "#FFFFFF",
    diaryNotesBackground: "#EFE7DA",
    aiCommentBackground: "#ECECEC",
    //  settings
    blockBackground: "#FFFFFF",
    // barStyle
    barStyle: "dark",
    // rich
    toolbarBackground: "#FFFFFF",
    toolbarIcon: "#344360",
  },

  calmMind: {
    background: {
      id: 202,
      value: "#F6F7F9",
      type: "color",
    },
    backgroundColor: "#F6F7F9",
    backgroundAdditional: "#",
    primary: "#5BA9A6",
    secondary: "#FFC97A",
    text: "#23272F",
    textAdditional: "#8899AA",
    textInPrimary: "#FFFFFF",
    link: "#5BA9A6",
    border: "#E5E7EB",
    error: "#FF7A7A",
    // calendar
    calendarBackground: "#",
    calendarEnableDayBorder: "#5BA9A6",
    calendarDisableDayBorder: "#E5E7EB",
    calendarDayLabels: "#888",
    // tabs
    tabBackground: "#F6F7F9",
    tabIcon: "#5BA9A6",
    tabIconSelected: "#FFC97A",
    // input
    inputBackground: "#F0F2F6",
    // diary
    card: "#FFFFFF",
    aiCommentBackground: "#E7FAF8",
    diaryNotesBackground: "#FFFBEA",
    //  settings
    blockBackground: "#FFFFFF",
    // barStyle
    barStyle: "dark",
    // rich
    toolbarBackground: "#F6F7F9",
    toolbarIcon: "#5BA9A6",
  },

  orange: {
    background: {
      id: 203,
      value: "#FFF9F4",
      type: "color",
    },
    backgroundColor: "#FFF9F4",
    backgroundAdditional: "#9e795c",
    primary: "#FF8200",
    secondary: "#FFB354",
    text: "#2E2E2E",
    textAdditional: "#A86800",
    textInPrimary: "#FFF",
    link: "#FF8200",
    border: "#FFD09A",
    error: "#D7263D",
    // calendar
    calendarBackground: "#",
    calendarEnableDayBorder: "#FF8200",
    calendarDisableDayBorder: "#FFD09A",
    calendarDayLabels: "#888",
    // tabs
    tabBackground: "#FFF9F4",
    tabIcon: "#FFB354",
    tabIconSelected: "#FF8200",
    // input
    inputBackground: "#FFF4E3",
    // diary
    card: "#FFE4C7",
    diaryNotesBackground: "#FFE9D1",
    aiCommentBackground: "#FFF1E6",
    //  settings
    blockBackground: "#FFFFFF",
    // barStyle
    barStyle: "dark",
    // rich
    toolbarBackground: "#FFF9F4",
    toolbarIcon: "#FF8200",
  },

  dark: {
    // General
    background: {
      id: 204,
      value: "#151718",
      type: "color",
    },
    backgroundColor: "#151718",
    backgroundAdditional: "#282c2e",
    primary: "#344360",
    secondary: "",
    text: "#ECEDEE",
    textAdditional: "#a5a5a6",
    textInPrimary: "#FFFFFF",
    link: "#",
    border: "#2A2D2F",
    error: "#B9130F",
    // calendar
    calendarBackground: "#",
    calendarEnableDayBorder: "#5b6165",
    calendarDisableDayBorder: "#1e2022",
    calendarDayLabels: "#888",
    // tabs
    tabBackground: "#151718",
    tabIcon: "#9BA1A6",
    tabIconSelected: "#344360",
    // input
    inputBackground: "#000000",
    // diary
    card: "#151718",
    diaryNotesBackground: "#4b5255",
    aiCommentBackground: "",
    //  settings
    blockBackground: "#FFFFFF",
    // barStyle
    barStyle: "light",
    // rich
    toolbarBackground: "#151718",
    toolbarIcon: "#344360",
  },

  sandDune: {
    // General
    background: {
      id: 205,
      value: "#8e8680",
      type: "image",
      url: require("@/assets/images//background/sandDune.jpg"),
    },
    backgroundColor: "#8e8680",
    backgroundAdditional: "#babfc8",
    primary: "#604d3f",
    secondary: "#4a5365",
    text: "#344360",
    textAdditional: "#687076",
    textInPrimary: "#FFFFFF",
    link: "#0000ff",
    border: "#E0E0E0",
    error: "#B9130F",
    // calendar
    calendarBackground: "#",
    calendarEnableDayBorder: "#f4f4f4",
    calendarDisableDayBorder: "#bfbdbd",
    calendarDayLabels: "#888",

    // tabs
    tabBackground: "#FFFFFF",
    tabIcon: "#687076",
    tabIconSelected: "#604d3f",
    // input
    inputBackground: "#ffffff",
    // diary
    card: "#b5aea8",
    diaryNotesBackground: "#EFE7DA",
    aiCommentBackground: "#ECECEC",
    //  settings
    blockBackground: "#b5aea8",
    // barStyle
    barStyle: "light",
    // rich
    toolbarBackground: "#8e8680",
    toolbarIcon: "#604d3f",
  },

  yellowBokeh: {
    // General
    background: {
      id: 206,
      value: "#222020",
      type: "image",
      url: require("@/assets/images/background/yellowBokeh.jpg"),
    },
    backgroundColor: "#222020",
    backgroundAdditional: "#babfc8",
    primary: "#a59f37",
    secondary: "#4a5365",
    text: "#b6bcca",
    textAdditional: "#687076",
    textInPrimary: "#FFFFFF",
    link: "#0000ff",
    border: "#E0E0E0",
    error: "#B9130F",
    // calendar
    calendarBackground: "#",
    calendarEnableDayBorder: "#f4f4f4",
    calendarDisableDayBorder: "#989696",
    calendarDayLabels: "#888",
    // tabs
    tabBackground: "#222020",
    tabIcon: "#687076",
    tabIconSelected: "#a59f37",
    // input
    inputBackground: "#ffffff",
    // diary
    card: "#222020",
    diaryNotesBackground: "#EFE7DA",
    aiCommentBackground: "#ECECEC",
    //  settings
    blockBackground: "#222020",
    // barStyle
    barStyle: "light",
    // rich
    toolbarBackground: "#222020",
    toolbarIcon: "#a59f37",
  },
};
