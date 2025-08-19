import { useEffect } from "react";
import { unstable_batchedUpdates } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch } from "react-redux";
import { setFont } from "@/store/slices/settings/fontSlice";
import { setTimeFormat } from "@/store/slices/settings/timeFormatSlice";
import { setAiModel } from "@/store/slices/settings/aiModelSlice";
import type { AiModel, User } from "@/types";

function safeParse<T>(v: string | null, fallback: T): T {
  if (v == null) return fallback;
  try {
    return JSON.parse(v) as T;
  } catch {
    return (v as unknown as T) ?? fallback;
  }
}

export function useHydrateSettings(user: User) {
  const dispatch = useDispatch();

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!mounted) return;

      if (user?.settings?.font) dispatch(setFont(user?.settings?.font));
      if (user?.settings?.timeFormat)
        dispatch(setTimeFormat(user?.settings?.timeFormat));
      if (user?.settings?.aiModel)
        dispatch(setAiModel(user?.settings?.aiModel));
    })();

    return () => {
      mounted = false;
    };
  }, [dispatch, user]);
}
