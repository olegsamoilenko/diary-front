import { ImageBackground, View } from "react-native";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";
import { BackgroundSettings } from "@/types";

type BackgroundProps = {
  background: BackgroundSettings;
};
export default function Background({ background }: BackgroundProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme] ?? Colors.system;
  if (background.type === "image" && background.url) {
    return (
      <ImageBackground
        source={background.url}
        style={{ flex: 1 }}
        resizeMode="cover"
      >
        <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.02)" }} />
      </ImageBackground>
    );
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: background.value ?? colors.diaryNotesBackground,
      }}
    />
  );
}
