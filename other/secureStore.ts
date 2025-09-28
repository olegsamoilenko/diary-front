import { Platform } from "react-native";
import * as ExpoSecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";

export async function getItemAsync(key: string): Promise<string | null> {
  if (Platform.OS === "web") {
    return await AsyncStorage.getItem(key);
  } else {
    return await ExpoSecureStore.getItemAsync(key);
  }
}

export async function setItemAsync(key: string, value: any): Promise<void> {
  if (Platform.OS === "web") {
    return await AsyncStorage.setItem(key, value);
  } else {
    await ExpoSecureStore.setItemAsync(key, value);
  }
}

export async function deleteItemAsync(key: string): Promise<void> {
  if (Platform.OS === "web") {
    return await AsyncStorage.removeItem(key);
  } else {
    await ExpoSecureStore.deleteItemAsync(key);
  }
}

// export async function isAvailableAsync(): Promise<boolean> {
//   if (Platform.OS === "web") {
//     return true;
//   } else {
//     return await ExpoSecureStore.isAvailableAsync();
//   }
// }
