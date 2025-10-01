import { apiRequest } from "@/utils";
import type { Plan } from "@/types";

export async function getPlanApi() {
  try {
    const res = await apiRequest({
      url: `/plans/get-actual`,
      method: "GET",
    });
    if (res?.status !== 201 && res?.status !== 200) return null;
    return res.data as {
      plan: Plan;
    };
  } catch (err: any) {
    console.error("Get plan error response", err.response);
    throw err;
  }
}
