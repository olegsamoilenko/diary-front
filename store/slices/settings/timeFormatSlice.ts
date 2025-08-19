import { createSlice } from "@reduxjs/toolkit";
import { TimeFormat } from "@/types";

const initialState = TimeFormat["12_H"];

export const timeFormatSlice = createSlice({
  name: "timeFormat",
  initialState,
  reducers: {
    setTimeFormat: (_state, action) => action.payload,
    resetTimeFormat: () => initialState,
  },
});

export const { setTimeFormat, resetTimeFormat } = timeFormatSlice.actions;
export default timeFormatSlice.reducer;
