import { AppDispatch } from "@/store";
import { setTimeFormat, TimeFormat } from "../slices/settings/timeFormatSlice";
import * as SecureStore from "@/utils/store/secureStore";

export const saveTimeFormat =
  (format: TimeFormat) => async (dispatch: AppDispatch) => {
    await SecureStore.setItemAsync("timeFormat", JSON.stringify(format));
    dispatch(setTimeFormat(format));
  };
