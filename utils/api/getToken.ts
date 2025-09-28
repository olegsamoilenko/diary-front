import * as SecureStore from "expo-secure-store";
import axios, { isAxiosError } from "axios";
import { apiUrl } from "@/constants/env";
import Toast from "react-native-toast-message";

export const getToken = async (): Promise<string | null> => {
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
        if (isAxiosError(err)) {
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
        return null;
      }
    }
  }
  return token;
};

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
  } catch (e: any) {
    return true;
  }
}
