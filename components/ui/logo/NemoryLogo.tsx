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
  const colors = Colors[colorScheme] ?? Colors.system;
  const logos: LogoTheme = {
    light: require("@/assets/images/logo/sandDune.png"),
    neonIce: require("@/assets/images/logo/neonIce.png"),
    avocado: require("@/assets/images/logo/avocado.png"),
    heart: require("@/assets/images/logo/heart.png"),
    space: require("@/assets/images/logo/light.png"),
    calmMind: require("@/assets/images/logo/calmMind.png"),
    orange: require("@/assets/images/logo/orange.png"),
    dark: require("@/assets/images/logo/dark.png"),
    sandDune: require("@/assets/images/logo/sandDune.png"),
    ball: require("@/assets/images/logo/ball.png"),
    yellowBokeh: require("@/assets/images/logo/yellowBokeh.png"),
  };
  return (
    <>
      <Image
        source={logos[colorScheme ?? "light"]}
        style={{ width: width, height: height }}
        resizeMode="contain"
      />
      <ThemedText
        type="logo"
        style={{
          color: colors.primary,
          textShadowColor: "#00000080",
          textShadowOffset: { width: 1, height: 1 },
          textShadowRadius: 5,
        }}
      >
        Nemory
      </ThemedText>
      <ThemedText
        type="slogan"
        style={{
          color: colors.primary,
          textShadowColor: "#00000080",
          textShadowOffset: { width: 1, height: 1 },
          textShadowRadius: 5,
        }}
      >
        {t("slogan")}
      </ThemedText>
    </>
  );
}
