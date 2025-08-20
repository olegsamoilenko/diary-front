import axios, { AxiosRequestConfig, AxiosResponse, Method } from "axios";
import Toast from "react-native-toast-message";
import { apiUrl } from "@/constants/env";
import Constants from "expo-constants";
import { getToken } from "@/utils/";

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
    const token = await getToken();

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
        text1: err.response.data.statusMessage
          ? `${err.response.data.statusMessage}`
          : "Unknown Error",
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
