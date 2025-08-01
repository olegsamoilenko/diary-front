import Plans from "@/components/subscription/Plans";
import Payment from "@/components/subscription/Payment";
import AuthForm from "@/components/auth/AuthForm";
import { View } from "react-native";
import Background from "@/components/Background";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";
import React from "react";
import { Plan } from "@/types";
import { ThemedText } from "@/components/ThemedText";
import { useTranslation } from "react-i18next";

export default function Subscription({
  onSuccessRenewPlan,
}: {
  onSuccessRenewPlan: () => void;
}) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme] ?? Colors.system;
  const [showPayment, setShowPayment] = React.useState(false);
  const [showAuthForm, setShowAuthForm] = React.useState(false);
  const [plan, setPlan] = React.useState<Plan | null>(null);
  const [successPaymentPlan, setSuccessPaymentPlan] =
    React.useState<Plan | null>(null);
  const { t } = useTranslation();

  const onSuccess = async () => {
    onSuccessRenewPlan();
  };

  const onSuccessPayment = () => {
    setSuccessPaymentPlan(plan);
    setShowPayment(false);
  };

  return (
    <Background background={colors.backgroundImage}>
      {showPayment ? (
        <Payment onSuccessPayment={onSuccessPayment} plan={plan} />
      ) : showAuthForm ? (
        <AuthForm
          forPlanSelect={true}
          onSuccessSignWithGoogle={() => {
            setShowAuthForm(false);
          }}
          onSuccessEmailCode={() => {
            setShowAuthForm(false);
          }}
        />
      ) : (
        <View
          style={{
            flex: 1,
            paddingHorizontal: 20,
            paddingTop: 50,
          }}
        >
          <ThemedText
            type={"titleLG"}
            style={{
              marginBottom: 20,
            }}
          >
            {t("settings.plans.titlePlural")}
          </ThemedText>
          <Plans
            showStartPlan={false}
            setShowAuthForm={setShowAuthForm}
            setShowPayment={setShowPayment}
            onSuccess={onSuccess}
            setPlan={setPlan}
            successPaymentPlan={successPaymentPlan}
            setSuccessPaymentPlan={setSuccessPaymentPlan}
          />
        </View>
      )}
    </Background>
  );
}
