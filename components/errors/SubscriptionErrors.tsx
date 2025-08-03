import Plans from "@/components/subscription/Plans";
import Payment from "@/components/subscription/Payment";
import AuthForm from "@/components/auth/AuthForm";
import { View } from "react-native";
import Background from "@/components/Background";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";
import React, { forwardRef, useEffect } from "react";
import { Plan } from "@/types";
import { ThemedText } from "@/components/ThemedText";
import { useTranslation } from "react-i18next";
import SideSheet, { SideSheetRef } from "@/components/SideSheet";

const SubscriptionErrors = forwardRef<
  SideSheetRef,
  {
    isOpen: boolean;
    onSuccessRenewPlan: () => void;
    onClose?: () => void;
  }
>((props, ref) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme] ?? Colors.system;
  const [showPayment, setShowPayment] = React.useState(false);
  const [showAuthForm, setShowAuthForm] = React.useState(false);
  const [plan, setPlan] = React.useState<Plan | null>(null);
  const [successPaymentPlan, setSuccessPaymentPlan] =
    React.useState<Plan | null>(null);
  const { t } = useTranslation();

  const onSuccess = async () => {
    props.onSuccessRenewPlan();
  };

  const onSuccessPayment = () => {
    setSuccessPaymentPlan(plan);
    setShowPayment(false);
  };

  return (
    <SideSheet ref={ref}>
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
    </SideSheet>
  );
});

SubscriptionErrors.displayName = "SubscriptionErrors";

export default SubscriptionErrors;
