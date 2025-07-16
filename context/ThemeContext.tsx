import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useColorScheme } from "react-native";
import type { Theme, ThemeContextType } from "@/types";

const ThemeContext = createContext<ThemeContextType>({
  theme: "light",
  setTheme: () => {},
  colorScheme: "light",
});

export const ThemeProviderCustom = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const systemScheme = useColorScheme() ?? "light";
  const [theme, setTheme] = useState<Theme>("light");
  const [colorScheme, setColorScheme] = useState<Theme>(systemScheme);

  useEffect(() => {
    AsyncStorage.getItem("APP_THEME").then((t) => {
      console.log("Current theme from storage:", t);
      setTheme(t);
    });
  }, []);

  useEffect(() => {
    if (theme === "light") {
      setColorScheme(systemScheme);
    } else {
      setColorScheme(theme);
    }
    AsyncStorage.setItem("APP_THEME", theme);
  }, [theme, systemScheme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, colorScheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useThemeCustom = () => useContext(ThemeContext);
