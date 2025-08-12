import axios, { AxiosRequestConfig, AxiosResponse, Method } from "axios";
import * as SecureStore from "@/utils/store/secureStore";
import Toast from "react-native-toast-message";
import { apiUrl } from "@/constants/env";
import Constants from "expo-constants";

const apiUrl2 = Constants?.expoConfig?.extra?.API_URL;

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
      const hash = user.hash;
      if (uuid) {
        try {
          const res = await axios.post(apiUrl + "/auth/create-token", {
            uuid,
            hash,
          });
          token = res.data.accessToken as string;
          await SecureStore.setItemAsync("token", token);
        } catch (err: any) {
          if (axios.isAxiosError(err)) {
            if (err.response && err.response.data) {
              const { statusMessage, message } = err.response.data;
              Toast.show({
                type: "error",
                text1: statusMessage || "Server error",
                text2: message || "Unknown error from server",
              });
              console.error("Axios response error:", err.response.data);
            } else if (err.request) {
              Toast.show({
                type: "error",
                text1: "Network error",
                text2: "No response from server. Check your connection.",
              });
              console.error("Axios request error:", err.request);
            } else {
              Toast.show({
                type: "error",
                text1: "Request error",
                text2: err.message,
              });
              console.error("Axios config error:", err.message);
            }
          } else {
            Toast.show({
              type: "error",
              text1: "Unexpected error",
              text2: String(err),
            });
            console.error("Unexpected error:", err);
          }
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
  } catch (err) {
    if (axios.isAxiosError(err)) {
      if (!err.response) {
        console.error("Network or Axios error:", err.message, err.code);
        Toast.show({
          type: "error",
          text1: "Network Error",
          text2: err.message,
        });
        throw err;
      }

      const status = err.response.status;
      const statusText = err.response.statusText;
      const errorMessage =
        err.response.data?.message || err.response.data?.error || statusText;

      console.error(
        `Axios error ${status}: ${errorMessage}`,
        err.response.data,
      );

      Toast.show({
        type: "error",
        text1: `Error ${status}`,
        text2: errorMessage,
      });

      throw err;
    } else {
      console.error("Unexpected Error:", err);
      Toast.show({
        type: "error",
        text1: "Unexpected Error",
        text2: String(err),
      });
      throw new Error("An unexpected error occurred");
    }
  }
}

function isTokenExpired(token: string | null): boolean {
  if (!token) return false;
  try {
    const payload = token.split(".")[1];
    if (!payload) return false;

    const decoded = JSON.parse(
      atob(payload.replace(/-/g, "+").replace(/_/g, "/")),
    );

    const exp = decoded.exp;
    if (!exp) return false;

    const now = Math.floor(Date.now() / 1000);

    return now >= exp;
  } catch (e) {
    return true;
  }
}
