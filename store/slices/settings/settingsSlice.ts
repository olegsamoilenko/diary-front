import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AiModel } from "@/types";

export interface SettingsState {
  aiModel: AiModel;
}

const initialState: SettingsState = {
  aiModel: AiModel.GPT_5,
};

export const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    setAiModel: (state, action: PayloadAction<AiModel>) => {
      state.aiModel = action.payload;
    },
  },
});

export const { setAiModel } = settingsSlice.actions;
export default settingsSlice.reducer;
