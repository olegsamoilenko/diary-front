import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import type { User, UserSettings, Plan } from "@/types";

const USER_KEY = "user";
const SETTINGS_KEY = "settings";
const PLAN_KEY = "plan";
const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";
const PIN_KEY = "user_pin";
const BIOMETRY_KEY = "biometry_enabled";
const REGISTER_OR_NOT = "register_or_not";
const DEVICE_ID_KEY = "device_id";

export async function loadRegisterOrNot(): Promise<boolean> {
  const raw = await AsyncStorage.getItem(REGISTER_OR_NOT);
  return raw === null ? true : raw === "true";
}

export async function saveRegisterOrNot(value: boolean) {
  await AsyncStorage.setItem(REGISTER_OR_NOT, value ? "true" : "false");
}

export async function loadPin(): Promise<string | null> {
  return await SecureStore.getItemAsync(PIN_KEY);
}

export async function savePin(pin: string | null) {
  if (pin) await SecureStore.setItemAsync(PIN_KEY, pin);
  else await SecureStore.deleteItemAsync(PIN_KEY);
}

export async function loadBiometryEnabled(): Promise<boolean> {
  const raw = await SecureStore.getItemAsync(BIOMETRY_KEY);
  return raw === "true";
}

export async function saveBiometryEnabled(enabled: boolean) {
  await SecureStore.setItemAsync(BIOMETRY_KEY, enabled ? "true" : "false");
}

export async function loadAccessToken(): Promise<string | null> {
  return await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
}
export async function saveAccessToken(token: string | null) {
  if (token) await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, token);
  else await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
}

export async function loadRefreshToken(): Promise<string | null> {
  return await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
}
export async function saveRefreshToken(token: string | null) {
  if (token) await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, token);
  else await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
}

export async function loadDeviceId(): Promise<string | null> {
  return await SecureStore.getItemAsync(DEVICE_ID_KEY);
}
export async function saveDeviceId(token: string | null) {
  if (token) await SecureStore.setItemAsync(DEVICE_ID_KEY, token);
  else await SecureStore.deleteItemAsync(DEVICE_ID_KEY);
}

export async function loadUser(): Promise<User | null> {
  const raw = await SecureStore.getItemAsync(USER_KEY);
  return raw ? (JSON.parse(raw) as User) : null;
}
export async function saveUser(user: User | null) {
  if (user) await SecureStore.setItemAsync(USER_KEY, JSON.stringify(user));
  else await SecureStore.deleteItemAsync(USER_KEY);
}

export async function loadSettings(): Promise<UserSettings | null> {
  const raw = await AsyncStorage.getItem(SETTINGS_KEY);
  return raw ? (JSON.parse(raw) as UserSettings) : null;
}
export async function saveSettings(settings: UserSettings | null) {
  if (settings)
    await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  else await AsyncStorage.removeItem(SETTINGS_KEY);
}

export async function loadPlan(): Promise<Plan | null> {
  const raw = await AsyncStorage.getItem(PLAN_KEY);
  return raw ? (JSON.parse(raw) as Plan) : null;
}
export async function savePlan(plan: Plan | null) {
  if (plan) await AsyncStorage.setItem(PLAN_KEY, JSON.stringify(plan));
  else await AsyncStorage.removeItem(PLAN_KEY);
}

export async function clearAuthBundle() {
  await Promise.all([
    SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY),
    SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY),
    SecureStore.deleteItemAsync(DEVICE_ID_KEY),
  ]);
}
