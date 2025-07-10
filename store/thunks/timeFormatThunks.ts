import { AppDispatch } from "@/store";
import {
  setTimeFormat,
  TimeFormatType,
} from "../slices/settings/timeFormatSlice";
import * as SecureStore from "@/utils/store/secureStore";

export const loadTimeFormat = () => async (dispatch: AppDispatch) => {
  const stored = await SecureStore.getItemAsync("timeFormat");
  dispatch(setTimeFormat(stored ? (Number(stored) as TimeFormatType) : 12));
};

export const saveTimeFormat =
  (format: TimeFormatType) => async (dispatch: AppDispatch) => {
    await SecureStore.setItemAsync("timeFormat", String(format));
    dispatch(setTimeFormat(format));
  };
