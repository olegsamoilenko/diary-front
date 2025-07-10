import React, { forwardRef, useEffect, useState } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Switch,
  Pressable,
} from "react-native";
import { useThemeCustom } from "@/context/ThemeContext";
import { useTranslation } from "react-i18next";
import { THEME_OPTIONS } from "@/constants/ThemeOptions";
import SideSheet, { SideSheetRef } from "@/components/SideSheet";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { lightenColor } from "@/utils";
import { ThemedText } from "@/components/ThemedText";
import { Theme } from "@/types";
import WeekView from "@/components/diary/calendar/WeekView";
import { MoodEmoji } from "@/constants/Mood";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import i18n from "i18next";
import BackArrow from "@/components/ui/BackArrow";

const ThemeSwitcher = forwardRef<SideSheetRef, {}>((props, ref) => {
  const { theme, setTheme } = useThemeCustom();
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const styles = getStyles(colors);
  const lang = useState<string | null>(i18n.language)[0];

  function getMonthName(locale = "uk") {
    const date = new Date();
    const month = new Intl.DateTimeFormat(locale, { month: "long" }).format(
      date,
    );

    return month.charAt(0).toUpperCase() + month.slice(1);
  }

  const handleTheme = (themeName: string) => {
    setTheme(themeName as Theme);
  };

  useEffect(() => {}, [theme]);

  return (
    <SideSheet ref={ref}>
      <View style={styles.container}>
        <BackArrow ref={ref} />
        <ThemedText
          type="titleLG"
          style={{
            marginBottom: 16,
          }}
        >
          {t("settings.theme.title")}
        </ThemedText>
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 16 }}>
          {Object.entries(Colors).map(([themeName, colorTheme]) => {
            return (
              <View
                key={themeName}
                style={{
                  width: "45%",
                }}
              >
                <ThemedText
                  style={{
                    marginBottom: 5,
                  }}
                >
                  {t(`settings.theme.themes.${themeName}`)}
                </ThemedText>
                <TouchableOpacity onPress={() => handleTheme(themeName)}>
                  <View
                    style={{
                      backgroundColor: colorTheme.background,
                      padding: 8,
                      elevation: 12,
                      height: 250,
                      borderRadius: 8,
                      flexDirection: "column",
                      justifyContent: "space-between",
                    }}
                  >
                    <View>
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "space-between",
                          width: "100%",
                        }}
                      >
                        <View>
                          <MaterialCommunityIcons
                            name="triangle"
                            size={5}
                            color={colorTheme.primary}
                            style={{
                              transform: [
                                { rotate: "270deg" },
                                { scaleX: 1.4 },
                                { scaleY: 0.8 },
                              ],
                            }}
                          />
                        </View>
                        <Text style={{ fontSize: 10, color: colorTheme.text }}>
                          {getMonthName(lang || undefined) +
                            " " +
                            new Date().getFullYear()}
                        </Text>
                        <View>
                          <MaterialCommunityIcons
                            name="triangle"
                            size={5}
                            color={colorTheme.primary}
                            style={{
                              transform: [
                                { rotate: "90deg" },
                                { scaleX: 1.4 },
                                { scaleY: 0.8 },
                              ],
                            }}
                          />
                        </View>
                      </View>
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "space-between",
                          marginTop: 2,
                          marginBottom: 6,
                        }}
                      >
                        {[1, 2, 3, 4, 5, 6, 7].map((day) => (
                          <View
                            key={day}
                            style={{
                              borderRadius: 500,
                              width: 14,
                              height: 14,
                              padding: 2,
                              position: "relative",
                              backgroundColor:
                                day === 3 ? colorTheme.primary : "transparent",
                            }}
                          >
                            <Text
                              style={{
                                fontSize: 8,
                                fontWeight: day === 3 ? "bold" : "normal",
                                position: "absolute",
                                top: -1,
                                left: 2,
                                color:
                                  day === 3
                                    ? colorTheme.textInPrimary
                                    : colorTheme.text,
                              }}
                            >
                              {day}
                            </Text>
                            <Text
                              style={{
                                fontSize: 5,
                                marginLeft: 4,
                                position: "absolute",
                                right: 2,
                                bottom: 1,
                              }}
                            >
                              {"🙂"}
                            </Text>
                          </View>
                        ))}
                      </View>
                    </View>
                    <View
                      style={{
                        flex: 1,
                      }}
                    >
                      <ThemedText>Content</ThemedText>
                    </View>
                    <View
                      style={{
                        borderWidth: 1,
                      }}
                    >
                      <ThemedText>Bottom</ThemedText>
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
            );
          })}
        </View>
      </View>
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
      backgroundColor: colors.background,
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
