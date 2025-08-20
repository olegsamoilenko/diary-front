import React, { forwardRef, useEffect } from "react";
import SideSheet, { SideSheetRef } from "@/components/SideSheet";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Colors } from "@/constants/Colors";
import { useTranslation } from "react-i18next";
import { useColorScheme } from "@/hooks/useColorScheme";
import { ThemedText } from "@/components/ThemedText";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/store";
import BackArrow from "@/components/ui/BackArrow";
import Background from "@/components/Background";
import { Theme, TimeFormat, type User } from "@/types";
import { setTimeFormat } from "@/store/slices/settings/timeFormatSlice";
import { apiRequest } from "@/utils";
import { UserEvents } from "@/utils/events/userEvents";
import * as SecureStore from "expo-secure-store";

const timeFormatOptions: TimeFormat[] = [
  TimeFormat["12_H"],
  TimeFormat["24_H"],
];

const TimeFormatSwitcher = forwardRef<SideSheetRef, {}>((props, ref) => {
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const styles = getStyles(colors);
  const dispatch = useDispatch<AppDispatch>();
  const format = useSelector((state: RootState) => state.timeFormat);

  async function handleFormat(format: TimeFormat) {
    try {
      await apiRequest({
        url: `/users/update-settings`,
        method: "POST",
        data: { timeFormat: format },
      });

      dispatch(setTimeFormat(format));
      const stored = await SecureStore.getItemAsync("user");
      const user: User | null = stored ? JSON.parse(stored) : null;

      if (user?.settings) {
        user.settings.timeFormat = format;
        await SecureStore.setItemAsync("user", JSON.stringify(user));
      }
    } catch (error) {
      console.warn("Failed to update lang", error);
    }
  }

  const updateTimeFormat = (user: User) => {
    if (user?.settings?.timeFormat) {
      dispatch(setTimeFormat(user?.settings?.timeFormat));
    }
  };

  useEffect(() => {
    const handler = (user: User) => updateTimeFormat(user);
    UserEvents.on("userLoggedIn", handler);
    return () => UserEvents.off("userLoggedIn", handler);
  }, []);

  return (
    <SideSheet ref={ref}>
      <Background background={colors.backgroundImage} paddingTop={10}>
        <View style={styles.container}>
          <BackArrow ref={ref} />
          <ThemedText type={"titleLG"}>
            {t("settings.timeFormat.titlePlural")}
          </ThemedText>
          <ScrollView style={{ marginBottom: 0 }}>
            {timeFormatOptions.map((f) => (
              <TouchableOpacity
                key={f}
                style={styles.row}
                onPress={() => handleFormat(f)}
              >
                <View
                  style={[
                    styles.radio,
                    format === f && {
                      borderColor: colors.primary,
                    },
                  ]}
                >
                  {format === f && (
                    <View
                      style={[
                        styles.radioDot,
                        { backgroundColor: colors.primary },
                      ]}
                    />
                  )}
                </View>
                <Text style={[styles.label, { color: colors.text }]}>
                  {t(`settings.timeFormat.${f}`)}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </Background>
    </SideSheet>
  );
});

TimeFormatSwitcher.displayName = "TimeFormatSwitcher";

export default TimeFormatSwitcher;

const getStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      paddingLeft: 20,
      flex: 1,
      marginBottom: -6,
    },
    row: {
      flexDirection: "row",
      alignItems: "center",
      marginVertical: 10,
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
