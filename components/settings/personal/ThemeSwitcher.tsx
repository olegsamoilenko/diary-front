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
import { Theme, User } from "@/types";
import BackArrow from "@/components/ui/BackArrow";
import Background from "@/components/Background";
import * as SecureStore from "@/utils/store/secureStore";
import { apiRequest } from "@/utils";
import { UserEvents } from "@/utils/events/userEvents";
import i18n from "i18next";
import { LocaleConfig } from "react-native-calendars";

const themes = [
  {
    name: "light",
    img: require("@/assets/images/theme/breathe.jpg"),
  },
  {
    name: "silentPeaks",
    img: require("@/assets/images/theme/silentPeaks.jpg"),
  },
  {
    name: "goldenHour",
    img: require("@/assets/images/theme/goldenHour.jpg"),
  },
  {
    name: "vintagePaper",
    img: require("@/assets/images/theme/vintagePaper.jpg"),
  },
  {
    name: "zenMind",
    img: require("@/assets/images/theme/zenMind.jpg"),
  },
  {
    name: "mindset",
    img: require("@/assets/images/theme/mindset.jpg"),
  },
  {
    name: "balance",
    img: require("@/assets/images/theme/balance.jpg"),
  },
  {
    name: "leafScape",
    img: require("@/assets/images/theme/leafScape.jpg"),
  },
  {
    name: "pastelCollage",
    img: require("@/assets/images/theme/pastelCollage.jpg"),
  },
  {
    name: "seaWhisper",
    img: require("@/assets/images/theme/seaWhisper.jpg"),
  },
  {
    name: "whiteLotus",
    img: require("@/assets/images/theme/whiteLotus.jpg"),
  },
  {
    name: "slowDown",
    img: require("@/assets/images/theme/slowDown.jpg"),
  },
  {
    name: "fallLight",
    img: require("@/assets/images/theme/fallLight.jpg"),
  },
  {
    name: "pinkWhisper",
    img: require("@/assets/images/theme/pinkWhisper.jpg"),
  },
  {
    name: "paperRose",
    img: require("@/assets/images/theme/paperRose.jpg"),
  },
  {
    name: "blueBloom",
    img: require("@/assets/images/theme/blueBloom.jpg"),
  },
  {
    name: "softWaves",
    img: require("@/assets/images/theme/softWaves.jpg"),
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
    name: "ball",
    img: require("@/assets/images/theme/ball.jpg"),
  },
  {
    name: "compass",
    img: require("@/assets/images/theme/compass.jpg"),
  },
  {
    name: "oceanDepths",
    img: require("@/assets/images/theme/oceanDepths.jpg"),
  },
  {
    name: "neonFocus",
    img: require("@/assets/images/theme/neonFocus.jpg"),
  },
  {
    name: "cipheredNight",
    img: require("@/assets/images/theme/cipheredNight.jpg"),
  },
  {
    name: "goodLuck",
    img: require("@/assets/images/theme/goodLuck.jpg"),
  },
  {
    name: "dreamAchieve",
    img: require("@/assets/images/theme/dreamAchieve.jpg"),
  },
  {
    name: "timeToLive",
    img: require("@/assets/images/theme/timeToLive.jpg"),
  },
  {
    name: "dark",
    img: require("@/assets/images/theme/dark.jpg"),
  },
];

const ThemeSwitcher = forwardRef<SideSheetRef, {}>((props, ref) => {
  const { theme, setTheme } = useThemeCustom();
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const styles = getStyles(colors);

  const handleTheme = async (themeName: string) => {
    try {
      await apiRequest({
        url: `/users/update-settings`,
        method: "POST",
        data: { theme: themeName },
      });
      setTheme(themeName as Theme);
    } catch (error) {
      console.warn("Failed to update theme", error);
    }
  };

  const updateTheme = (user: User) => {
    if (user?.settings?.theme) {
      setTheme(user?.settings?.theme as Theme);
    }
  };

  useEffect(() => {
    const handler = (user: User) => updateTheme(user);
    UserEvents.on("userLoggedIn", handler);
    return () => UserEvents.off("userLoggedIn", handler);
  }, []);

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
              {themes.map((thm) => {
                return (
                  <View
                    key={thm.name}
                    style={{
                      width: "45%",
                    }}
                  >
                    <ThemedText
                      style={{
                        marginBottom: 5,
                      }}
                    >
                      {t(`settings.theme.themes.${thm.name}`)}
                    </ThemedText>
                    <TouchableOpacity
                      onPress={() => handleTheme(thm.name)}
                      style={{
                        borderWidth: 4,
                        borderColor:
                          thm.name === theme ? colors.primary : "transparent",
                        borderRadius: 8,
                        overflow: "hidden",
                      }}
                    >
                      <Image
                        source={thm.img}
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
