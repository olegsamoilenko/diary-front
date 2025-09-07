import axios, { AxiosRequestConfig, AxiosResponse, Method } from "axios";
import Toast from "react-native-toast-message";
import { apiUrl } from "@/constants/env";
import Constants from "expo-constants";
import { getToken } from "@/utils/";
import i18n from "@/i18n";
import { ErrorMessages } from "@/types";

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
          text1: i18n.t("errors.networkOrAxiosError"),
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
      console.error(`Axios error response:`, err.response);

      Toast.show({
        type: "error",
        text1: err.response.data.code
          ? i18n.t(
              `errors.${ErrorMessages[err.response.data.code as keyof typeof ErrorMessages]}`,
            )
          : errorMessage
            ? errorMessage
            : i18n.t(`errors.unknownError`),
      });

      throw err;
    } else {
      console.error("Unexpected Error:", err);
      Toast.show({
        type: "error",
        text1: i18n.t(`errors.undefined`),
        text2: String(err),
      });
      throw new Error("An unexpected error occurred");
    }
  }
}
