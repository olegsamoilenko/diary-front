import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useColorScheme } from "react-native";
import type { Theme, ThemeContextType } from "@/types";

const ThemeContext = createContext<ThemeContextType>({
  theme: "system",
  setTheme: () => {},
  colorScheme: "system",
});

export const ThemeProviderCustom = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const systemScheme = useColorScheme() ?? "system";
  const [theme, setTheme] = useState<Theme>("system");
  const [colorScheme, setColorScheme] = useState<Theme>(systemScheme);

  useEffect(() => {
    const handleStartTheme = async () => {
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
    if (theme === "system") {
      setColorScheme(systemScheme);
    } else {
      setColorScheme(theme);
    }
    AsyncStorage.setItem("APP_THEME", theme).catch(() => {});
  }, [theme, systemScheme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, colorScheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useThemeCustom = () => useContext(ThemeContext);
