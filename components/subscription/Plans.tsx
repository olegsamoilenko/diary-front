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
import type { ColorTheme, Plan, User } from "@/types";
import { PlanStatus, PlanTypes } from "@/types";
import { PLANS } from "@/constants/Plans";
import { ThemedText } from "@/components/ThemedText";
import { apiRequest, getStatusColor, isSub } from "@/utils";
import { UserEvents } from "@/utils/events/userEvents";
import * as SecureStore from "@/utils/store/secureStore";
import { useIap } from "@/context/IapContext";

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
  // const [loading, setLoading] = useState(false);
  const navigatingRef = useRef(false);
  const { connected, loading, products, buySubById } = useIap();
  const [planType, setPlanType] = useState<PlanTypes | undefined>(undefined);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const storedUser = await SecureStore.getItemAsync("user");
      if (!mounted) return;
      setUser(storedUser ? JSON.parse(storedUser) : null);
      await getPlanType();
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const getPlanType = useCallback(async () => {
    try {
      const res = await apiRequest({
        url: `/plans/plan-type`,
        method: "GET",
      });

      setPlanType(res.data);
    } catch (error: any) {
      console.error("Error get plan type:", error);
      console.error("Error get plan type response:", error.response);
      console.error("Error get plan type response data:", error.response.data);
    }
  }, []);

  // useEffect(() => {
  //   if (!successPaymentPlan) return;
  //   (async () => {
  //     await saveToDatabase(successPaymentPlan);
  //     setPlan(successPaymentPlan);
  //     setSuccessPaymentPlan(null);
  //   })();
  // }, [successPaymentPlan]);

  const saveToDatabase = useCallback(
    async (name: string) => {
      // setLoading(true);
      try {
        const res = await apiRequest({
          url: `/plans/subscribe`,
          method: "POST",
          data: { name: name },
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
        // setLoading(false);
      }
    },
    [onSuccess],
  );

  const onSelectTrial = useCallback(
    async (planName: string) => {
      await saveToDatabase(planName);
    },
    [saveToDatabase],
  );

  const onSelect = useCallback(
    async (plan: any) => {
      const resp = await buySubById(plan.id);

      console.log("buySubById resp", resp);
    },
    [buySubById],
  );

  console.log("products", products);

  const subs = products.filter(isSub).map((plan) => {
    return {
      ...plan,
      descriptionKey:
        PLANS.find((p) => p.name === plan.displayName)?.descriptionKey || "",
      tokensLimit:
        PLANS.find((p) => p.name === plan.displayName)?.tokensLimit || "",
    };
  });

  console.log("subs", subs);

  return (
    <View style={styles.container}>
      {loading || !connected ? (
        <View style={styles.loaderWrap}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollView}>
          <View style={styles.plansContainer}>
            {planType === PlanTypes.OPEN_TESTING ||
              planType === PlanTypes.CLOSED_TESTING ||
              (planType === PlanTypes.INTERNAL_TESTING && (
                <TouchableOpacity onPress={() => onSelectTrial("For testing")}>
                  <View
                    style={[
                      styles.card,
                      {
                        borderColor:
                          user && user.plan && user.plan.name === "For testing"
                            ? colors.primary
                            : "transparent",
                      },
                    ]}
                  >
                    <View style={styles.cardInner}>
                      <ThemedText type="subtitleLG">
                        {t("planModal.forTesting")}
                      </ThemedText>
                      {user?.plan?.name === "For testing" && (
                        <View
                          style={[
                            styles.status,
                            {
                              backgroundColor: getStatusColor(
                                user.plan.status!,
                              ),
                            },
                          ]}
                        >
                          <ThemedText
                            style={{
                              color: colors.textInPrimary,
                            }}
                          >
                            {user.plan.status!.slice(0, 1).toUpperCase() +
                              user.plan.status!.slice(1)}
                          </ThemedText>
                        </View>
                      )}
                    </View>
                    <ThemedText style={styles.desc}>{}</ThemedText>
                    <ThemedText type="subtitleLG" style={styles.price}>
                      {t("planModal.freeForTesting")}
                    </ThemedText>
                    <ThemedText style={styles.tokens}>
                      800 000 {t("planModal.tokens")}
                    </ThemedText>
                  </View>
                </TouchableOpacity>
              ))}
            {((user && !user.plan && planType === PlanTypes.PRODUCTION) ||
              (user &&
                user.plan &&
                planType === PlanTypes.PRODUCTION &&
                user.plan.name === PLANS[0].name)) && (
              <TouchableOpacity onPress={() => onSelectTrial("Start")}>
                <View
                  style={[
                    styles.card,
                    {
                      borderColor:
                        user && user.plan && user.plan.name === PLANS[0].name
                          ? colors.primary
                          : "transparent",
                    },
                  ]}
                >
                  <View style={styles.cardInner}>
                    <ThemedText type="subtitleLG">Start</ThemedText>
                    {user?.plan?.name === PLANS[0].name && (
                      <View
                        style={[
                          styles.status,
                          {
                            backgroundColor: getStatusColor(user.plan.status!),
                          },
                        ]}
                      >
                        <ThemedText
                          style={{
                            color: colors.textInPrimary,
                          }}
                        >
                          {user.plan.status!.slice(0, 1).toUpperCase() +
                            user.plan.status!.slice(1)}
                        </ThemedText>
                      </View>
                    )}
                  </View>
                  <ThemedText style={styles.desc}>
                    {t("plans.start.description")}
                  </ThemedText>
                  <ThemedText type="subtitleLG" style={styles.price}>
                    {t("planModal.free")}
                  </ThemedText>
                  <ThemedText style={styles.tokens}>
                    350 000 {t("planModal.tokensPerMonth")}
                  </ThemedText>
                </View>
              </TouchableOpacity>
            )}

            {subs.map((plan) => {
              return (
                <TouchableOpacity
                  key={plan.id}
                  disabled={
                    user &&
                    user.plan &&
                    plan.displayName === user.plan.name &&
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
                          user &&
                          user.plan &&
                          plan.displayName === user.plan.name
                            ? colors.primary
                            : "transparent",
                      },
                    ]}
                  >
                    <View style={styles.cardInner}>
                      <ThemedText type="subtitleLG">
                        {plan.displayName}
                      </ThemedText>
                      {user &&
                        user.plan &&
                        user.plan.name === plan.displayName && (
                          <View
                            style={[
                              styles.status,
                              {
                                backgroundColor: getStatusColor(
                                  user.plan.status!,
                                ),
                              },
                            ]}
                          >
                            <ThemedText
                              style={{
                                color: colors.textInPrimary,
                              }}
                            >
                              {user.plan.status!.slice(0, 1).toUpperCase() +
                                user.plan.status!.slice(1)}
                            </ThemedText>
                          </View>
                        )}
                    </View>
                    <ThemedText style={styles.desc}>
                      {t(plan.descriptionKey)}
                    </ThemedText>
                    <ThemedText type="subtitleLG" style={styles.price}>
                      {`${plan.displayPrice} / ${t("planModal.month")}`}
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
