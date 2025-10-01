import axios, {
  AxiosError,
  InternalAxiosRequestConfig,
  AxiosHeaders,
} from "axios";
import {
  loadAccessToken,
  saveAccessToken,
  loadRefreshToken,
  saveRefreshToken,
  loadDeviceId,
  saveDeviceId,
  loadUser,
} from "@/utils/store/storage";
import {
  ensureAxiosHeaders,
  setAuthHeader,
  ensureJsonContentType,
} from "./headers";
import {
  getRefreshing,
  setRefreshing,
  waitForRefresh,
  resolveRefresh,
  callRefresh,
} from "./refreshManager";
import { buildUserAgent } from "../auth/buildUserAgent";
import { isExpiredOrNearExpiry } from "@/utils/jwt/jwt";
import { getValidAccessToken } from "@/utils/auth/getValidAccessToken";

const API_BASE = process.env.EXPO_PUBLIC_API_URL;

export const apiClient = axios.create({
  baseURL: API_BASE,
});

apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const headers = ensureAxiosHeaders(config);

    const access = await loadAccessToken();
    if (access && isExpiredOrNearExpiry(access, 30)) {
      try {
        await getValidAccessToken();
      } catch {}
    }
    const fresh = await loadAccessToken();
    if (fresh) setAuthHeader(config, fresh);
    ensureJsonContentType(config);

    headers.set("X-Client-UA", buildUserAgent());
    return config;
  },
);

apiClient.interceptors.response.use(
  (r) => r,
  async (error: AxiosError) => {
    const original = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (error.response?.status !== 401 || original?._retry) {
      throw error;
    }
    original._retry = true;

    if (getRefreshing()) {
      const newAccess = await waitForRefresh();
      if (newAccess) {
        setAuthHeader(original, newAccess);
        return apiClient(original);
      }
      throw error;
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
        throw error;
      }

      const data = await callRefresh(API_BASE!, {
        userId: Number(user.id),
        deviceId,
        refreshToken,
      });

      await saveAccessToken(data.accessToken);
      await saveRefreshToken(data.refreshToken);
      await saveDeviceId(data.deviceId);

      resolveRefresh(data.accessToken);

      setAuthHeader(original, data.accessToken);
      return apiClient(original);
    } catch (e) {
      resolveRefresh("");
      throw e;
    } finally {
      setRefreshing(false);
    }
  },
);
