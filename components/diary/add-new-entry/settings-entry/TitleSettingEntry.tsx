import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import React, { useMemo } from "react";
import { ThemedText } from "@/components/ThemedText";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";
import { ColorTheme } from "@/types";

type TitleSettingEntryProps = {
  title: string;
  onPress: (isShow: boolean) => void;
};

export default function TitleSettingEntry({
  title,
  onPress,
}: TitleSettingEntryProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const styles = useMemo(() => getStyles(colors), [colors]);
  return (
    <View style={styles.titleSetting}>
      <ThemedText type={"subtitleLG"}>{title}</ThemedText>
      <TouchableOpacity onPress={() => onPress(false)}>
        <View style={styles.checkmarkIcon}>
          <Ionicons name="checkmark-outline" size={24} color="#555" />
        </View>
      </TouchableOpacity>
    </View>
  );
}

const getStyles = (colors: ColorTheme) =>
  StyleSheet.create({
    titleSetting: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: 10,
      backgroundColor: colors.background,
    },
    checkmarkIcon: {
      // position: "absolute",
      // right: 0,
      // top: 0,
      // padding: 5,
      // elevation: 2,
    },
  });
