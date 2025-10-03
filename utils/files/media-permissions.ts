import * as MediaLibrary from "expo-media-library";
import * as SecureStore from "expo-secure-store";
import { Linking, Platform } from "react-native";

const ASKED_KEY = "media_perm_asked_once";

export type MediaAccess = "all" | "none";

function grantedOrLimited(p: MediaLibrary.PermissionResponse): boolean {
  if (p.granted) return true;
  if (Platform.OS === "ios" && "accessPrivileges" in p) {
    const ap = (p as any).accessPrivileges as
      | "all"
      | "limited"
      | "none"
      | undefined;
    return ap === "limited" || ap === "all";
  }
  return false;
}

export async function getMediaAccess(): Promise<MediaAccess> {
  const p = await MediaLibrary.getPermissionsAsync();
  return grantedOrLimited(p) ? "all" : "none";
}

export async function ensureOneTimeMediaAsk(): Promise<MediaAccess> {
  const asked = await SecureStore.getItemAsync(ASKED_KEY);
  if (!asked) {
    await MediaLibrary.requestPermissionsAsync();
    await SecureStore.setItemAsync(ASKED_KEY, "1");
  }
  return getMediaAccess();
}

export async function ensureMediaAccess(): Promise<MediaAccess> {
  let p = await MediaLibrary.getPermissionsAsync();

  if (!grantedOrLimited(p) && p.canAskAgain) {
    if (Platform.OS === "ios") {
      p = await (MediaLibrary as any).requestPermissionsAsync({
        accessPrivileges: "all",
      });
    } else {
      p = await MediaLibrary.requestPermissionsAsync();
    }
  }

  return grantedOrLimited(p) ? "all" : "none";
}

export async function openAppSettings() {
  if (Platform.OS === "ios") {
    await Linking.openURL("app-settings:");
  } else {
    await Linking.openSettings?.();
  }
}
