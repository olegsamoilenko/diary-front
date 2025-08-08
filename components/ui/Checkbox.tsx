import React, { useState } from "react";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { ColorTheme } from "@/types";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";
import { ThemedText } from "@/components/ThemedText";

type CustomCheckboxProps = {
  label?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
};

export default function Checkbox({
  label,
  checked,
  onChange,
}: CustomCheckboxProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme] ?? Colors.system;
  const styles = getStyles(colors);
  return (
    <TouchableOpacity
      style={styles.container}
      activeOpacity={0.8}
      onPress={() => onChange(!checked)}
    >
      <View style={[styles.checkbox, checked && styles.checked]}>
        {checked && (
          <MaterialCommunityIcons name="check" size={16} color="#fff" />
        )}
      </View>
      {label && <ThemedText style={styles.label}>{label}</ThemedText>}
    </TouchableOpacity>
  );
}

const SIZE = 20;

const getStyles = (colors: ColorTheme) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
    },
    checkbox: {
      width: SIZE,
      height: SIZE,
      borderWidth: 2,
      borderColor: colors.border,
      borderRadius: 4,
      justifyContent: "center",
      alignItems: "center",
    },
    checked: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    tick: {
      width: SIZE / 2,
      height: SIZE / 2,
      backgroundColor: "white",
      transform: [{ rotate: "45deg" }],
    },
    label: {
      marginLeft: 8,
      fontSize: 16,
      color: "#222",
    },
  });
