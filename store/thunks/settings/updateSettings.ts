import { createAsyncThunk } from "@reduxjs/toolkit";
import { updateSettingsApi } from "@/utils/api/endpoints/settings/updateSettingsApi";
import { setSettings } from "@/store/slices/settingsSlice";
import { StatusCode } from "@/types";
import type { Rejected, UserSettings } from "@/types";

type RegisterArgs = Partial<UserSettings>;

type RegisterResp = UserSettings;

export const updateSettings = createAsyncThunk<
  RegisterResp,
  RegisterArgs,
  { rejectValue: Rejected }
>(
  "auth/updateSettings",
  async (settingsData, { dispatch, rejectWithValue }) => {
    try {
      const data = await updateSettingsApi(settingsData);

      if (!data) {
        return rejectWithValue({
          message: "updateUser updateSettings empty response",
        });
      }

      dispatch(setSettings(data));

      return data;
    } catch (err: any) {
      const code = err?.response?.data?.code as string | undefined;
      const status = err?.response?.data?.status as StatusCode | undefined;
      const msg =
        err?.response?.data?.message ??
        err?.message ??
        "Update settings failed";
      return rejectWithValue({ status, message: msg, code });
    }
  },
);
