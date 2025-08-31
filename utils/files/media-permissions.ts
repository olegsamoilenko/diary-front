import * as MediaLibrary from "expo-media-library";
import * as SecureStore from "@/utils/store/secureStore";

const ASKED_KEY = "media_perm_asked_once";

export type MediaAccess = "all" | "none";

export async function getMediaAccess(): Promise<MediaAccess> {
  const perm = await MediaLibrary.getPermissionsAsync();
  return perm.granted ? "all" : "none";
}

export async function ensureOneTimeMediaAsk(): Promise<MediaAccess> {
  const asked = await SecureStore.getItemAsync(ASKED_KEY);
  if (!asked) {
    await MediaLibrary.requestPermissionsAsync();
    await SecureStore.setItemAsync(ASKED_KEY, "1");
  }
  return getMediaAccess();
}
