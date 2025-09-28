import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { User } from "@/types";

type UserState = { value: User | null; hydrated: boolean };
const initialState: UserState = { value: null, hydrated: false };

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User | null>) {
      state.value = action.payload;
    },
    markUserHydrated(state) {
      state.hydrated = true;
    },
    resetUser: () => initialState,
  },
});

export const { setUser, markUserHydrated, resetUser } = userSlice.actions;
export default userSlice.reducer;
