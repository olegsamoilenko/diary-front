import { createSlice } from "@reduxjs/toolkit";

export type TimeFormat = {
  key: number;
  value: string;
};

const initialState = {
  key: 12,
  value: "12h",
};

export const timeFormatSlice = createSlice({
  name: "timeFormat",
  initialState,
  reducers: {
    setTimeFormat: (state, action) => {
      return action.payload;
    },
  },
});

export const { setTimeFormat } = timeFormatSlice.actions;
export default timeFormatSlice.reducer;
