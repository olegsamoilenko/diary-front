import { apiRequest } from "@/utils";
import type { User, Plan, UserSettings } from "@/types";
import {
  ensureDeviceKeypair,
  getDevicePublicKey,
} from "@/utils/auth/deviceKeys";
import { loadDeviceId } from "@/utils/store/storage";

export async function loginUserApi(
  email: string,
  password: string,
  uuid: string,
) {
  let devicePubKey: string | null = null;
  try {
    await ensureDeviceKeypair();
    devicePubKey = await getDevicePublicKey();
  } catch (e) {
    console.error("ensureDeviceKeypair failed:", e);
  }

  const deviceId = await loadDeviceId();

  try {
    const res = await apiRequest({
      url: `/auth/login`,
      method: "POST",
      data: { email, password, uuid, deviceId, devicePubKey },
    });
    if (res?.status !== 201 && res?.status !== 200) return null;
    return res.data as {
      accessToken: string;
      refreshToken: string;
      deviceId: string;
      user: User;
      plan: Plan;
      settings: UserSettings;
    };
  } catch (err: any) {
    console.error("Login user error response", err.response);
    throw err;
  }
}
