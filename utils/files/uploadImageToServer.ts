import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";
import { apiRequest } from "@/utils";
import { EPlatform } from "@/types";

export async function uploadImageToServer(localUri: string) {
  const user = await SecureStore.getItemAsync("user");
  const formData = new FormData();
  formData.append("file", {
    uri:
      Platform.OS === EPlatform.ANDROID
        ? localUri
        : localUri.replace("file://", ""),
    name: `/user-${JSON.parse(user!).id}/image_${Date.now()}.jpg`,
    type: "image/jpeg",
  } as any);

  const response = await apiRequest({
    url: `/files/upload`,
    method: "POST",
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data",
      "x-amz-checksum-crc32": null,
    },
  });
  return await response.data;
}
