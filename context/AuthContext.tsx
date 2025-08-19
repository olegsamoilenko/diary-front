import React, { createContext, useContext, useEffect, useState } from "react";
import * as SecureStore from "@/utils/store/secureStore";

type AuthContextType = {
  isLoggedIn: boolean;
  setIsLoggedIn: (v: boolean) => void;
  isReady: boolean;
};

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  setIsLoggedIn: () => {},
  isReady: false,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    SecureStore.getItemAsync("token").then((token) => {
      setIsLoggedIn(!!token);
      setIsReady(true);
    });
  }, []);

  console.log("AuthProvider isLoggedIn:", isLoggedIn);

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, isReady }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
