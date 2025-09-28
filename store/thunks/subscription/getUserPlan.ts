import { createAsyncThunk } from "@reduxjs/toolkit";
import { getPlanApi } from "@/utils/api/endpoints/subscription/getPlanApi";
import { setPlan } from "@/store/slices/planSlice";
import { CodeStatus, StatusCode } from "@/types";
import type { Plan, Rejected } from "@/types";

type RegisterResp = {
  plan: Plan;
};

export const getUserPlan = createAsyncThunk<
  RegisterResp,
  void,
  { rejectValue: Rejected }
>("subscription/getUserPlan", async (_, { dispatch, rejectWithValue }) => {
  try {
    const data = await getPlanApi();

    if (!data) {
      return rejectWithValue({
        message: "getUserPlan Unexpected empty response",
      });
    }

    dispatch(setPlan(data.plan));

    return data;
  } catch (err: any) {
    const code = err?.response?.data?.code as string | undefined;
    const status = err?.response?.data?.status as
      | CodeStatus
      | StatusCode
      | undefined;
    const msg =
      err?.response?.data?.message ?? err?.message ?? "Get plan failed";
    return rejectWithValue({ status, message: msg, code });
  }
});
