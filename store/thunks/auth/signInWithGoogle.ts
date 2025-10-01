import { createAsyncThunk } from "@reduxjs/toolkit";
import { signInWithGoogleApi } from "@/utils/api/endpoints/auth/signInWithGoogleApi";
import { setUser } from "@/store/slices/userSlice";
import { setPlan } from "@/store/slices/planSlice";
import { setSettings } from "@/store/slices/settingsSlice";
import {
  saveAccessToken,
  saveRefreshToken,
  saveDeviceId,
} from "@/utils/store/storage";
import { logStoredUserData } from "@/utils/storedUserData";
import { CodeStatus, Rejected, StatusCode } from "@/types";

type Args = {
  userId: number;
  uuid: string;
  idToken: string;
};

type Resp = void;

export const signInWithGoogle = createAsyncThunk<
  Resp,
  Args,
  { rejectValue: Rejected }
>(
  "auth/signInWithGoogle",
  async ({ userId, uuid, idToken }, { dispatch, rejectWithValue }) => {
    try {
      const data = await signInWithGoogleApi(userId, uuid, idToken);

      if (!data) {
        return rejectWithValue({
          message: "signInWithGoogle No response from server",
        });
      }

      await saveAccessToken(data.accessToken);
      await saveRefreshToken(data.refreshToken);
      await saveDeviceId(data.deviceId);
      dispatch(setUser(data.user));
      if (data.plan) dispatch(setPlan(data.plan));
      if (data.settings) dispatch(setSettings(data.settings));
    } catch (err: any) {
      const code = err?.response?.data?.code as string | undefined;
      const status = err?.response?.data?.status as
        | CodeStatus
        | StatusCode
        | undefined;
      const msg =
        err?.response?.data?.message ??
        err?.message ??
        "signInWithGoogle failed";
      return rejectWithValue({ status, message: msg, code });
    }
  },
);
