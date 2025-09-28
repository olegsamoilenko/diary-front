import React, { forwardRef, useState, useMemo } from "react";
import SideSheet, { SideSheetRef } from "@/components/SideSheet";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { Colors } from "@/constants/Colors";
import i18n from "i18next";
import { useTranslation } from "react-i18next";
import { useColorScheme } from "@/hooks/useColorScheme";
import { LocaleConfig } from "react-native-calendars";
import BackArrow from "@/components/ui/BackArrow";
import { ThemedText } from "@/components/ThemedText";
import Background from "@/components/Background";
import { Lang } from "@/types";
import { updateSettings } from "@/store/thunks/settings/updateSettings";
import { useAppDispatch } from "@/store";

const LanguageSwitcher = forwardRef<SideSheetRef, {}>((props, ref) => {
  const [lang, setLang] = useState<Lang>(i18n.language as Lang);
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const styles = useMemo(() => getStyles(colors), [colors]);
  const dispatch = useAppDispatch();

  const languages = useMemo(() => {
    const resources = (i18n.options?.resources ?? { en: {} }) as Record<
      string,
      unknown
    >;
    return Object.keys(resources).map((code) => ({
      key: code,
      value: code as Lang,
    }));
  }, []);

  async function handleLang(lang: Lang) {
    try {
      await dispatch(updateSettings({ lang })).unwrap();

      await i18n.changeLanguage(lang);
      LocaleConfig.defaultLocale = lang;
      setLang(lang);
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
            {t("settings.languages.titlePlural")}
          </ThemedText>
          <ScrollView style={{ marginBottom: 0 }}>
            {languages.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={styles.row}
                onPress={() => handleLang(option.value)}
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
