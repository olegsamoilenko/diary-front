import { AppDispatch } from ".";
import { loadUser, loadSettings, loadPlan } from "@/utils/store/storage";
import { setUser, markUserHydrated } from "./slices/userSlice";
import { setSettings, markSettingsHydrated } from "./slices/settingsSlice";
import { setPlan, markPlanHydrated } from "./slices/planSlice";

export async function hydrateAll(dispatch: AppDispatch) {
  const [user, settings, plan] = await Promise.all([
    loadUser(),
    loadSettings(),
    loadPlan(),
  ]);

  dispatch(setUser(user));
  dispatch(markUserHydrated());

  dispatch(setSettings(settings));
  dispatch(markSettingsHydrated());

  dispatch(setPlan(plan));
  dispatch(markPlanHydrated());
}
