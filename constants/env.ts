import Constants from "expo-constants";

export const apiUrl =
  Constants?.expoConfig?.extra?.API_URL || "https://nemoryai.com/api";
export const GOOGLE_CLIENT_WEB_ID =
  Constants?.expoConfig?.extra?.GOOGLE_CLIENT_WEB_ID;
export const GOOGLE_CLIENT_ANDROID_ID =
  Constants?.expoConfig?.extra?.GOOGLE_CLIENT_ANDROID_ID;
export const GOOGLE_CLIENT_IOS_ID =
  Constants?.expoConfig?.extra?.GOOGLE_CLIENT_IOS_ID;
