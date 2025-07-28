import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import * as SecureStore from "expo-secure-store";

type BiometryContextType = {
  biometryEnabled: boolean;
  setBiometry: (enabled: boolean) => Promise<void>;
};

const BiometryContext = createContext<BiometryContextType | undefined>(
  undefined,
);

export const BiometryProvider = ({ children }: { children: ReactNode }) => {
  const [biometryEnabled, setBiometryEnabled] = useState(false);

  useEffect(() => {
    const load = async () => {
      const stored = await SecureStore.getItemAsync("biometry_enabled");
      setBiometryEnabled(stored === "true");
    };
    load();
  }, []);

  const setBiometry = async (enabled: boolean) => {
    await SecureStore.setItemAsync(
      "biometry_enabled",
      enabled ? "true" : "false",
    );
    setBiometryEnabled(enabled);
  };

  return (
    <BiometryContext.Provider value={{ biometryEnabled, setBiometry }}>
      {children}
    </BiometryContext.Provider>
  );
};

export const useBiometry = () => {
  const ctx = useContext(BiometryContext);
  if (!ctx) throw new Error("useBiometry must be used within BiometryProvider");
  return ctx;
};
