import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";
import { useTranslation } from "react-i18next";
import { ColorTheme, Plan, PlanStatus, User } from "@/types";
import { PLANS } from "@/constants/Plans";
import { ThemedText } from "@/components/ThemedText";
import { apiRequest, getStatusColor, UserEvents } from "@/utils";
import * as SecureStore from "@/utils/store/secureStore";

type PlansProps = {
  onSuccess?: () => void;
  setShowRegisterOrNot?: (show: boolean) => void;
  setShowPayment?: (show: boolean) => void;
  setPlan: (plan: User["plan"]) => void;
  successPaymentPlan: Plan | null;
  setSuccessPaymentPlan: (plan: Plan | null) => void;
  showStartPlan?: boolean;
  continueWithoutRegistration: boolean;
};
export default function Plans({
  onSuccess,
  setShowRegisterOrNot,
  setShowPayment,
  setPlan,
  successPaymentPlan,
  setSuccessPaymentPlan,
  showStartPlan = true,
  continueWithoutRegistration,
}: PlansProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const styles = getStyles(colors);
  const { t } = useTranslation();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  const onSelect = async (plan: (typeof PLANS)[0]) => {
    if (plan.name === "Start") {
      await saveToDatabase(plan);
    } else if (
      (user && continueWithoutRegistration) ||
      (user && user.isRegistered)
    ) {
      setPlan(plan);
      if (setShowPayment) {
        setShowPayment(true);
      }
    } else if (user && !user.isRegistered && !continueWithoutRegistration) {
      if (setShowRegisterOrNot) {
        setShowRegisterOrNot(true);
      }
    }
  };

  useEffect(() => {
    const handlePlan = async () => {
      if (successPaymentPlan) {
        await saveToDatabase(successPaymentPlan);
        setPlan(successPaymentPlan);
        setSuccessPaymentPlan(null);
      }
    };

    handlePlan();
  }, [successPaymentPlan]);

  const saveToDatabase = useCallback(
    async (plan: (typeof PLANS)[0]) => {
      setLoading(true);
      try {
        const { name, ...rest } = plan;
        const res = await apiRequest({
          url: `/plans/subscribe`,
          method: "POST",
          data: {
            name,
          },
        });
        const storedUser = await SecureStore.getItemAsync("user");
        const userObj = JSON.parse(storedUser!);

        userObj.plan = res.data;
        await SecureStore.setItemAsync("user", JSON.stringify(userObj));

        UserEvents.emit("userChanged");

        if (onSuccess) {
          onSuccess();
        }
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.error("Error setting plan:", error);
      }
    },
    [onSuccess],
  );

  useEffect(() => {
    const getUser = async () => {
      const storedUser = await SecureStore.getItemAsync("user");
      setUser(storedUser ? JSON.parse(storedUser) : null);
    };
    getUser();
  }, [saveToDatabase]);

  return (
    <View
      style={{
        flex: 1,
        height: "100%",
      }}
    >
      {loading ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            width: "100%",
          }}
        >
          <View
            style={{
              flexDirection: "column",
              width: "100%",
            }}
          >
            {PLANS.map((plan) => {
              if (
                plan.name === "Start" &&
                user &&
                user.plan &&
                user.plan.name !== "Start"
              ) {
                return null;
              }
              if (plan.name === "Start" && !showStartPlan) {
                return null;
              }
              return (
                <TouchableOpacity
                  key={plan.name}
                  disabled={
                    user &&
                    user.plan &&
                    plan.name === user.plan.name &&
                    (user.plan.status === PlanStatus.ACTIVE ||
                      user.plan.status === PlanStatus.REFUNDED)
                  }
                  onPress={() => onSelect(plan)}
                >
                  <View
                    style={[
                      styles.card,
                      {
                        borderColor:
                          user && user.plan && plan.name === user.plan.name
                            ? colors.primary
                            : "transparent",
                      },
                    ]}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <ThemedText type="subtitleLG">{plan.name}</ThemedText>
                      {user?.plan?.name === plan.name && (
                        <View
                          style={{
                            backgroundColor: getStatusColor(user?.plan?.status),
                            paddingVertical: 4,
                            paddingHorizontal: 8,
                            borderRadius: 16,
                          }}
                        >
                          <ThemedText
                            style={{
                              color: colors.textInPrimary,
                            }}
                          >
                            {user?.plan?.status.slice(0, 1).toUpperCase() +
                              user?.plan?.status.slice(1)}
                          </ThemedText>
                        </View>
                      )}
                    </View>
                    <ThemedText style={styles.desc}>
                      {t(plan.descriptionKey)}
                    </ThemedText>
                    <ThemedText type="subtitleLG" style={styles.price}>
                      {plan.price > 0
                        ? `${plan.price} $ / ${t("planModal.month")}`
                        : t("planModal.free")}
                    </ThemedText>
                    <ThemedText style={styles.tokens}>
                      {plan.tokensLimit.toLocaleString()}{" "}
                      {t("planModal.tokensPerMonth")}
                    </ThemedText>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>
      )}
    </View>
  );
}

const getStyles = (colors: ColorTheme) =>
  StyleSheet.create({
    card: {
      minWidth: "100%",
      backgroundColor: colors.backgroundAdditional,
      borderRadius: 12,
      padding: 18,
      marginBottom: 14,
      borderWidth: 4,
    },
    desc: { color: colors.textAdditional, marginBottom: 4 },
    price: {
      marginBottom: 2,
    },
    tokens: { fontSize: 12, color: colors.textAdditional },
  });
