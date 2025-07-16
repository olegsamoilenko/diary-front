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
    calmMind: require("@/assets/images/logo/calmMind.png"),
  };
  return (
    <Image
      source={logos[colorScheme]}
      style={{ width: width, height: height }}
      resizeMode="contain"
    />
  );
}
