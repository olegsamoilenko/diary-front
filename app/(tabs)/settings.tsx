import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { SafeAreaView } from "react-native-safe-area-context";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { useTranslation } from "react-i18next";
import { useThemeCustom } from "@/context/ThemeContext";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import i18n from "i18next";
import { useRef } from "react";
import {
  TouchableOpacity,
  StyleSheet,
  Platform,
  StatusBar,
  View,
} from "react-native";
import { SideSheetRef } from "@/components/SideSheet";
import ThemeSwitcher from "@/components/settings/personal/ThemeSwitcher";
import LanguageSwitcher from "@/components/settings/personal/LanguageSwitcher";
import { useAppSelector } from "@/store/hooks";
import ModelSwitcher from "@/components/settings/ai/ModelSwitcher";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import PersonalSettingsBlock from "@/components/settings/personal/PersonalSettingsBlock";
import ActivitySwitcher from "@/components/settings/personal/ActivitySwitcher";
import TimeFormatSwitcher from "@/components/settings/personal/TimeFormatSwitcher";
import FontSwitcher from "@/components/settings/personal/FontSwitcher";
import { Portal } from "@gorhom/portal";

export default function Settings() {
  const themeSwitcherRef = useRef<SideSheetRef>(null);
  const timeFormatSwitcherRef = useRef<SideSheetRef>(null);
  const activitySwitcherRef = useRef<SideSheetRef>(null);
  const languageSwitcherRef = useRef<SideSheetRef>(null);
  const fontSwitcherRef = useRef<SideSheetRef>(null);
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const { theme } = useThemeCustom();
  const colors = Colors[colorScheme];

  const modelSwitcherRef = useRef<SideSheetRef>(null);
  const aiModel = useAppSelector((state) => state.settings.aiModel);

  return (
    <View
      style={{
        flex: 1,
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
        backgroundColor: colors.background,
      }}
    >
      <ParallaxScrollView>
        <ThemedText type="titleXL">{t("settings.title")}</ThemedText>
        <ThemedText type="subtitleXL">{t("settings.personal")}</ThemedText>
        <PersonalSettingsBlock
          themeSwitcherRef={themeSwitcherRef}
          fontSwitcherRef={fontSwitcherRef}
          timeFormatSwitcherRef={timeFormatSwitcherRef}
          activitySwitcherRef={activitySwitcherRef}
          languageSwitcherRef={languageSwitcherRef}
        />

        <TouchableOpacity
          onPress={() => {
            modelSwitcherRef.current?.open();
          }}
        >
          <ThemedView
            style={{
              flex: 1,
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <ThemedText>{t("settings.model.title")}</ThemedText>
            <ThemedView
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
              }}
            >
              <ThemedText>{t(`settings.model.${aiModel}`)}</ThemedText>
              <MaterialCommunityIcons
                name="chevron-right"
                size={28}
                color={colors.text}
              />
            </ThemedView>
          </ThemedView>
        </TouchableOpacity>
      </ParallaxScrollView>
      <Portal>
        <ThemeSwitcher ref={themeSwitcherRef} />
        <FontSwitcher ref={fontSwitcherRef} />
        <TimeFormatSwitcher ref={timeFormatSwitcherRef} />
        <ActivitySwitcher ref={activitySwitcherRef} />
        <LanguageSwitcher ref={languageSwitcherRef} />
        <ModelSwitcher ref={modelSwitcherRef} />
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({});
