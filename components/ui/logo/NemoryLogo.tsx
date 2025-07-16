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
    calmMind: require("@/assets/images/logo/calmMind_full.png"),
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
