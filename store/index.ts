import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import settingsReducer from "./slices/settingsSlice";
import planReducer from "./slices/planSlice";
import { persistListener } from "./listeners";
import { loggerMiddleware } from "./loggerMiddleware";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

export const store = configureStore({
  reducer: {
    user: userReducer,
    settings: settingsReducer,
    plan: planReducer,
  },
  middleware: (getDefault) =>
    getDefault().prepend(persistListener.middleware).concat(loggerMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// if (__DEV__) {
//   let prev = store.getState();
//   store.subscribe(() => {
//     const next = store.getState();
//     console.log("[REDUX] state changed", {
//       user: next.user,
//       settings: next.settings,
//       plan: next.plan,
//     });
//     prev = next;
//   });
// }
