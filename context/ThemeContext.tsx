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
  const systemScheme = useColorScheme() ?? "dark";
  const [theme, setTheme] = useState<Theme>("light");
  const [colorScheme, setColorScheme] = useState<Theme>(systemScheme);

  useEffect(() => {
    const handleStartTheme = async () => {
      // await AsyncStorage.removeItem("APP_THEME");
      const storedTheme = await AsyncStorage.getItem("APP_THEME");
      if (storedTheme) {
        setTheme(storedTheme as Theme);
      } else {
        setTheme(systemScheme);
      }
    };

    handleStartTheme();
  }, []);

  useEffect(() => {
    setColorScheme(theme);
    AsyncStorage.setItem("APP_THEME", theme).catch(() => {});
  }, [theme, systemScheme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, colorScheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useThemeCustom = () => useContext(ThemeContext);
