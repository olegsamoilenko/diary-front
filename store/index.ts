import { configureStore } from "@reduxjs/toolkit";
import aiModelReducer from "./slices/settings/aiModelSlice";
import timeFormatReducer from "./slices/settings/timeFormatSlice";
import fontReducer from "./slices/settings/fontSlice";

export const store = configureStore({
  reducer: {
    aiModel: aiModelReducer,
    timeFormat: timeFormatReducer,
    font: fontReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
