import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
  key: 12,
  value: "12h",
};

export const timeFormatSlice = createSlice({
  name: "timeFormat",
  initialState,
  reducers: {
    setTimeFormat: (state, action) => {
      state = action.payload;
    },
  },
});

export const { setTimeFormat } = timeFormatSlice.actions;
export default timeFormatSlice.reducer;
