import { createListenerMiddleware, isAnyOf } from "@reduxjs/toolkit";
import { setUser } from "./slices/userSlice";
import { setSettings } from "./slices/settingsSlice";
import { setPlan } from "./slices/planSlice";
import { saveUser, saveSettings, savePlan } from "@/utils/store/storage";

export const persistListener = createListenerMiddleware();

persistListener.startListening({
  matcher: isAnyOf(setUser, setSettings, setPlan),
  effect: async (action, listenerApi) => {
    const state: any = listenerApi.getState();
    if (setUser.match(action)) {
      await saveUser(state.user.value);
    } else if (setSettings.match(action)) {
      await saveSettings(state.settings.value);
    } else if (setPlan.match(action)) {
      await savePlan(state.plan.value);
    }
  },
});
