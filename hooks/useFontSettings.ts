import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export function useFontSettings(): [string, (font: string) => Promise<void>] {
  const [font, setFont] = useState("Inter");

  useEffect(() => {
    AsyncStorage.getItem("font").then((storedFont) => {
      if (storedFont) setFont(storedFont);
    });
  }, []);

  const changeFont = async (newFont: string) => {
    setFont(newFont);
    await AsyncStorage.setItem("font", newFont);
  };

  return [font, changeFont];
}
