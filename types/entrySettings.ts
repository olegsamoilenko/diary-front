import { ImageSourcePropType } from "react-native";

export type EntrySettings = {
  background: BackgroundSettings;
};

export type TextSettings = {
  fontFamily: string;
  fontSize: number;
  textColor: string;
};

export type BackgroundSettings = {
  id?: number;
  type: "color" | "image";
  value?: string;
  url?: ImageSourcePropType | undefined;
  key?: string;
};
