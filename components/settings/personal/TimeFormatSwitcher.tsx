import React, { forwardRef, useEffect, useState } from "react";
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
import * as SecureStore from "@/utils/store/secureStore";
import { ThemedText } from "@/components/ThemedText";
import { useDispatch, useSelector } from "react-redux";
import { saveTimeFormat } from "@/store/thunks/timeFormatThunks";
import type { AppDispatch, RootState } from "@/store";
import BackArrow from "@/components/ui/BackArrow";
import Background from "@/components/Background";

const timeFormatOptions = [
  { key: 12, value: "12h" },
  { key: 24, value: "24h" },
];

const TimeFormatSwitcher = forwardRef<SideSheetRef, {}>((props, ref) => {
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const styles = getStyles(colors);
  const dispatch = useDispatch<AppDispatch>();
  const format = useSelector((state: RootState) => state.timeFormat);

  async function handleFormat(format: { key: 12 | 24; value: "12h" | "24h" }) {
    dispatch(saveTimeFormat(format));
    await SecureStore.setItemAsync("timeFormat", JSON.stringify(format));
  }

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
                key={f.key}
                style={styles.row}
                onPress={() => handleFormat(f as any)}
              >
                <View
                  style={[
                    styles.radio,
                    Number(format.key) === Number(f.key) && {
                      borderColor: Colors[colorScheme].primary,
                    },
                  ]}
                >
                  {Number(format.key) === Number(f.key) && (
                    <View
                      style={[
                        styles.radioDot,
                        { backgroundColor: Colors[colorScheme].primary },
                      ]}
                    />
                  )}
                </View>
                <Text
                  style={[styles.label, { color: Colors[colorScheme].text }]}
                >
                  {t(`settings.timeFormat.${f.key}`)}
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
