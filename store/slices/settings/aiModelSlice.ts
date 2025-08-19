import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AiModel } from "@/types";

const initialState = AiModel.GPT_5;

export const aiModelSlice = createSlice({
  name: "aiModel",
  initialState,
  reducers: {
    setAiModel: (_state, action: PayloadAction<AiModel>) => action.payload,
    resetAiModel: () => initialState,
  },
});

export const { setAiModel, resetAiModel } = aiModelSlice.actions;
export default aiModelSlice.reducer;
