import i18n from "i18next";
import { Appearance, Platform } from "react-native";
import * as Localization from "expo-localization";
import uuid from "react-native-uuid";
import { apiRequest } from "@/utils/api/apiRequest";
import type { Plan, User, UserSettings } from "@/types";
import {
  ensureDeviceKeypair,
  getDevicePublicKey,
} from "@/utils/auth/deviceKeys";

export async function createAnonymousUserApi() {
  const lang = i18n.language;
  const theme = Appearance.getColorScheme();
  const platform = Platform.OS;
  const regionCode = Localization.getLocales()[0]?.regionCode;

  let devicePubKey: string | null = null;
  try {
    await ensureDeviceKeypair();
    devicePubKey = await getDevicePublicKey();
  } catch (e) {
    console.log("ensureDeviceKeypair failed:", e);
  }

  try {
    const res = await apiRequest({
      url: `/users/create-by-uuid`,
      method: "POST",
      data: {
        uuid: uuid.v4(),
        lang,
        theme,
        platform,
        regionCode,
        devicePubKey,
      },
    });
    if (res?.status !== 201) return null;
    return res.data as {
      accessToken: string;
      refreshToken: string;
      deviceId: string;
      user: User;
      plan?: Plan;
      settings?: UserSettings;
    };
  } catch (err: any) {
    console.log("Create anonymous user error response", err.response);
    throw err;
  }
}
