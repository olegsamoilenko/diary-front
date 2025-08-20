import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useColorScheme } from "react-native";
import type { Theme, ThemeContextType, User } from "@/types";
import * as SecureStore from "@/utils/store/secureStore";

const ThemeContext = createContext<ThemeContextType>({
  theme: "light",
  setTheme: () => {},
  colorScheme: "light",
  resetToSystem: () => {},
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
    let cancelled = false;

    (async () => {
      try {
        const stored = await SecureStore.getItemAsync("user");
        const user: User | null = stored ? JSON.parse(stored) : null;

        if (cancelled) return;

        const theme = (user?.settings?.theme as Theme) ?? systemScheme;
        setTheme(theme);
      } catch (e) {
        if (!cancelled) setTheme(systemScheme);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const resetToSystem = useCallback(() => {
    setTheme(systemScheme as Theme);
  }, [systemScheme]);

  useEffect(() => {
    setColorScheme(theme);
    (async () => {
      const stored = await SecureStore.getItemAsync("user");
      const user = stored ? JSON.parse(stored) : null;
      if (!user) return;
      user.settings.theme = theme;
      await SecureStore.setItemAsync("user", JSON.stringify(user));
    })();
  }, [theme, systemScheme]);

  return (
    <ThemeContext.Provider
      value={{ theme, setTheme, colorScheme, resetToSystem }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useThemeCustom = () => useContext(ThemeContext);
