import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";
import { useTranslation } from "react-i18next";
import { ColorTheme, Plan, PlanStatus, User } from "@/types";
import { PLANS } from "@/constants/Plans";
import { ThemedText } from "@/components/ThemedText";
import { apiRequest, getStatusColor } from "@/utils";
import { UserEvents } from "@/utils/events/userEvents";
import * as SecureStore from "@/utils/store/secureStore";

type PlansProps = {
  onSuccess?: () => void;
  setShowRegisterOrNot?: (show: boolean) => void;
  setShowPayment?: (show: boolean) => void;
  setPlan: (plan: Plan | null) => void;
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
  const colors = Colors[colorScheme ?? "light"];
  const styles = useMemo(() => getStyles(colors), [colors]);
  const { t } = useTranslation();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const navigatingRef = useRef(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const storedUser = await SecureStore.getItemAsync("user");
      if (!mounted) return;
      setUser(storedUser ? JSON.parse(storedUser) : null);
    })();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!successPaymentPlan) return;
    (async () => {
      await saveToDatabase(successPaymentPlan);
      setPlan(successPaymentPlan);
      setSuccessPaymentPlan(null);
    })();
  }, [successPaymentPlan]);

  const saveToDatabase = useCallback(
    async (plan: Plan) => {
      setLoading(true);
      try {
        const res = await apiRequest({
          url: `/plans/subscribe`,
          method: "POST",
          data: { name: plan.name },
        });

        const stored = await SecureStore.getItemAsync("user");
        const userObj: User | null = stored ? JSON.parse(stored) : null;
        if (userObj) {
          userObj.plan = res.data;
          await SecureStore.setItemAsync("user", JSON.stringify(userObj));
          setUser({ ...userObj });
        }

        UserEvents.emit("userChanged");
        onSuccess?.();
      } catch (error: any) {
        console.error("Error setting plan:", error);
        console.error("Error setting plan response:", error.response);
        console.error("Error setting plan response data:", error.response.data);
      } finally {
        setLoading(false);
      }
    },
    [onSuccess],
  );

  const onSelect = useCallback(
    async (plan: Plan) => {
      if (loading || navigatingRef.current) return;
      if (plan.name === "Start") {
        await saveToDatabase(plan);
        return;
      }

      const canPay =
        (user && continueWithoutRegistration) || (user && user.isRegistered);

      if (canPay) {
        setPlan(plan);
        if (setShowPayment) {
          navigatingRef.current = true;
          setShowPayment(true);
          setTimeout(() => (navigatingRef.current = false), 250);
        }
        return;
      }

      if (user && !user.isRegistered && !continueWithoutRegistration) {
        setShowRegisterOrNot?.(true);
      }
    },
    [
      loading,
      user,
      continueWithoutRegistration,
      setPlan,
      setShowPayment,
      setShowRegisterOrNot,
      saveToDatabase,
    ],
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.loaderWrap}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollView}>
          <View style={styles.plansContainer}>
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
                    <View style={styles.cardInner}>
                      <ThemedText type="subtitleLG">{plan.name}</ThemedText>
                      {user?.plan?.name === plan.name && (
                        <View
                          style={[
                            styles.status,
                            {
                              backgroundColor: getStatusColor(
                                user?.plan?.status,
                              ),
                            },
                          ]}
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
    container: {
      flex: 1,
      height: "100%",
    },
    loaderWrap: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    scrollView: {
      flexGrow: 1,
      width: "100%",
    },
    plansContainer: {
      flexDirection: "column",
      width: "100%",
    },
    card: {
      minWidth: "100%",
      backgroundColor: colors.backgroundAdditional,
      borderRadius: 12,
      padding: 18,
      marginBottom: 14,
      borderWidth: 4,
    },
    cardInner: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    status: {
      paddingVertical: 4,
      paddingHorizontal: 8,
      borderRadius: 16,
    },
    desc: { color: colors.textAdditional, marginBottom: 4 },
    price: {
      marginBottom: 2,
    },
    tokens: { fontSize: 12, color: colors.textAdditional },
  });
