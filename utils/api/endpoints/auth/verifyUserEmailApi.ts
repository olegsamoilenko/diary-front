import { apiRequest } from "@/utils";
import type { User } from "@/types";
import {
  ensureDeviceKeypair,
  getDevicePublicKey,
} from "@/utils/auth/deviceKeys";
import { loadDeviceId } from "@/utils/store/storage";

export async function verifyUserEmailApi(
  email: string,
  code: string,
  type?: "register_email" | "email_change",
) {
  let devicePubKey: string | null = null;
  try {
    await ensureDeviceKeypair();
    devicePubKey = await getDevicePublicKey();
  } catch (e) {
    console.log("ensureDeviceKeypair failed:", e);
  }
  const deviceId = await loadDeviceId();
  try {
    const res = await apiRequest({
      url: `/auth/confirm-email`,
      method: "POST",
      data: { email, code, type, deviceId, devicePubKey },
    });
    if (res?.status !== 201 && res?.status !== 200) return null;
    return res.data as {
      message: string;
      accessToken: string;
      refreshToken: string;
      deviceId: string;
      user: User;
    };
  } catch (err: any) {
    console.log("Verify user email response", err.response);
    throw err;
  }
}
