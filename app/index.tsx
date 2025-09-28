import "react-native-get-random-values";
import { Redirect } from "expo-router";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { AppState } from "react-native";
import { useEffect } from "react";

GoogleSignin.configure({
  webClientId:
    "710892196291-cmo8kv1h9jeim09c6f3kchup3oknosts.apps.googleusercontent.com",
  scopes: ["openid", "email", "profile"],
  offlineAccess: true,
  forceCodeForRefreshToken: false,
  iosClientId:
    "710892196291-00dbprivpdqs5qe0vbeeu21k9pgibqv7.apps.googleusercontent.com",
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
