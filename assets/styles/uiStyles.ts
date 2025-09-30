import { StyleSheet } from "react-native";
import type { ColorTheme } from "@/types";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { getFont } from "@/utils";

export const uiStyles = (colors: ColorTheme) => {
  const settings = useSelector((s: RootState) => s.settings.value);
  return StyleSheet.create({
    input: {
      backgroundColor: colors.inputBackground,
      color: colors.text,
      padding: 14,
      borderRadius: 8,
      marginBottom: 12,
      fontSize: 16,
      minWidth: "100%",
      fontFamily: getFont(settings!.font),
    },
  });
};
