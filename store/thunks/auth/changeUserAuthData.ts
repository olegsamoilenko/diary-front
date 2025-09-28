import { createAsyncThunk } from "@reduxjs/toolkit";
import { changeUserAuthDataApi } from "@/utils/api/endpoints/auth/changeUserAuthDataApi";
import { setUser } from "@/store/slices/userSlice";
import { CodeStatus, StatusCode } from "@/types";
import type { User, Rejected } from "@/types";
import { loadUser } from "@/utils/store/storage";

type Args = Partial<User>;

type Resp = {
  user: User | null;
  status: StatusCode | CodeStatus;
  retryAfterSec?: number;
};

export const changeUserAuthData = createAsyncThunk<
  Resp,
  Args,
  { rejectValue: Rejected }
>(
  "auth/changeUserAuthData",
  async (userdata, { dispatch, rejectWithValue }) => {
    const user = await loadUser();
    try {
      const data = (await changeUserAuthDataApi({
        ...userdata,
        hash: user!.hash,
      })) as Resp;

      if (!data) {
        return rejectWithValue({
          message: "updateUser Unexpected empty response",
        });
      }
      console.log("changeUserAuthData data", data);

      if (data.user) {
        dispatch(setUser(data.user));
      }

      return data;
    } catch (err: any) {
      const code = err?.response?.data?.code as string | undefined;
      const status = err?.response?.data?.status as
        | CodeStatus
        | StatusCode
        | undefined;
      const msg =
        err?.response?.data?.message ?? err?.message ?? "Update user failed";
      return rejectWithValue({ status, message: msg, code });
    }
  },
);
