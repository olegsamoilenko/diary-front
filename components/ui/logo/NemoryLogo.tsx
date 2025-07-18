import { Image } from "react-native";
import { useColorScheme } from "@/hooks/useColorScheme";
import { LogoTheme } from "@/types";
export default function NemoryLogo({
  width = 100,
  height = 120,
}: {
  width?: number;
  height?: number;
}) {
  const colorScheme = useColorScheme();
  const logos: LogoTheme = {
    light: require("@/assets/images/logo/light_full.png"),
    calmMind: require("@/assets/images/logo/calmMind_full.png"),
    orange: require("@/assets/images/logo/orange_full.png"),
    dark: require("@/assets/images/logo/dark_full.png"),
    sandDune: require("@/assets/images/logo/sandDune_full.png"),
    yellowBokeh: require("@/assets/images/logo/yellowBokeh_full.png"),
  };
  return (
    <Image
      source={logos[colorScheme]}
      style={{ width: width, height: height }}
      resizeMode="contain"
    />
  );
}
