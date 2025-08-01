import BackArrow from "@/components/ui/BackArrow";
import { ThemedText } from "@/components/ThemedText";
import React, { forwardRef, useEffect, useState } from "react";
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
import { ColorTheme, Plan } from "@/types";
import Background from "@/components/Background";
import * as SecureStore from "@/utils/store/secureStore";
import type { User } from "@/types";
import Plans from "@/components/subscription/Plans";
import Payment from "@/components/subscription/Payment";
import AuthForm from "@/components/auth/AuthForm";
import { apiRequest } from "@/utils";

const PlansSettings = forwardRef<SideSheetRef, {}>((props, ref) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme] ?? Colors.system;
  const styles = getStyles(colors);
  const { t } = useTranslation();
  const [user, setUser] = useState<User | null>(null);
  const [showPayment, setShowPayment] = React.useState(false);
  const [successPaymentPlan, setSuccessPaymentPlan] =
    React.useState<Plan | null>(null);
  const [plan, setPlan] = React.useState<Plan | null>(null);
  const [showAuthForm, setShowAuthForm] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      const storedUser = await SecureStore.getItemAsync("user");
      setUser(storedUser ? JSON.parse(storedUser) : null);
    };
    getUser();
  }, []);

  useEffect(() => {
    console.log("showAuthForm", showAuthForm);
  }, [showAuthForm]);

  const onSuccessPayment = () => {
    setSuccessPaymentPlan(plan);
    setShowPayment(false);
  };

  const onAuthSuccess = () => {
    console.log("onAuthSuccess");
    console.log("onAuthSuccess user", user);
    setShowAuthForm(false);
  };

  const onSuccess = async () => {
    console.log("onSuccess Selected plan:", plan);
    setUser({ ...user, plan: plan });
  };

  const onUnsubscribe = async () => {
    console.log(111);
    if (user && user.isRegistered) {
      console.log(222);
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
      } catch (error) {
        console.error("Error unsubscribing:", error);
      }
    }
  };
  return (
    <SideSheet ref={ref}>
      <Background background={colors.backgroundImage} paddingTop={10}>
        {showPayment ? (
          <Payment onSuccessPayment={onSuccessPayment} plan={plan} />
        ) : showAuthForm ? (
          <AuthForm
            forPlanSelect={true}
            onSuccessSignWithGoogle={onAuthSuccess}
            onSuccessEmailCode={onAuthSuccess}
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
                  setShowAuthForm={setShowAuthForm}
                />
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
