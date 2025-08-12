import { View, TextInput, StyleSheet } from "react-native";
import NemoryLogo from "@/components/ui/logo/NemoryLogo";
import { ColorTheme } from "@/types";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";

export default function Welcome() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const styles = getStyles(colors);
  const [name, setName] = useState("");
  const { t } = useTranslation();
  return (
    <View>
      <NemoryLogo />
      <View>
        <TextInput
          placeholder={t("settings.profile.name")}
          style={styles.input}
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
          placeholderTextColor={colors.inputPlaceholder}
        />
      </View>
    </View>
  );
}

const getStyles = (colors: ColorTheme) =>
  StyleSheet.create({
    input: {
      backgroundColor: colors.inputBackground,
      padding: 14,
      borderRadius: 8,
      marginBottom: 12,
      fontSize: 16,
    },
  });
