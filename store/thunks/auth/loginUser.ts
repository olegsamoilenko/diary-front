import { createAsyncThunk } from "@reduxjs/toolkit";
import { loginUserApi } from "@/utils/api/endpoints/auth/loginUserApi";
import { setUser } from "@/store/slices/userSlice";
import { CodeStatus, StatusCode } from "@/types";
import type { User, Rejected, Plan, UserSettings } from "@/types";
import {
  saveAccessToken,
  saveDeviceId,
  saveRefreshToken,
} from "@/utils/store/storage";
import { setPlan } from "@/store/slices/planSlice";
import { setSettings } from "@/store/slices/settingsSlice";

type RegisterArgs = {
  email: string;
  password: string;
  uuid: string;
};

type RegisterResp = {
  accessToken: string;
  user: User;
  plan: Plan;
  settings: UserSettings;
};

export const loginUser = createAsyncThunk<
  RegisterResp,
  RegisterArgs,
  { rejectValue: Rejected }
>(
  "auth/loginUser",
  async ({ email, password, uuid }, { dispatch, rejectWithValue }) => {
    try {
      const data = await loginUserApi(email, password, uuid);

      if (!data) {
        return rejectWithValue({
          message: "Login No response from server",
        });
      }

      await saveAccessToken(data.accessToken);
      await saveRefreshToken(data.refreshToken);
      await saveDeviceId(data.deviceId);

      dispatch(setUser(data.user));
      if (data.plan) dispatch(setPlan(data.plan));
      if (data.settings) dispatch(setSettings(data.settings));

      return data;
    } catch (err: any) {
      const code = err?.response?.data?.code as string | undefined;
      const status = err?.response?.data?.status as
        | CodeStatus
        | StatusCode
        | undefined;
      const msg =
        err?.response?.data?.message ?? err?.message ?? "Login failed";
      return rejectWithValue({ status, message: msg, code });
    }
  },
);
