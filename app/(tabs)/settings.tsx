import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { useTranslation } from "react-i18next";
import { useThemeCustom } from "@/context/ThemeContext";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
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
import PersonalSettingsBlock from "@/components/settings/personal/PersonalSettingsBlock";
import ActivitySwitcher from "@/components/settings/personal/ActivitySwitcher";
import TimeFormatSwitcher from "@/components/settings/personal/TimeFormatSwitcher";
import FontSwitcher from "@/components/settings/personal/FontSwitcher";
import { Portal } from "@gorhom/portal";
import NemoryLogo from "@/components/ui/logo/NemoryLogo";
import Background from "@/components/Background";
import AiSettingsBlock from "@/components/settings/ai/AiSettingsBlock";
import SubscriptionSettingsBlock from "@/components/settings/subscription/SubscriptionSettingsBlock";
import PlansSettings from "@/components/settings/subscription/PlansSettings";
import SecuritySettingsBlock from "@/components/settings/security/SecuritySettingsBlock";
import BiometrySettings from "@/components/settings/security/BiometrySettings";

export default function Settings() {
  const themeSwitcherRef = useRef<SideSheetRef>(null);
  const timeFormatSwitcherRef = useRef<SideSheetRef>(null);
  const activitySwitcherRef = useRef<SideSheetRef>(null);
  const languageSwitcherRef = useRef<SideSheetRef>(null);
  const fontSwitcherRef = useRef<SideSheetRef>(null);
  const plansRef = useRef<SideSheetRef>(null);
  const securityRef = useRef<SideSheetRef>(null);
  const biometryRef = useRef<SideSheetRef>(null);
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];

  const modelSwitcherRef = useRef<SideSheetRef>(null);
  const aiModel = useAppSelector((state) => state.settings.aiModel);

  return (
    <Background background={colors.backgroundImage} paddingTop={40}>
      <ParallaxScrollView>
        <View
          style={{
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <NemoryLogo />
        </View>
        {/*<ThemedText type="titleXL">{t("settings.title")}</ThemedText>*/}
        <ThemedText type="subtitleXL">{t("settings.personal")}</ThemedText>
        <PersonalSettingsBlock
          themeSwitcherRef={themeSwitcherRef}
          fontSwitcherRef={fontSwitcherRef}
          timeFormatSwitcherRef={timeFormatSwitcherRef}
          activitySwitcherRef={activitySwitcherRef}
          languageSwitcherRef={languageSwitcherRef}
        />
        <ThemedText type="subtitleXL">{t("settings.ai")}</ThemedText>
        <AiSettingsBlock modelSwitcherRef={modelSwitcherRef} />
        <ThemedText type="subtitleXL">{t("settings.subscription")}</ThemedText>
        <SubscriptionSettingsBlock plansRef={plansRef} />
        <ThemedText type="subtitleXL">{t("settings.security")}</ThemedText>
        <SecuritySettingsBlock biometryRef={biometryRef} />
      </ParallaxScrollView>
      <Portal>
        <ThemeSwitcher ref={themeSwitcherRef} />
        <FontSwitcher ref={fontSwitcherRef} />
        <TimeFormatSwitcher ref={timeFormatSwitcherRef} />
        <ActivitySwitcher ref={activitySwitcherRef} />
        <LanguageSwitcher ref={languageSwitcherRef} />
        <ModelSwitcher ref={modelSwitcherRef} />
        <PlansSettings ref={plansRef} />
        <BiometrySettings ref={biometryRef} />
      </Portal>
    </Background>
  );
}

const styles = StyleSheet.create({});
