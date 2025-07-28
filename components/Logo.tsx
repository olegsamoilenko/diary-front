import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { ColorTheme } from "@/types";
import { StyleSheet, View } from "react-native";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";

export default function Logo() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme] ?? Colors.system;
  const styles = getStyles(colors);
  return (
    <View>
      <ThemedText>Nemory</ThemedText>
    </View>
  );
}

const getStyles = (colors: ColorTheme) => StyleSheet.create({});
