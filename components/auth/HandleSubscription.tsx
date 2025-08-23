import React, { useMemo, useState, useCallback } from "react";
import { View, Text, StyleSheet } from "react-native";
import { ColorTheme, Plan } from "@/types";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";
import { useTranslation } from "react-i18next";
import Background from "@/components/Background";
import Plans from "@/components/subscription/Plans";
import Payment from "@/components/subscription/Payment";

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
  });
