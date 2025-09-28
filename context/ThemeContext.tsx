import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useColorScheme } from "react-native";
import { Theme, ThemeContextType, UserSettings } from "@/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "@/store";
import { setSettings } from "@/store/slices/settingsSlice";

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
  const settings = useSelector((s: RootState) => s.settings.value);
  const dispatch = useAppDispatch();

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        if (cancelled) return;
        const theme = (settings?.theme as Theme) ?? systemScheme;
        setTheme(theme);
      } catch (e) {
        if (!cancelled) setTheme(systemScheme);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [settings]);

  const resetToSystem = useCallback(() => {
    setTheme(systemScheme as Theme);
  }, [systemScheme]);

  useEffect(() => {
    setColorScheme(theme);
    (async () => {
      const tempSettings: UserSettings = JSON.parse(JSON.stringify(settings));
      tempSettings.theme = theme;
      dispatch(setSettings(tempSettings));
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
