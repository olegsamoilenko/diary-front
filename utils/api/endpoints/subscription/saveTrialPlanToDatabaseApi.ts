import { apiRequest } from "@/utils";
import { BasePlanIds, PlanStatus, Subscriptions } from "@/types";
import type { Plan } from "@/types";
import { Platform } from "react-native";
import * as Localization from "expo-localization";

export async function saveTrialPlanToDatabaseApi(basePlanId: BasePlanIds) {
  const now = new Date();
  const expiry =
    basePlanId === BasePlanIds.START
      ? new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
      : null;
  const locales = Localization.getLocales();
  const regionCode = locales[0].regionCode;

  const data = {
    subscriptionId: Subscriptions.NEMORY,
    basePlanId,
    startTime: now.toISOString(),
    expiryTime: expiry ? expiry.toISOString() : null,
    planStatus: PlanStatus.ACTIVE,
    autoRenewEnabled: false,
    platform: Platform.OS,
    regionCode: regionCode ?? null,
    price: 0,
  };

  try {
    const res = await apiRequest({
      url: `/plans/subscribe`,
      method: "POST",
      data,
    });
    if (res?.status !== 201 && res?.status !== 200) return null;
    return res.data as {
      plan: Plan;
    };
  } catch (err: any) {
    console.log("Save trial plan error response", err.response);
    throw err;
  }
}
