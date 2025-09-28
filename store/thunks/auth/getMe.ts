import { createAsyncThunk } from "@reduxjs/toolkit";
import { getMeApi } from "@/utils/api/endpoints/auth/getMeApi";
import { setUser } from "@/store/slices/userSlice";
import { setPlan } from "@/store/slices/planSlice";
import { setSettings } from "@/store/slices/settingsSlice";
import { loadUser } from "@/utils/store/storage";

export const getMe = createAsyncThunk(
  "auth/getMe",
  async (_, { dispatch, rejectWithValue }) => {
    const user = await loadUser();
    try {
      const data = await getMeApi(user!.hash);
      if (!data) {
        return rejectWithValue({
          message: "Get me no response from server",
        });
      }

      if (data.user) dispatch(setUser(data.user));
      if (data.plan) dispatch(setPlan(data.plan));
      if (data.settings) dispatch(setSettings(data.settings));
      return data;
    } catch (err: any) {
      const code = err?.response?.data?.code as string | undefined;
      const msg =
        err?.response?.data?.message ?? err?.message ?? "Get me failed";
      return rejectWithValue({ message: msg, code });
    }
  },
);
