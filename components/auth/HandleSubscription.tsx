import React, { useMemo, useState, useCallback, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import type { ColorTheme, Plan, User } from "@/types";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";
import { useTranslation } from "react-i18next";
import Background from "@/components/Background";
import Plans from "@/components/subscription/Plans";
import Payment from "@/components/subscription/Payment";
import * as SecureStore from "@/utils/store/secureStore";
import { ThemedText } from "@/components/ThemedText";

type SelectPlanProps = {
  setShowRegisterOrNot?: (show: boolean) => void;
  onSuccess?: () => void;
  continueWithoutRegistration: boolean;
};

export default function HandleSubscription({
  setShowRegisterOrNot,
  onSuccess,
  continueWithoutRegistration,
}: SelectPlanProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const styles = useMemo(() => getStyles(colors), [colors]);
  const { t } = useTranslation();
  const [showPayment, setShowPayment] = React.useState(false);
  const [plan, setPlan] = React.useState<Plan | null>(null);
  const [successPaymentPlan, setSuccessPaymentPlan] =
    React.useState<Plan | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const userString = await SecureStore.getItemAsync("user");
      const userObj: User | null = userString ? JSON.parse(userString) : null;
      setUser(userObj);
    };
    fetchUser();
  }, []);

  const handleNext = () => {
    if (onSuccess) {
      onSuccess();
    }
  };

  const onSuccessPayment = useCallback(() => {
    setSuccessPaymentPlan(plan);
    setShowPayment(false);
  }, [plan]);
  return (
    <Background background={colors.backgroundImage}>
      <View style={styles.container}>
        {showPayment ? (
          <Payment onSuccessPayment={onSuccessPayment} plan={plan} />
        ) : (
          <>
            <Text style={styles.title}>{t("planModal.title")}</Text>
            <Plans
              setShowRegisterOrNot={setShowRegisterOrNot}
              setShowPayment={setShowPayment}
              onSuccess={onSuccess}
              setPlan={setPlan}
              successPaymentPlan={successPaymentPlan}
              setSuccessPaymentPlan={setSuccessPaymentPlan}
              continueWithoutRegistration={continueWithoutRegistration}
            />
            {user && user?.plan && (
              <View
                style={{
                  flexDirection: "row",
                  marginBottom: 50,
                  alignItems: "flex-end",
                  justifyContent: "flex-end",
                }}
              >
                <TouchableOpacity
                  style={styles.btn}
                  onPress={() => handleNext()}
                >
                  <ThemedText
                    style={[
                      {
                        color: colors.textInPrimary,
                      },
                    ]}
                  >
                    {t("common.continue")}
                  </ThemedText>
                </TouchableOpacity>
              </View>
            )}
          </>
        )}
      </View>
    </Background>
  );
}

const getStyles = (colors: ColorTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      flexGrow: 1,
      backgroundColor: "transparent",
      borderRadius: 18,
      padding: 10,
      marginTop: 50,
      alignItems: "center",
      justifyContent: "center",
    },
    title: {
      fontSize: 22,
      fontWeight: "bold",
      marginBottom: 14,
      textAlign: "center",
      color: colors.text,
    },
    btn: {
      paddingHorizontal: 18,
      paddingVertical: 10,
      backgroundColor: colors.primary,
      borderRadius: 12,
      textAlign: "center",
    },
  });
