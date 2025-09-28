import { createAsyncThunk } from "@reduxjs/toolkit";
import { deleteAccountApi } from "@/utils/api/endpoints/auth/deleteAccountApi";
import { resetUser } from "@/store/slices/userSlice";
import { CodeStatus, StatusCode } from "@/types";
import type { Rejected } from "@/types";
import { resetPlan } from "@/store/slices/planSlice";
import { resetSettings } from "@/store/slices/settingsSlice";
import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { unstable_batchedUpdates } from "react-native";
import { store } from "@/store";

type Args = {
  email: string;
  code: string;
};

type Resp = {
  status: CodeStatus | StatusCode;
};

export const deleteAccount = createAsyncThunk<
  Resp,
  Args,
  { rejectValue: Rejected }
>(
  "auth/deleteAccount",
  async ({ email, code }, { dispatch, rejectWithValue }) => {
    try {
      const data = await deleteAccountApi(email, code);

      const status = data?.status as CodeStatus | StatusCode | undefined;
      if (!status) {
        return rejectWithValue({
          message: "DeleteAccount: bad server response (no status)",
        });
      }

      await Promise.allSettled([
        SecureStore.deleteItemAsync("access_token"),
        SecureStore.deleteItemAsync("refresh_token"),
        SecureStore.deleteItemAsync("device_id"),
        SecureStore.deleteItemAsync("user"),
        SecureStore.deleteItemAsync("user_pin"),
        SecureStore.deleteItemAsync("biometry_enabled"),
        SecureStore.deleteItemAsync("device_sk_b64"),
        SecureStore.deleteItemAsync("device_pk_b64"),
        AsyncStorage.removeItem("show_welcome"),
        AsyncStorage.removeItem("register_or_not"),
        AsyncStorage.removeItem("plan"),
        AsyncStorage.removeItem("settings"),
      ]);
      unstable_batchedUpdates(() => {
        store.dispatch(resetUser());
        store.dispatch(resetSettings());
        store.dispatch(resetPlan());
      });

      return { status };
    } catch (err: any) {
      const code = err?.response?.data?.code as string | undefined;
      const status = err?.response?.data?.status as
        | CodeStatus
        | StatusCode
        | undefined;
      const msg =
        err?.response?.data?.message ?? err?.message ?? "Delete Account failed";
      return rejectWithValue({ status, message: msg, code });
    }
  },
);
