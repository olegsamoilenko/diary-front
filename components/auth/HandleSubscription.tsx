import React from "react";
import {
  View,
  Text,
  Modal,
  Pressable,
  StyleSheet,
  ScrollView,
} from "react-native";
import { ColorTheme, Plan } from "@/types";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";
import { useTranslation } from "react-i18next";
import Background from "@/components/Background";
import Plans from "@/components/subscription/Plans";
import Payment from "@/components/subscription/Payment";

type SelectPlanProps = {
  setShowAuthForm?: (show: boolean) => void;
  onSuccess?: () => void;
};

export default function HandleSubscription({
  setShowAuthForm,
  onSuccess,
}: SelectPlanProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme] ?? Colors.system;
  const styles = getStyles(colors);
  const { t } = useTranslation();
  const [showPayment, setShowPayment] = React.useState(false);
  const [plan, setPlan] = React.useState<Plan | null>(null);
  const [successPaymentPlan, setSuccessPaymentPlan] =
    React.useState<Plan | null>(null);

  const onSuccessPayment = () => {
    setSuccessPaymentPlan(plan);
    setShowPayment(false);
  };
  return (
    <Background background={colors.backgroundImage}>
      <View style={styles.container}>
        {showPayment ? (
          <Payment onSuccessPayment={onSuccessPayment} plan={plan} />
        ) : (
          <>
            <Text style={styles.title}>{t("planModal.title")}</Text>
            <Plans
              setShowAuthForm={setShowAuthForm}
              setShowPayment={setShowPayment}
              onSuccess={onSuccess}
              setPlan={setPlan}
              successPaymentPlan={successPaymentPlan}
              setSuccessPaymentPlan={setSuccessPaymentPlan}
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
    card: {
      minWidth: "100%",
      backgroundColor: colors.backgroundAdditional,
      borderRadius: 12,
      padding: 18,
      marginBottom: 14,
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
  });
