import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Font } from "@/types";

const initialState = Font.NUNITO;

const fontSlice = createSlice({
  name: "font",
  initialState,
  reducers: {
    setFont: (_state, action: PayloadAction<Font>) => action.payload,
    resetFont: () => initialState,
  },
});

export const { setFont, resetFont } = fontSlice.actions;
export default fontSlice.reducer;
