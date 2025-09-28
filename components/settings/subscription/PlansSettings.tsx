import BackArrow from "@/components/ui/BackArrow";
import { ThemedText } from "@/components/ThemedText";
import React, { forwardRef, useEffect, useMemo, useState } from "react";
import SideSheet, { SideSheetRef } from "@/components/SideSheet";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Linking,
  Platform,
} from "react-native";
import * as Application from "expo-application";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";
import { useTranslation } from "react-i18next";
import type { ColorTheme, Plan, User } from "@/types";
import { Subscriptions } from "@/types";
import Background from "@/components/Background";
import * as SecureStore from "expo-secure-store";
import Plans from "@/components/subscription/Plans";
import Payment from "@/components/subscription/Payment";
import AuthForm from "@/components/auth/AuthForm";
import { apiRequest } from "@/utils";
import { UserEvents } from "@/utils/events/userEvents";
import RegisterOrNot from "@/components/auth/RegisterOrNot";
import { Provider, useSelector } from "react-redux";
import { store, RootState, useAppDispatch } from "@/store";

const PlansSettings = forwardRef<SideSheetRef, {}>((props, ref) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const styles = useMemo(() => getStyles(colors), [colors]);
  const { t } = useTranslation();
  const user = useSelector((s: RootState) => s.user.value);
  const [successPaymentPlan, setSuccessPaymentPlan] =
    React.useState<Plan | null>(null);
  const plan = useSelector((s: RootState) => s.plan.value);
  const [showAuthForm, setShowAuthForm] = useState(false);
  const [showRegisterOrNot, setShowRegisterOrNot] = useState(false);
  const [continueWithoutRegistration, setContinueWithoutRegistration] =
    useState(false);

  const onAuthSuccess = () => {
    setShowAuthForm(false);
  };

  const ascForRegister = () => {
    setShowRegisterOrNot(true);
  };

  const onSuccess = async () => {};

  async function openPlaySubscriptions() {
    if (Platform.OS !== "android") return;

    const pkg = Application.applicationId;
    let url = "https://play.google.com/store/account/subscriptions";

    if (pkg) {
      url += `?sku=${encodeURIComponent(Subscriptions.NEMORY)}&package=${encodeURIComponent(pkg)}`;
    }

    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        await Linking.openURL(`market://details?id=${pkg}`);
      }
    } catch (e) {
      await Linking.openURL(url);
    }
  }
  return (
    <SideSheet ref={ref}>
      <Background background={colors.backgroundImage} paddingTop={10}>
        {showRegisterOrNot ? (
          <RegisterOrNot
            setShowAuthForm={setShowAuthForm}
            setContinueWithoutRegistration={setContinueWithoutRegistration}
            onChoice={() => {
              setShowRegisterOrNot(false);
            }}
          />
        ) : showAuthForm ? (
          <AuthForm
            forPlanSelect={true}
            onSuccessSignWithGoogle={onAuthSuccess}
            onSuccessEmailCode={onAuthSuccess}
            onSuccessSignIn={() => setShowAuthForm(false)}
            handleBack={() => setShowAuthForm(false)}
          />
        ) : (
          <View style={styles.container}>
            <BackArrow ref={ref} />
            <ThemedText
              type={"titleLG"}
              style={{
                marginBottom: 20,
              }}
            >
              {t("settings.plans.titlePlural")}
            </ThemedText>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View
                style={{
                  flex: 1,
                  justifyContent: "space-between",
                }}
              >
                <Plans
                  onSuccess={onSuccess}
                  ascForRegister={ascForRegister}
                  continueWithoutRegistration={continueWithoutRegistration}
                />
                {plan && (
                  <TouchableOpacity onPress={openPlaySubscriptions}>
                    <View style={[styles.button]}>
                      <ThemedText
                        type="subtitleLG"
                        style={{
                          color: colors.text,
                        }}
                      >
                        {t("settings.plans.manageSubscription")}
                      </ThemedText>
                    </View>
                  </TouchableOpacity>
                )}
              </View>
            </ScrollView>
          </View>
        )}
      </Background>
    </SideSheet>
  );
});

PlansSettings.displayName = "PlansSettings";

export default PlansSettings;

const getStyles = (colors: ColorTheme) =>
  StyleSheet.create({
    container: {
      paddingHorizontal: 20,
      flex: 1,
      marginBottom: -6,
    },
    card: {
      backgroundColor: colors.backgroundAdditional,
      borderRadius: 12,
      padding: 18,
      marginBottom: 14,
      marginTop: 10,
    },
    planName: {
      fontSize: 18,
      fontWeight: "600",
      marginBottom: 4,
      color: colors.text,
    },
    desc: { fontSize: 14, color: colors.textAdditional, marginBottom: 4 },
    price: {
      fontSize: 16,
      fontWeight: "500",
      color: colors.text,
      marginBottom: 2,
    },
    tokens: { fontSize: 12, color: colors.textAdditional },
    button: {
      borderRadius: 12,
      padding: 18,
      marginBottom: 14,
      marginTop: 10,
      alignItems: "center",
      justifyContent: "center",
    },
  });
