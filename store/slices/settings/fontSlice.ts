import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  font: {
    title: "Inter",
    name: "Inter",
  },
};

const fontSlice = createSlice({
  name: "font",
  initialState,
  reducers: {
    setFont: (state, action) => {
      state.font = action.payload;
    },
  },
});

export const { setFont } = fontSlice.actions;
export default fontSlice.reducer;
