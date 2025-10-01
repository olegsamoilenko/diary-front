import { apiRequest } from "@/utils";
import type { UserSettings } from "@/types";

export async function updateSettingsApi(data: Partial<UserSettings>) {
  try {
    const res = await apiRequest({
      url: `/users/update-settings`,
      method: "POST",
      data,
    });
    if (res?.status !== 201 && res?.status !== 200) return null;
    return res.data as UserSettings;
  } catch (err: any) {
    console.error("Get plan error response", err.response);
    throw err;
  }
}
