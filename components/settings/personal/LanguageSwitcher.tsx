import React, { forwardRef, useCallback, useState } from "react";
import SideSheet, { SideSheetRef } from "@/components/SideSheet";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Colors } from "@/constants/Colors";
import i18n from "i18next";
import { useTranslation } from "react-i18next";
import { useColorScheme } from "@/hooks/useColorScheme";
import * as SecureStore from "expo-secure-store";
import { LocaleConfig } from "react-native-calendars";
import BackArrow from "@/components/ui/BackArrow";
import { ThemedText } from "@/components/ThemedText";
import Background from "@/components/Background";

const LanguageSwitcher = forwardRef<SideSheetRef, {}>((props, ref) => {
  const [lang, setLang] = useState<string | null>(i18n.language);
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const styles = getStyles(colors);

  const languages = Object.keys(i18n.options.resources ?? { en: {} }).map(
    (lang) => ({
      key: lang,
      value: lang,
    }),
  );

  const setValue = useCallback(
    async (valOrFn: string | ((prev: string | null) => string | null)) => {
      const value = typeof valOrFn === "function" ? valOrFn(lang) : valOrFn;
      if (value) {
        i18n.changeLanguage(value);
        setLang(value);
        LocaleConfig.defaultLocale = value;
        await SecureStore.setItemAsync("lang", value);
      }
    },
    [lang],
  );

  return (
    <SideSheet ref={ref}>
      <Background background={colors.backgroundImage} paddingTop={10}>
        <View style={styles.container}>
          <BackArrow ref={ref} />
          <ThemedText type={"titleLG"}>
            {t("settings.languages.titlePlural")}
          </ThemedText>
          <ScrollView style={{ marginBottom: 0 }}>
            {languages.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={styles.row}
                onPress={() => setValue(option.value as any)}
              >
                <View
                  style={[
                    styles.radio,
                    lang === option.value && {
                      borderColor: colors.primary,
                    },
                    {
                      borderColor: colors.primary,
                    },
                  ]}
                >
                  {lang === option.value && (
                    <View
                      style={[
                        styles.radioDot,
                        { backgroundColor: colors.primary },
                      ]}
                    />
                  )}
                </View>
                <ThemedText style={[styles.label, { color: colors.text }]}>
                  {t(`settings.languages.${option.key}`)}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </Background>
    </SideSheet>
  );
});

LanguageSwitcher.displayName = "LanguageSwitcher";

export default LanguageSwitcher;

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
    },
    label: {
      fontSize: 16,
      color: colors.text,
    },
  });
