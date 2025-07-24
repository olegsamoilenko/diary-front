import axios, { AxiosRequestConfig, AxiosResponse, Method } from "axios";
import * as SecureStore from "@/utils/store/secureStore";
import Constants from "expo-constants";
import Toast from "react-native-toast-message";

const apiUrl = Constants.expoConfig?.extra?.API_URL;

export interface ApiRequestOptions
  extends Omit<
    AxiosRequestConfig,
    "url" | "method" | "headers" | "data" | "params"
  > {
  url: string;
  method?: Method;
  data?: any;
  params?: Record<string, any>;
  headers?: Record<string, string | null>;
  config?: AxiosRequestConfig;
}

export async function apiRequest<T = any>({
  url,
  method = "get",
  data,
  params,
  headers = {},
  config = {},
}: ApiRequestOptions): Promise<AxiosResponse<T>> {
  try {
    let token = await SecureStore.getItemAsync("token");

    if (isTokenExpired(token)) {
      const userRaw = await SecureStore.getItemAsync("user");
      const user = userRaw ? JSON.parse(userRaw) : {};
      const uuid = user.uuid;
      if (uuid) {
        try {
          const res = await axios.post(apiUrl + "/auth/create-token", { uuid });
          token = res.data.accessToken as string;
          await SecureStore.setItemAsync("token", token);
        } catch (err: any) {
          console.log(err?.response?.data);
          Toast.show({
            type: "error",
            text1: err?.response?.data.statusMessage,
            text2: err?.response?.data.message,
          });
        }
      }
    }

    const mergedHeaders: Record<string, string> = {
      ...(headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    if (!mergedHeaders["Content-Type"]) {
      mergedHeaders["Content-Type"] = "application/json";
    }

    const requestConfig: AxiosRequestConfig = {
      url: apiUrl + url,
      method,
      data,
      params,
      headers: mergedHeaders,
      ...config,
    };

    return await axios<T>(requestConfig);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(error);
      throw error;
    } else {
      console.error("Unexpected Error:", error);
      throw new Error("An unexpected error occurred");
    }
  }
}

function isTokenExpired(token: string | null): boolean {
  if (!token) return true;
  try {
    const payload = token.split(".")[1];
    if (!payload) return true;

    const decoded = JSON.parse(
      atob(payload.replace(/-/g, "+").replace(/_/g, "/")),
    );

    const exp = decoded.exp;
    if (!exp) return true;

    const now = Math.floor(Date.now() / 1000);

    return now >= exp;
  } catch (e) {
    return true;
  }
}
