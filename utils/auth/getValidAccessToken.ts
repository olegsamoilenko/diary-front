import {
  loadAccessToken,
  loadRefreshToken,
  loadDeviceId,
  loadUser,
  saveAccessToken,
  saveRefreshToken,
  saveDeviceId,
} from "@/utils/store/storage";
import {
  getRefreshing,
  setRefreshing,
  waitForRefresh,
  resolveRefresh,
  callRefresh,
} from "@/utils/api/refreshManager";
import { isExpiredOrNearExpiry } from "@/utils/jwt/jwt";

const API_BASE = process.env.EXPO_PUBLIC_API_URL!;

export async function getValidAccessToken(): Promise<string> {
  const existing = await loadAccessToken();
  if (existing && !isExpiredOrNearExpiry(existing, 30)) {
    return existing;
  }

  if (getRefreshing()) {
    const newAccess = await waitForRefresh();
    if (!newAccess) throw new Error("Refresh failed");
    return newAccess;
  }

  setRefreshing(true);
  try {
    const [refreshToken, deviceId, user] = await Promise.all([
      loadRefreshToken(),
      loadDeviceId(),
      loadUser(),
    ]);

    if (!refreshToken || !deviceId || !user?.id) {
      resolveRefresh("");
      throw new Error("No refresh context");
    }

    const data = await callRefresh(API_BASE, {
      userId: Number(user.id),
      deviceId,
      refreshToken,
    });

    await saveAccessToken(data.accessToken);
    await saveRefreshToken(data.refreshToken);
    await saveDeviceId(data.deviceId);

    resolveRefresh(data.accessToken);
    return data.accessToken;
  } catch (e) {
    resolveRefresh("");
    throw e;
  } finally {
    setRefreshing(false);
  }
}
