import {
  ActivityIndicator,
  Platform,
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
import {
  BasePlanIds,
  PlanStatus,
  PlanTypes,
  Subscriptions,
  IapProduct,
} from "@/types";
import type { ColorTheme, Plan, User } from "@/types";
import { PLANS } from "@/constants/Plans";
import { ThemedText } from "@/components/ThemedText";
import {
  apiRequest,
  getPlanName,
  getStatusColor,
  logStoredUserData,
} from "@/utils";
import { useIap } from "@/context/IapContext";
import { PlanEvents } from "@/utils/events/planEvents";
import { useSelector } from "react-redux";
import { store, RootState, useAppDispatch } from "@/store";
import { setPlan } from "@/store/slices/planSlice";
import { getUserPlan } from "@/store/thunks/subscription/getUserPlan";
import { getPlanTypeApi } from "@/utils/api/endpoints/subscription/getPlanTypeApi";
import { saveTrialPlanToDatabase } from "@/store/thunks/subscription/saveTrialPlanToDatabase";

type PlansProps = {
  onSuccess?: () => void;
  ascForRegister?: () => void;
  continueWithoutRegistration: boolean;
};
export default function Plans({
  onSuccess,
  ascForRegister,
  continueWithoutRegistration,
}: PlansProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const styles = useMemo(() => getStyles(colors), [colors]);
  const { t } = useTranslation();
  const { connected, subscriptions, loading, buyPlan } = useIap();
  const [planType, setPlanType] = useState<PlanTypes | null>(null);

  const dispatch = useAppDispatch();
  const user = useSelector((s: RootState) => s.user.value);
  const plan = useSelector((s: RootState) => s.plan.value);

  useEffect(() => {
    console.log("colorScheme", colorScheme);
    console.log("colors", colors);
  }, []);

  useEffect(() => {
    (async () => {
      await getPlanType();
      await getPlan();
    })();
  }, []);

  const getPlan = useCallback(async () => {
    try {
      await dispatch(getUserPlan()).unwrap();
    } catch (err: any) {
      console.error("Error get plan:", err);
      console.error("Error get plan response:", err.response);
    }
  }, []);

  const getPlanType = useCallback(async () => {
    try {
      const res = await getPlanTypeApi();

      setPlanType(res);
    } catch (error: any) {
      console.error("Error get plan type:", error);
      console.error("Error get plan type response:", error.response);
      console.error("Error get plan type response data:", error.response.data);
    }
  }, []);

  const saveToDatabase = useCallback(
    async (basePlanId: BasePlanIds) => {
      try {
        await dispatch(saveTrialPlanToDatabase({ basePlanId })).unwrap();

        PlanEvents.emit("planChanged");
        onSuccess?.();
      } catch (error: any) {
        console.error("Error setting plan:", error);
        console.error("Error setting plan response:", error.response);
      } finally {
      }
    },
    [onSuccess],
  );

  const onSelectTrial = useCallback(
    async (basePlanId: BasePlanIds) => {
      await saveToDatabase(basePlanId);
    },
    [saveToDatabase],
  );

  const onSelect = useCallback(
    async (plan: any) => {
      if (!user?.isRegistered && !continueWithoutRegistration) {
        if (ascForRegister) {
          ascForRegister();
          return;
        }
      }
      const resp = await buyPlan(plan.basePlanId, { obfuscatedId: user?.uuid });
      if (resp) {
        dispatch(setPlan(resp));
        PlanEvents.emit("planChanged");
        onSuccess?.();
      }
    },
    [buyPlan],
  );

  const subscription: IapProduct = subscriptions.find(
    (s) => s.id === Subscriptions.NEMORY,
  ) as IapProduct;

  console.log("subscription", subscription);

  const baseSubPlans = subscription?.subscriptionOfferDetailsAndroid?.map(
    (plan) => {
      return {
        ...plan,
        name: getPlanName(plan.basePlanId as Subscriptions),
        descriptionKey:
          PLANS.find((p) => p.id === plan.basePlanId)?.descriptionKey || "",
        tokensLimit:
          PLANS.find((p) => p.id === plan.basePlanId)?.tokensLimit || "",
      };
    },
  );

  return (
    <View style={styles.container}>
      {loading || !connected ? (
        <View style={styles.loaderWrap}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.plansContainer}>
            {planType === PlanTypes.OPEN_TESTING ||
              planType === PlanTypes.CLOSED_TESTING ||
              (planType === PlanTypes.INTERNAL_TESTING && (
                <TouchableOpacity
                  onPress={() => onSelectTrial(BasePlanIds.TESTING)}
                  disabled={plan?.basePlanId === BasePlanIds.TESTING}
                >
                  <View
                    style={[
                      styles.card,
                      {
                        borderColor:
                          plan && plan.basePlanId === BasePlanIds.TESTING
                            ? colors.primary
                            : "transparent",
                      },
                    ]}
                  >
                    <View style={styles.cardInner}>
                      <ThemedText type="subtitleLG">
                        {t("planModal.forTesting")}
                      </ThemedText>
                      {plan && plan.basePlanId === BasePlanIds.TESTING && (
                        <View
                          style={[
                            styles.status,
                            {
                              backgroundColor: getStatusColor(plan.planStatus!),
                            },
                          ]}
                        >
                          <ThemedText
                            style={{
                              color: colors.textInPrimary,
                            }}
                          >
                            {plan.planStatus}
                          </ThemedText>
                        </View>
                      )}
                    </View>
                    <ThemedText style={styles.desc}>
                      {t("planModal.forTesting")}
                    </ThemedText>
                    <ThemedText type="subtitleLG" style={styles.price}>
                      {t("planModal.freeForTesting")}
                    </ThemedText>
                    <ThemedText style={styles.tokens}>
                      800 000 {t("planModal.tokens")}
                    </ThemedText>
                  </View>
                </TouchableOpacity>
              ))}
            {((!plan && planType === PlanTypes.PRODUCTION) ||
              (plan &&
                planType === PlanTypes.PRODUCTION &&
                plan.basePlanId === BasePlanIds.START)) && (
              <TouchableOpacity
                onPress={() => onSelectTrial(BasePlanIds.START)}
                disabled={plan?.basePlanId === BasePlanIds.START}
              >
                <View
                  style={[
                    styles.card,
                    {
                      borderColor:
                        plan && plan.basePlanId === BasePlanIds.START
                          ? colors.primary
                          : "transparent",
                    },
                  ]}
                >
                  <View style={styles.cardInner}>
                    <ThemedText type="subtitleLG">Start</ThemedText>
                    {plan && plan.basePlanId === BasePlanIds.START && (
                      <View
                        style={[
                          styles.status,
                          {
                            backgroundColor: getStatusColor(plan.planStatus!),
                          },
                        ]}
                      >
                        <ThemedText
                          style={{
                            color: colors.textInPrimary,
                          }}
                        >
                          {plan.planStatus}
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

            {baseSubPlans?.map((p) => {
              return (
                <TouchableOpacity
                  key={p.basePlanId}
                  disabled={plan?.basePlanId === p.basePlanId}
                  onPress={() => onSelect(p)}
                >
                  <View
                    style={[
                      styles.card,
                      {
                        borderColor:
                          plan && p.basePlanId === plan.basePlanId
                            ? colors.primary
                            : "transparent",
                      },
                    ]}
                  >
                    <View style={styles.cardInner}>
                      <ThemedText type="subtitleLG">{p.name}</ThemedText>
                      {plan && p.basePlanId === plan.basePlanId && (
                        <View
                          style={[
                            styles.status,
                            {
                              backgroundColor: getStatusColor(plan.planStatus!),
                            },
                          ]}
                        >
                          <ThemedText
                            style={{
                              color: colors.textInPrimary,
                            }}
                          >
                            {plan.planStatus}
                          </ThemedText>
                        </View>
                      )}
                    </View>
                    <ThemedText style={styles.desc}>
                      {t(p.descriptionKey)}
                    </ThemedText>
                    <ThemedText type="subtitleLG" style={styles.price}>
                      {`${p.pricingPhases.pricingPhaseList[0].formattedPrice} / ${t("planModal.month")}`}
                    </ThemedText>
                    <ThemedText style={styles.tokens}>
                      {p.tokensLimit.toLocaleString()}{" "}
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
