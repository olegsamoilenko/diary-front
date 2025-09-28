import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { UserSettings } from "@/types";

type SettingsState = { value: UserSettings | null; hydrated: boolean };
const initialState: SettingsState = { value: null, hydrated: false };

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    setSettings(state, action: PayloadAction<UserSettings | null>) {
      state.value = action.payload;
    },
    markSettingsHydrated(state) {
      state.hydrated = true;
    },
    resetSettings: () => initialState,
  },
});

export const { setSettings, markSettingsHydrated, resetSettings } =
  settingsSlice.actions;
export default settingsSlice.reducer;
