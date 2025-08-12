import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";

export default function Note({ color }: { color: string }) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  return (
    <MaterialCommunityIcons
      name="notebook-outline"
      size={28}
      color={colors.tabIcon}
    />
  );
}
