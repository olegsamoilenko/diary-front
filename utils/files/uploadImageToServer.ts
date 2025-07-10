import * as SecureStore from "@/utils/store/secureStore";
import { Platform } from "react-native";
import { apiRequest } from "@/utils";

export async function uploadImageToServer(localUri: string) {
  const user = await SecureStore.getItemAsync("user");
  const formData = new FormData();
  formData.append("file", {
    uri: Platform.OS === "android" ? localUri : localUri.replace("file://", ""),
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
