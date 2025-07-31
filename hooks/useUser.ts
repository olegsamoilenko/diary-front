import { useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import type { User } from "@/types";

export function useUser() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    (async () => {
      const userString = await SecureStore.getItemAsync("user");
      setUser(userString ? JSON.parse(userString) : null);
    })();
  }, []);

  return user;
}
