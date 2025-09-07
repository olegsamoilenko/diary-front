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
} from "react-native";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";
import { useTranslation } from "react-i18next";
import { PLANS } from "@/constants/Plans";
import type { ColorTheme, Plan, User } from "@/types";
import Background from "@/components/Background";
import * as SecureStore from "@/utils/store/secureStore";
import Plans from "@/components/subscription/Plans";
import Payment from "@/components/subscription/Payment";
import AuthForm from "@/components/auth/AuthForm";
import { apiRequest } from "@/utils";
import { UserEvents } from "@/utils/events/userEvents";
import RegisterOrNot from "@/components/auth/RegisterOrNot";
import { setTimeFormat } from "@/store/slices/settings/timeFormatSlice";

const PlansSettings = forwardRef<SideSheetRef, {}>((props, ref) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const styles = useMemo(() => getStyles(colors), [colors]);
  const { t } = useTranslation();
  const [user, setUser] = useState<User | null>(null);
  const [showPayment, setShowPayment] = React.useState(false);
  const [successPaymentPlan, setSuccessPaymentPlan] =
    React.useState<Plan | null>(null);
  const [plan, setPlan] = React.useState<Plan | null>(null);
  const [showAuthForm, setShowAuthForm] = useState(false);
  const [showRegisterOrNot, setShowRegisterOrNot] = useState(false);
  const [continueWithoutRegistration, setContinueWithoutRegistration] =
    useState(false);

  useEffect(() => {
    const getUser = async () => {
      const storedUser = await SecureStore.getItemAsync("user");
      setUser(storedUser ? JSON.parse(storedUser) : null);
    };
    getUser();
  }, []);

  const onSuccessPayment = () => {
    setSuccessPaymentPlan(plan);
    setShowPayment(false);
  };

  const onAuthSuccess = () => {
    setShowAuthForm(false);
  };

  const onSuccess = async () => {
    setUser({ ...user, plan: plan });
  };

  const onUnsubscribe = async () => {
    if (user && user.isRegistered) {
      try {
        await apiRequest({
          url: "/plans/unsubscribe",
          method: "POST",
        });
        setUser({ ...user, plan: null });
        await SecureStore.setItemAsync(
          "user",
          JSON.stringify({ ...user, plan: null }),
        );
      } catch (error: any) {
        console.error("Error unsubscribing:", error);
        console.error("Error unsubscribing response:", error.response);
        console.error(
          "Error unsubscribing response data:",
          error.response.data,
        );
      }
    }
  };

  const updatePlan = (user: User) => {
    if (user?.plan) {
      setUser(user);
      // setPlan(user.plan);
    }
  };

  useEffect(() => {
    const handler = (user: User) => updatePlan(user);
    UserEvents.on("userLoggedIn", handler);
    return () => UserEvents.off("userLoggedIn", handler);
  }, []);
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
        ) : showPayment ? (
          <Payment onSuccessPayment={onSuccessPayment} plan={plan} />
        ) : showAuthForm ? (
          <AuthForm
            forPlanSelect={true}
            onSuccessSignWithGoogle={onAuthSuccess}
            onSuccessEmailCode={onAuthSuccess}
            onSuccessSignIn={() => setShowAuthForm(false)}
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
            <ScrollView>
              <View
                style={{
                  flex: 1,
                  justifyContent: "space-between",
                }}
              >
                <Plans
                  setShowPayment={setShowPayment}
                  onSuccess={onSuccess}
                  setPlan={setPlan}
                  successPaymentPlan={successPaymentPlan}
                  setSuccessPaymentPlan={setSuccessPaymentPlan}
                  setShowRegisterOrNot={setShowRegisterOrNot}
                  continueWithoutRegistration={continueWithoutRegistration}
                />
                {user && user!.plan && (
                  <TouchableOpacity onPress={onUnsubscribe}>
                    <View
                      style={[
                        styles.button,
                        {
                          borderWidth: 1,
                          borderColor: colors.border,
                          borderRadius: 12,
                        },
                      ]}
                    >
                      <ThemedText
                        type="subtitleLG"
                        style={{
                          color: colors.text,
                        }}
                      >
                        {t("settings.plans.unsubscribe")}
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
