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
    light: require("@/assets/images/logo/breathe.png"),
    silentPeaks: require("@/assets/images/logo/silentPeaks.png"),
    goldenHour: require("@/assets/images/logo/goldenHour.png"),
    vintagePaper: require("@/assets/images/logo/vintagePaper.png"),
    zenMind: require("@/assets/images/logo/zenMind.png"),
    mindset: require("@/assets/images/logo/mindset.png"),
    pinkWhisper: require("@/assets/images/logo/pinkWhisper.png"),
    fallLight: require("@/assets/images/logo/fallLight.png"),
    balance: require("@/assets/images/logo/balance.png"),
    seaWhisper: require("@/assets/images/logo/seaWhisper.png"),
    whiteLotus: require("@/assets/images/logo/whiteLotus.png"),
    slowDown: require("@/assets/images/logo/slowDown.png"),
    blueBloom: require("@/assets/images/logo/blueBloom.png"),
    softWaves: require("@/assets/images/logo/softWaves.png"),
    calmMind: require("@/assets/images/logo/calmMind.png"),
    orange: require("@/assets/images/logo/orange.png"),
    dark: require("@/assets/images/logo/dark.png"),
    cipheredNight: require("@/assets/images/logo/cipheredNight.png"),
    oceanDepths: require("@/assets/images/logo/oceanDepths.png"),
    dreamAchieve: require("@/assets/images/logo/dreamAchieve.png"),
    compass: require("@/assets/images/logo/compass.png"),
    neonFocus: require("@/assets/images/logo/neonFocus.png"),
    goodLuck: require("@/assets/images/logo/goodLuck.png"),
    timeToLive: require("@/assets/images/logo/timeToLive.png"),
    ball: require("@/assets/images/logo/ball.png"),
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
