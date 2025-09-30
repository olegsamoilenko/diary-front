import { createAsyncThunk } from "@reduxjs/toolkit";
import { verifyUserEmailApi } from "@/utils/api/endpoints/auth/verifyUserEmailApi";
import { setUser } from "@/store/slices/userSlice";
import { CodeStatus, StatusCode } from "@/types";
import type { User, Rejected } from "@/types";
import {
  saveAccessToken,
  saveRefreshToken,
  saveDeviceId,
} from "@/utils/store/storage";

type RegisterArgs = {
  email: string;
  code: string;
  type?: "register_email" | "email_change";
};

type RegisterResp = {
  message: string;
  accessToken: string;
  user: User;
};

type VerifyType = "register_email" | "email_change";

export const verifyUserEmail = createAsyncThunk<
  RegisterResp,
  RegisterArgs,
  { rejectValue: Rejected }
>(
  "auth/verifyUserEmail",
  async ({ email, code, type }, { dispatch, rejectWithValue }) => {
    const t: VerifyType = type ?? "register_email";
    try {
      const data = await verifyUserEmailApi(email, code, t);

      if (!data) {
        return rejectWithValue({
          message: "verifyUserEmail No response from server",
        });
      }

      await saveAccessToken(data.accessToken);
      await saveRefreshToken(data.refreshToken);
      await saveDeviceId(data.deviceId);

      dispatch(setUser(data.user));

      return data;
    } catch (err: any) {
      const code = err?.response?.data?.code as string | undefined;
      const status = err?.response?.data?.status as
        | CodeStatus
        | StatusCode
        | undefined;
      const msg =
        err?.response?.data?.message ?? err?.message ?? "Verify email failed";
      return rejectWithValue({ status, message: msg, code });
    }
  },
);
