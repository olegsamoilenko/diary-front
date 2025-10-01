import { apiRequest } from "@/utils";
import { PlanTypes } from "@/types";

export async function getPlanTypeApi() {
  try {
    const res = await apiRequest({
      url: `/plans/plan-type`,
      method: "GET",
    });
    if (res?.status !== 201 && res?.status !== 200) return null;
    return res.data as PlanTypes;
  } catch (err: any) {
    console.error("Get plan type error response", err.response);
    throw err;
  }
}
