import { createAsyncThunk } from "@reduxjs/toolkit";
import { registerUserApi } from "@/utils/api/endpoints/auth/registerUserApi";
import { setUser } from "@/store/slices/userSlice";
import { CodeStatus, StatusCode } from "@/types";
import type { User, Rejected } from "@/types";

type RegisterArgs = {
  email: string;
  password: string;
  lang: string;
  uuid: string;
};

type RegisterResp = {
  status: CodeStatus;
  retryAfterSec: number;
  user: User;
};

export const registerUser = createAsyncThunk<
  RegisterResp,
  RegisterArgs,
  { rejectValue: Rejected }
>(
  "auth/registerUser",
  async ({ email, password, lang, uuid }, { dispatch, rejectWithValue }) => {
    try {
      const data = await registerUserApi(email, password, lang, uuid);

      if (!data) {
        return rejectWithValue({
          message: "Register No response from server",
        });
      }

      if (data.status === CodeStatus.COOLDOWN) {
        return rejectWithValue({
          message: "COOLDOWN",
          status: CodeStatus.COOLDOWN,
          retryAfterSec: data.retryAfterSec,
        });
      }
      dispatch(setUser(data.user));

      return data;
    } catch (err: any) {
      const code = err?.response?.data?.code as string | undefined;
      const status = err?.response?.data?.status as
        | CodeStatus
        | StatusCode
        | undefined;
      const msg =
        err?.response?.data?.message ?? err?.message ?? "Registration failed";
      return rejectWithValue({ status, message: msg, code });
    }
  },
);
