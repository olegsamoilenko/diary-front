import { Redirect } from "expo-router";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { AppState } from "react-native";
import { useEffect } from "react";

GoogleSignin.configure({
  webClientId:
    "203981333495-fjift3o1qr4q35tv5hscsuutbouspfir.apps.googleusercontent.com",
  scopes: ["openid", "email", "profile"],
  offlineAccess: true,
  forceCodeForRefreshToken: false,
  iosClientId:
    "203981333495-55s91bj0jmma2dl1mrnkku56s8i34ckg.apps.googleusercontent.com",
});

export default function IndexScreen() {
  useEffect(() => {
    const subscription = AppState.addEventListener("change", (state) => {
      if (state === "active") {
        console.log("App is active");
      }
    });
    return () => subscription.remove();
  }, []);
  return <Redirect href="/(tabs)/diary" />;
}
