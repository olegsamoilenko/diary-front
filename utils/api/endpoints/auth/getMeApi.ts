import { apiRequest } from "@/utils/api/apiRequest";
import type { Plan, User, UserSettings } from "@/types";

export async function getMeApi(hash: string) {
  try {
    const res = await apiRequest({
      url: `/users/me`,
      method: "POST",
      data: { hash },
    });
    if (res?.status !== 201 && res?.status !== 200) return null;
    return res.data as {
      user?: User;
      plan?: Plan;
      settings?: UserSettings;
    };
  } catch (err: any) {
    console.log("Get me error response", err.response);
    throw err;
  }
}
