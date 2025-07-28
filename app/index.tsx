import { Redirect } from "expo-router";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

GoogleSignin.configure({
  webClientId:
    "203981333495-fjift3o1qr4q35tv5hscsuutbouspfir.apps.googleusercontent.com",
  scopes: ["https://www.googleapis.com/auth/drive"],
  offlineAccess: true,
  forceCodeForRefreshToken: false,
  iosClientId:
    "203981333495-55s91bj0jmma2dl1mrnkku56s8i34ckg.apps.googleusercontent.com",
});

export default function IndexScreen() {
  return <Redirect href="/(tabs)/diary" />;
}
