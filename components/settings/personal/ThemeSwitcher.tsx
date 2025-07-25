import React, { forwardRef, useEffect, useState } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
} from "react-native";
import { useThemeCustom } from "@/context/ThemeContext";
import { useTranslation } from "react-i18next";
import SideSheet, { SideSheetRef } from "@/components/SideSheet";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { ThemedText } from "@/components/ThemedText";
import { Theme } from "@/types";
import BackArrow from "@/components/ui/BackArrow";
import Background from "@/components/Background";

const themes = [
  {
    name: "light",
    img: require("@/assets/images/theme/light.jpg"),
  },
  {
    name: "calmMind",
    img: require("@/assets/images/theme/calmMind.jpg"),
  },
  {
    name: "orange",
    img: require("@/assets/images/theme/orange.jpg"),
  },
  {
    name: "dark",
    img: require("@/assets/images/theme/dark.jpg"),
  },
  {
    name: "sandDune",
    img: require("@/assets/images/theme/sandDune.jpg"),
  },
  {
    name: "yellowBokeh",
    img: require("@/assets/images/theme/yellowBokeh.jpg"),
  },
];

const ThemeSwitcher = forwardRef<SideSheetRef, {}>((props, ref) => {
  const { theme, setTheme } = useThemeCustom();
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const styles = getStyles(colors);

  const handleTheme = (themeName: string) => {
    setTheme(themeName as Theme);
  };

  useEffect(() => {}, [theme]);

  return (
    <SideSheet ref={ref}>
      <Background background={colors.backgroundImage} paddingTop={10}>
        <View style={styles.container}>
          <BackArrow ref={ref} />
          <ThemedText
            type="titleLG"
            style={{
              marginBottom: 16,
            }}
          >
            {t("settings.theme.titlePlural")}
          </ThemedText>
          <ScrollView style={{ marginBottom: 0 }}>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 16 }}>
              {themes.map((theme) => {
                return (
                  <View
                    key={theme.name}
                    style={{
                      width: "45%",
                    }}
                  >
                    <ThemedText
                      style={{
                        marginBottom: 5,
                      }}
                    >
                      {t(`settings.theme.themes.${theme.name}`)}
                    </ThemedText>
                    <TouchableOpacity onPress={() => handleTheme(theme.name)}>
                      <Image
                        source={theme.img}
                        style={{
                          width: "100%",
                          height: 315,
                        }}
                      />
                    </TouchableOpacity>
                  </View>
                );
              })}
            </View>
          </ScrollView>
        </View>
      </Background>
    </SideSheet>
  );
});

ThemeSwitcher.displayName = "ThemeSwitcher";
export default ThemeSwitcher;

const getStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flexDirection: "column",
      flex: 1,
      paddingLeft: 20,
      marginBottom: -6,
    },
    row: {
      flexDirection: "row",
      alignItems: "center",
    },
    radio: {
      width: 22,
      height: 22,
      borderRadius: 12,
      borderWidth: 2,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 12,
    },
    radioDot: {
      width: 10,
      height: 10,
      borderRadius: 6,
      backgroundColor: "#0284c7",
    },
    label: {
      fontSize: 16,
      color: "#18181b",
    },
  });
