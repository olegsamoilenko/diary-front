import { Image } from "react-native";
import { useColorScheme } from "@/hooks/useColorScheme";
import { LogoTheme } from "@/types";

export default function NemoryIcon({
  width = 40,
  height = 50,
  style,
}: {
  width?: number;
  height?: number;
  style?: any;
}) {
  const colorScheme = useColorScheme();
  const logos: LogoTheme = {
    light: require("@/assets/images/logo/breathe.png"),
    silentPeaks: require("@/assets/images/logo/silentPeaks.png"),
    goldenHour: require("@/assets/images/logo/goldenHour.png"),
    vintagePaper: require("@/assets/images/logo/vintagePaper.png"),
    zenMind: require("@/assets/images/logo/zenMind.png"),
    mindset: require("@/assets/images/logo/mindset.png"),
    leafScape: require("@/assets/images/logo/leafScape.png"),
    pastelCollage: require("@/assets/images/logo/pastelCollage.png"),
    paperRose: require("@/assets/images/logo/paperRose.png"),
    fallLight: require("@/assets/images/logo/fallLight.png"),
    balance: require("@/assets/images/logo/balance.png"),
    whiteLotus: require("@/assets/images/logo/whiteLotus.png"),
    seaWhisper: require("@/assets/images/logo/seaWhisper.png"),
    slowDown: require("@/assets/images/logo/slowDown.png"),
    pinkWhisper: require("@/assets/images/logo/pinkWhisper.png"),
    blueBloom: require("@/assets/images/logo/blueBloom.png"),
    softWaves: require("@/assets/images/logo/softWaves.png"),
    calmMind: require("@/assets/images/logo/calmMind.png"),
    orange: require("@/assets/images/logo/orange.png"),
    goodLuck: require("@/assets/images/logo/goodLuck.png"),
    oceanDepths: require("@/assets/images/logo/oceanDepths.png"),
    dreamAchieve: require("@/assets/images/logo/dreamAchieve.png"),
    cipheredNight: require("@/assets/images/logo/cipheredNight.png"),
    compass: require("@/assets/images/logo/compass.png"),
    neonFocus: require("@/assets/images/logo/neonFocus.png"),
    timeToLive: require("@/assets/images/logo/timeToLive.png"),
    dark: require("@/assets/images/logo/dark.png"),
    ball: require("@/assets/images/logo/ball.png"),
  };
  return (
    <Image
      source={logos[colorScheme]}
      style={[style, { width: width, height: height }]}
      resizeMode="contain"
    />
  );
}
