import { createAsyncThunk } from "@reduxjs/toolkit";
import { createAnonymousUserApi } from "@/utils/api/endpoints/auth/createAnonymousUserApi";
import { setUser } from "@/store/slices/userSlice";
import { setPlan } from "@/store/slices/planSlice";
import { setSettings } from "@/store/slices/settingsSlice";
import {
  saveAccessToken,
  saveRefreshToken,
  saveDeviceId,
} from "@/utils/store/storage";
import { logStoredUserData } from "@/utils/storedUserData";

export const initAnonymousUser = createAsyncThunk(
  "auth/initAnonymousUser",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const data = await createAnonymousUserApi();
      if (!data) return null;

      await saveAccessToken(data.accessToken);
      await saveRefreshToken(data.refreshToken);
      await saveDeviceId(data.deviceId);
      dispatch(setUser(data.user));
      if (data.plan) dispatch(setPlan(data.plan));
      if (data.settings) dispatch(setSettings(data.settings));

      return data.user;
    } catch (err: any) {
      const code = err?.response?.data?.code as string | undefined;
      const msg =
        err?.response?.data?.message ??
        err?.message ??
        "Init anonymous user failed";
      return rejectWithValue({ message: msg, code });
    }
  },
);
