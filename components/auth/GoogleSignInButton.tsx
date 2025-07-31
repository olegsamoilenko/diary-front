import * as React from "react";
import { View, Image, TouchableOpacity } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { User } from "@/types";
import { useTranslation } from "react-i18next";
import { apiUrl } from "@/constants/env";

export default function GoogleSignInButton({
  forPlanSelect,
  onSuccessSignWithGoogle,
}: {
  forPlanSelect?: boolean;
  onSuccessSignWithGoogle: () => void;
}) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme] ?? Colors.system;
  const googleLogo = require("@/assets/images/logo/google_logo.webp");
  const { t } = useTranslation();

  GoogleSignin.configure({
    webClientId:
      "203981333495-fjift3o1qr4q35tv5hscsuutbouspfir.apps.googleusercontent.com",
    scopes: ["https://www.googleapis.com/auth/drive"],
    offlineAccess: true,
    forceCodeForRefreshToken: false,
    iosClientId:
      "203981333495-55s91bj0jmma2dl1mrnkku56s8i34ckg.apps.googleusercontent.com",
  });

  const GoogleLogin = async () => {
    await GoogleSignin.hasPlayServices();

    const userInfo = await GoogleSignin.signIn();
    return userInfo;
  };

  const processUserData = async (idToken: string, user: any) => {
    const userString = await SecureStore.getItemAsync("user");
    const userObj: User | null = userString ? JSON.parse(userString) : null;
    try {
      const res = await axios.post(
        `${apiUrl}/auth/sign-in-with-google/${userObj?.id}`,
        { idToken },
      );

      if (res && res.status !== 201) {
        throw new Error("Failed to sign in with Google");
      }

      await SecureStore.setItemAsync("user", JSON.stringify(res.data.user));
      await SecureStore.setItemAsync("token", res.data.accessToken);

      if (forPlanSelect) {
        onSuccessSignWithGoogle();
      }
    } catch (err: any) {
      console.error("Error during Google sign-in:", err?.response?.data);
    }
  };

  const googleSignIn = async () => {
    try {
      const response = await GoogleLogin();

      // retrieve user data
      const { idToken, user } = response.data ?? {};
      if (idToken) {
        await processUserData(idToken, user);
      }
    } catch (error) {
      console.log("Error", error);
    }
  };

  return (
    <TouchableOpacity
      style={{
        paddingHorizontal: 18,
        paddingVertical: 10,
        backgroundColor: colors.primary,
        borderRadius: 12,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginTop: 16,
      }}
      onPress={googleSignIn}
      disabled={false}
    >
      <View>
        <Image
          source={googleLogo}
          style={{
            backgroundColor: "transparent",
            width: 24,
            height: 24,
          }}
        />
      </View>
      <ThemedText
        style={{
          color: colors.textInPrimary,
          textAlign: "center",
          marginLeft: 8,
        }}
      >
        {t("auth.signInWithGoogle")}
      </ThemedText>
    </TouchableOpacity>
  );
}
