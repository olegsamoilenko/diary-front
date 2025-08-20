import React, {
  forwardRef,
  useCallback,
  useState,
  useMemo,
  useEffect,
} from "react";
import SideSheet, { SideSheetRef } from "@/components/SideSheet";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { Colors } from "@/constants/Colors";
import i18n from "i18next";
import { useTranslation } from "react-i18next";
import { useColorScheme } from "@/hooks/useColorScheme";
import * as SecureStore from "expo-secure-store";
import { LocaleConfig } from "react-native-calendars";
import BackArrow from "@/components/ui/BackArrow";
import { ThemedText } from "@/components/ThemedText";
import Background from "@/components/Background";
import type { User } from "@/types";
import { Lang } from "@/types";
import { apiRequest } from "@/utils";
import { UserEvents } from "@/utils/events/userEvents";

const LanguageSwitcher = forwardRef<SideSheetRef, {}>((props, ref) => {
  const [lang, setLang] = useState<Lang>(i18n.language as Lang);
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const styles = getStyles(colors);

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

  const handleSelect = useCallback(async (value: Lang) => {
    try {
      await apiRequest({
        url: `/users/update-settings`,
        method: "POST",
        data: { lang: value },
      });
      await i18n.changeLanguage(value);
      LocaleConfig.defaultLocale = value;
      setLang(value);

      const stored = await SecureStore.getItemAsync("user");
      const user: User | null = stored ? JSON.parse(stored) : null;

      if (user?.settings) {
        user.settings.lang = value;
        await SecureStore.setItemAsync("user", JSON.stringify(user));
      }
    } catch (error) {
      console.warn("Failed to update lang", error);
    }
  }, []);

  const updateLang = async (user: User) => {
    if (user?.settings?.lang) {
      await i18n.changeLanguage(user?.settings?.lang);
      LocaleConfig.defaultLocale = user?.settings?.lang;
      setLang(user?.settings?.lang);
    }
  };

  useEffect(() => {
    const handler = (user: User) => updateLang(user);
    UserEvents.on("userLoggedIn", handler);
    return () => UserEvents.off("userLoggedIn", handler);
  }, []);

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
                onPress={() => handleSelect(option.value)}
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
