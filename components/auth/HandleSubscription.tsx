import React, { useMemo, useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import type { ColorTheme, Plan, User } from "@/types";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";
import { useTranslation } from "react-i18next";
import Background from "@/components/Background";
import Plans from "@/components/subscription/Plans";
import Payment from "@/components/subscription/Payment";
import * as SecureStore from "expo-secure-store";
import { ThemedText } from "@/components/ThemedText";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Provider, useSelector } from "react-redux";
import { store, RootState, useAppDispatch } from "@/store";

type SelectPlanProps = {
  setShowRegisterOrNot?: (show: boolean) => void;
  onSuccess?: () => void;
  continueWithoutRegistration: boolean;
  back: () => void;
};

export default function HandleSubscription({
  setShowRegisterOrNot,
  onSuccess,
  continueWithoutRegistration,
  back,
}: SelectPlanProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const styles = useMemo(() => getStyles(colors), [colors]);
  const { t } = useTranslation();
  const [showPayment, setShowPayment] = React.useState(false);
  const [successPaymentPlan, setSuccessPaymentPlan] =
    React.useState<Plan | null>(null);
  const user = useSelector((s: RootState) => s.user.value);
  const plan = useSelector((s: RootState) => s.plan.value);

  const handleNext = () => {
    if (onSuccess) {
      onSuccess();
    }
  };

  const handleBack = () => {
    if (showPayment) {
      setShowPayment(false);
    } else {
      back();
    }
  };

  const onSuccessPayment = useCallback(() => {
    setSuccessPaymentPlan(plan);
    setShowPayment(false);
  }, [plan]);
  return (
    <Background background={colors.backgroundImage}>
      <TouchableOpacity
        onPress={handleBack}
        style={[
          {
            paddingTop: 40,
            paddingLeft: 20,
            width: 40,
          },
        ]}
      >
        <MaterialCommunityIcons
          name="arrow-left"
          size={28}
          color={colors.primary}
        />
      </TouchableOpacity>
      <ScrollView
        contentContainerStyle={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          {showPayment ? (
            <Payment onSuccessPayment={onSuccessPayment} plan={plan} />
          ) : (
            <>
              <ThemedText style={styles.title}>
                {t("planModal.title")}
              </ThemedText>
              <Plans
                onSuccess={onSuccess}
                // setPlan={setPlan}
                continueWithoutRegistration={continueWithoutRegistration}
              />
              {/*{user && user?.plan && (*/}
              {/*  <View*/}
              {/*    style={{*/}
              {/*      flexDirection: "row",*/}
              {/*      marginBottom: 50,*/}
              {/*      alignItems: "flex-end",*/}
              {/*      justifyContent: "flex-end",*/}
              {/*    }}*/}
              {/*  >*/}
              {/*    <TouchableOpacity*/}
              {/*      style={styles.btn}*/}
              {/*      onPress={() => handleNext()}*/}
              {/*    >*/}
              {/*      <ThemedText*/}
              {/*        style={[*/}
              {/*          {*/}
              {/*            color: colors.textInPrimary,*/}
              {/*          },*/}
              {/*        ]}*/}
              {/*      >*/}
              {/*        {t("common.continue")}*/}
              {/*      </ThemedText>*/}
              {/*    </TouchableOpacity>*/}
              {/*  </View>*/}
              {/*)}*/}
            </>
          )}
        </View>
      </ScrollView>
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
      marginTop: 30,
      alignItems: "center",
      justifyContent: "center",
    },
    scrollView: {
      flexGrow: 1,
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
