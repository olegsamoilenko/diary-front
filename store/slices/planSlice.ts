import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { Plan } from "@/types";

type PlanState = { value: Plan | null; hydrated: boolean };
const initialState: PlanState = { value: null, hydrated: false };

const planSlice = createSlice({
  name: "plan",
  initialState,
  reducers: {
    setPlan(state, action: PayloadAction<Plan | null>) {
      state.value = action.payload;
    },
    markPlanHydrated(state) {
      state.hydrated = true;
    },
    resetPlan: () => initialState,
  },
});

export const { setPlan, markPlanHydrated, resetPlan } = planSlice.actions;
export default planSlice.reducer;
