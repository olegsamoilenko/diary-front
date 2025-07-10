import { configureStore } from "@reduxjs/toolkit";
import settingsReducer from "./slices/settings/settingsSlice";
import timeFormatReducer from "./slices/settings/timeFormatSlice";
import fontReducer from "./slices/settings/fontSlice";

export const store = configureStore({
  reducer: {
    settings: settingsReducer,
    timeFormat: timeFormatReducer,
    font: fontReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
