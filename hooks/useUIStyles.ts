import { useMemo } from "react";
import { StyleSheet } from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { getFont } from "@/utils";
import { Fonts } from "@/constants/Fonts";
import { Font } from "@/types";

export function useUIStyles() {
  const scheme = useColorScheme();
  const colors = Colors[scheme];
  const settings = useSelector((s: RootState) => s.settings.value);
  const font = useMemo(() => settings?.font ?? Font.NUNITO, [settings]);

  return useMemo(
    () =>
      StyleSheet.create({
        input: {
          backgroundColor: colors.inputBackground,
          color: colors.text,
          paddingHorizontal: 10,
          paddingTop: 9,
          paddingBottom: 14,
          borderWidth: 1,
          borderRadius: 8,
          borderColor: colors.border,
          fontSize: 16,
          fontFamily: getFont(font, "regular"),
          minWidth: "100%",
        },
        label: {
          marginBottom: 12,
          textAlign: "left",
        },
        btnPrimary: {
          paddingHorizontal: 18,
          paddingTop: 8,
          paddingBottom: 12,
          backgroundColor: colors.primary,
          borderRadius: 12,
          textAlign: "center",
        },
        btnOutline: {
          paddingHorizontal: 18,
          paddingTop: 8,
          paddingBottom: 12,
          borderRadius: 12,
          borderWidth: 1,
          borderColor: colors.border,
          textAlign: "center",
        },
      }),
    [colors, font],
  );
}
