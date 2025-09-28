import { createAsyncThunk } from "@reduxjs/toolkit";
import { updateUserApi } from "@/utils/api/endpoints/auth/updateUserApi";
import { setUser } from "@/store/slices/userSlice";
import { CodeStatus, StatusCode } from "@/types";
import type { User, Rejected } from "@/types";
import { loadUser } from "@/utils/store/storage";

type RegisterArgs = Partial<User>;

type RegisterResp = {
  user: User;
};

export const updateUser = createAsyncThunk<
  RegisterResp,
  RegisterArgs,
  { rejectValue: Rejected }
>("auth/updateUser", async (userdata, { dispatch, rejectWithValue }) => {
  const user = await loadUser();
  try {
    const data = await updateUserApi({ ...userdata, hash: user!.hash });

    if (!data) {
      return rejectWithValue({
        message: "updateUser Unexpected empty response",
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
      err?.response?.data?.message ?? err?.message ?? "Update user failed";
    return rejectWithValue({ status, message: msg, code });
  }
});
