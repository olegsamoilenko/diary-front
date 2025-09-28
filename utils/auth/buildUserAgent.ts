import * as Application from "expo-application";
import * as Device from "expo-device";
import { Platform } from "react-native";
import * as Localization from "expo-localization";

export function buildUserAgent() {
  const appName = Application.applicationName ?? "App";
  const appVersion = Application.nativeApplicationVersion ?? "0";
  const build = Application.nativeBuildVersion ?? "0";
  const os = Platform.OS;
  const osVer =
    os === "ios"
      ? (Device.osVersion ?? "")
      : // Android
        (Device.osInternalBuildId ?? Device.osBuildId ?? "") ||
        (Device.osVersion ?? "");
  const model = Device.modelName ?? "unknown";
  const locale = Localization.getLocales()[0]?.languageTag ?? "en-US";

  return `${appName}/${appVersion} (${os} ${osVer}; ${model}) build ${build}; locale ${locale}`;
}
