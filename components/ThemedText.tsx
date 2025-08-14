import { StyleSheet, Text, type TextProps } from "react-native";
import { ColorTheme } from "@/types";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import { getFont } from "@/utils";

export type ThemedTextProps = TextProps & {
  type?:
    | "logo"
    | "slogan"
    | "titleXL"
    | "titleLG"
    | "subtitleXL"
    | "subtitleLG"
    | "extraSmall"
    | "small"
    | "default"
    | "bold"
    | "extraSmallLink"
    | "smallLink"
    | "link";
  onLinesCount?: (number: number) => void;
};

export function ThemedText({
  style,
  type = "default",
  onLinesCount,
  ...rest
}: ThemedTextProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const font = useSelector((state: RootState) => state.font.font);
  const styles = getStyles(colors, font);

  return (
    <Text
      style={[
        type === "logo" ? styles.logo : undefined,
        type === "slogan" ? styles.slogan : undefined,
        type === "titleXL" ? styles.titleXL : undefined,
        type === "titleLG" ? styles.titleLG : undefined,
        type === "subtitleXL" ? styles.subtitleXL : undefined,
        type === "subtitleLG" ? styles.subtitleLG : undefined,
        type === "extraSmall" ? styles.extraSmall : undefined,
        type === "small" ? styles.small : undefined,
        type === "default" ? styles.default : undefined,
        type === "bold" ? styles.bold : undefined,
        type === "extraSmallLink" ? styles.extraSmallLink : undefined,
        type === "smallLink" ? styles.smallLink : undefined,
        type === "link" ? styles.link : undefined,
        { color: colors.text },
        style,
      ]}
      {...rest}
      onTextLayout={(e) => {
        const lines = e.nativeEvent.lines.length;
        if (onLinesCount) onLinesCount(lines);
      }}
    />
  );
}

const getStyles = (
  colors: ColorTheme,
  font: { title: string; name: string },
) => {
  return StyleSheet.create({
    logo: {
      fontSize: 40,
      fontFamily: getFont(font.name, "bold"),
      lineHeight: 60,
      letterSpacing: 2,
    },
    slogan: {
      fontSize: 20,
      fontFamily: getFont(font.name, "bold"),
      lineHeight: 24,
      letterSpacing: 3,
    },
    titleXL: {
      fontSize: 24,
      fontFamily: getFont(font.name, "bold"),
      lineHeight: 38,
    },
    titleLG: {
      fontSize: 22,
      fontFamily: getFont(font.name, "bold"),
      lineHeight: 26,
    },
    subtitleXL: {
      fontSize: 20,
      fontFamily: getFont(font.name, "bold"),
      lineHeight: 24,
    },
    subtitleLG: {
      fontSize: 18,
      fontFamily: getFont(font.name, "bold"),
      lineHeight: 22,
    },
    extraSmall: {
      fontSize: 12,
      fontFamily: getFont(font.name, "regular"),
      lineHeight: 15,
    },
    small: {
      fontSize: 14,
      fontFamily: getFont(font.name, "regular"),
      lineHeight: 18,
    },
    default: {
      fontSize: 16,
      fontFamily: getFont(font.name, "regular"),
      lineHeight: 20,
    },
    bold: {
      fontSize: 16,
      fontFamily: getFont(font.name, "bold"),
      lineHeight: 20,
    },
    extraSmallLink: {
      fontFamily: getFont(font.name, "regular"),
      lineHeight: 16,
      fontSize: 12,
    },
    smallLink: {
      fontFamily: getFont(font.name, "regular"),
      lineHeight: 18,
      fontSize: 14,
    },
    link: {
      fontFamily: getFont(font.name, "regular"),
      lineHeight: 20,
      fontSize: 16,
    },
  });
};
