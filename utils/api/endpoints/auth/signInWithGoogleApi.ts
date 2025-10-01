import { apiRequest } from "@/utils/api/apiRequest";
import type { Plan, User, UserSettings } from "@/types";
import {
  ensureDeviceKeypair,
  getDevicePublicKey,
} from "@/utils/auth/deviceKeys";
import { loadDeviceId } from "@/utils/store/storage";

export async function signInWithGoogleApi(
  userId: number,
  uuid: string,
  idToken: string,
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
      url: `/auth/sign-in-with-google`,
      method: "POST",
      data: {
        userId,
        uuid,
        idToken,
        deviceId,
        devicePubKey,
      },
    });
    if (res?.status !== 201 && res?.status !== 200) return null;
    return res.data as {
      accessToken: string;
      refreshToken: string;
      deviceId: string;
      user: User;
      plan?: Plan;
      settings?: UserSettings;
    };
  } catch (err: any) {
    console.error("signInWithGoogleApi error response", err.response);
    throw err;
  }
}
