import axios, { AxiosRequestConfig, AxiosResponse, Method } from "axios";
import Toast from "react-native-toast-message";
import { apiUrl } from "@/constants/env";
import Constants from "expo-constants";
import { loadAccessToken } from "@/utils/store/storage";
import i18n from "@/i18n";
import { ErrorMessages } from "@/types";
import { apiClient } from "./apiClient";

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
    const requestConfig: AxiosRequestConfig = {
      url,
      method,
      data,
      params,
      headers: headers ?? undefined,
      ...config,
    };
    return await apiClient<T>(requestConfig);
  } catch (err: any) {
    console.error("API Request Error:", err.response);
    if (err.isAxiosError) {
      if (!err.response) {
        Toast.show({
          type: "error",
          text1: i18n.t("errors.networkOrAxiosError"),
          text2: err.message,
        });
        throw err;
      }
      const statusText = err.response.statusText;
      const errorMessage =
        err.response.data?.message || err.response.data?.error || statusText;

      Toast.show({
        type: "error",
        text1: err.response.data?.code
          ? i18n.t(
              `errors.${
                ErrorMessages[
                  err.response.data.code as keyof typeof ErrorMessages
                ]
              }`,
            )
          : errorMessage || i18n.t(`errors.unknownError`),
      });
      throw err;
    } else {
      Toast.show({
        type: "error",
        text1: i18n.t(`errors.undefined`),
        text2: String(err),
      });
      throw new Error("An unexpected error occurred");
    }
  }
}
