import { createAsyncThunk } from "@reduxjs/toolkit";
import { saveTrialPlanToDatabaseApi } from "@/utils/api/endpoints/subscription/saveTrialPlanToDatabaseApi";
import { setPlan } from "@/store/slices/planSlice";
import { BasePlanIds, CodeStatus, StatusCode } from "@/types";
import type { Plan, Rejected } from "@/types";

type RegisterResp = {
  plan: Plan;
};

type RegisterArgs = {
  basePlanId: BasePlanIds;
};

export const saveTrialPlanToDatabase = createAsyncThunk<
  RegisterResp,
  RegisterArgs,
  { rejectValue: Rejected }
>(
  "subscription/saveTrialPlanToDatabase",
  async ({ basePlanId }, { dispatch, rejectWithValue }) => {
    try {
      const data = await saveTrialPlanToDatabaseApi(basePlanId);

      if (!data) {
        return rejectWithValue({
          message: "saveTrialPlanToDatabase Unexpected empty response",
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
        err?.response?.data?.message ??
        err?.message ??
        "Save trial failed failed";
      return rejectWithValue({ status, message: msg, code });
    }
  },
);
