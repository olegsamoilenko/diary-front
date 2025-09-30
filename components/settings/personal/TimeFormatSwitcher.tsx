import React, { forwardRef, useMemo } from "react";
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
import BackArrow from "@/components/ui/BackArrow";
import Background from "@/components/Background";
import { TimeFormat } from "@/types";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "@/store";
import { updateSettings } from "@/store/thunks/settings/updateSettings";

const timeFormatOptions: TimeFormat[] = [
  TimeFormat["12_H"],
  TimeFormat["24_H"],
];

const TimeFormatSwitcher = forwardRef<SideSheetRef, {}>((props, ref) => {
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const styles = useMemo(() => getStyles(colors), [colors]);
  const dispatch = useAppDispatch();
  const settings = useSelector((s: RootState) => s.settings.value);

  async function handleFormat(timeFormat: TimeFormat) {
    try {
      await dispatch(updateSettings({ timeFormat })).unwrap();
    } catch (error: any) {
      console.warn("Failed to update timeFormat", error);
      console.warn("Failed to update timeFormat response", error.response);
      console.warn(
        "Failed to update timeFormat response data",
        error.response.data,
      );
    }
  }

  return (
    <SideSheet ref={ref}>
      <Background background={colors.backgroundImage} paddingTop={10}>
        <View style={styles.container}>
          <BackArrow ref={ref} />
          <ThemedText type={"titleLG"}>
            {t("settings.timeFormat.titlePlural")}
          </ThemedText>
          <ScrollView
            style={{ marginBottom: 0 }}
            showsVerticalScrollIndicator={false}
          >
            {timeFormatOptions.map((f) => (
              <TouchableOpacity
                key={f}
                style={styles.row}
                onPress={() => handleFormat(f)}
              >
                <View
                  style={[
                    styles.radio,
                    settings?.timeFormat === f && {
                      borderColor: colors.primary,
                    },
                  ]}
                >
                  {settings?.timeFormat === f && (
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
