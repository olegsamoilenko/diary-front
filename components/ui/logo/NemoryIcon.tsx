import { Image } from "react-native";
import { useColorScheme } from "@/hooks/useColorScheme";
import { LogoTheme } from "@/types";

export default function NemoryIcon({
  width = 40,
  height = 50,
}: {
  width?: number;
  height?: number;
}) {
  const colorScheme = useColorScheme();
  const logos: LogoTheme = {
    system: require("@/assets/images/logo/system.png"),
    avocado: require("@/assets/images/logo/avocado.png"),
    heart: require("@/assets/images/logo/heart.png"),
    light: require("@/assets/images/logo/light.png"),
    calmMind: require("@/assets/images/logo/calmMind.png"),
    orange: require("@/assets/images/logo/orange.png"),
    dark: require("@/assets/images/logo/dark.png"),
    sandDune: require("@/assets/images/logo/sandDune.png"),
    ball: require("@/assets/images/logo/ball.png"),
    yellowBokeh: require("@/assets/images/logo/yellowBokeh.png"),
  };
  return (
    <Image
      source={logos[colorScheme]}
      style={{ width: width, height: height }}
      resizeMode="contain"
    />
  );
}
