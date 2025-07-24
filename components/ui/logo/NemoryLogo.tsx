import { Image, Text } from "react-native";
import { useColorScheme } from "@/hooks/useColorScheme";
import { LogoTheme } from "@/types";
import { useTranslation } from "react-i18next";
import { Colors } from "@/constants/Colors";
import { ThemedText } from "@/components/ThemedText";
export default function NemoryLogo({
  width = 100,
  height = 120,
}: {
  width?: number;
  height?: number;
}) {
  const colorScheme = useColorScheme();
  const { t } = useTranslation();
  const colors = Colors[colorScheme];
  const logos: LogoTheme = {
    light: require("@/assets/images/logo/light.png"),
    calmMind: require("@/assets/images/logo/calmMind.png"),
    orange: require("@/assets/images/logo/orange.png"),
    dark: require("@/assets/images/logo/dark.png"),
    sandDune: require("@/assets/images/logo/sandDune.png"),
    yellowBokeh: require("@/assets/images/logo/yellowBokeh.png"),
  };
  return (
    <>
      <Image
        source={logos[colorScheme]}
        style={{ width: width, height: height }}
        resizeMode="contain"
      />
      <ThemedText type="logo" style={{ color: colors.primary }}>
        Nemory
      </ThemedText>
      <ThemedText type="slogan" style={{ color: colors.primary }}>
        {t("slogan")}
      </ThemedText>
    </>
  );
}
