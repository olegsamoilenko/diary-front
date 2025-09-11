import * as React from "react";
import { View, TouchableOpacity } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import type { User } from "@/types";
import { ErrorMessages } from "@/types";
import { useTranslation } from "react-i18next";
import { apiUrl } from "@/constants/env";
import { Image } from "expo-image";
import { UserEvents } from "@/utils/events/userEvents";
import { useEffect } from "react";
import Toast from "react-native-toast-message";

export default function GoogleSignInButton({
  forPlanSelect,
  onSuccessSignWithGoogle,
}: {
  forPlanSelect?: boolean;
  onSuccessSignWithGoogle: () => void;
}) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const googleLogo = require("@/assets/images/logo/google_logo.webp");
  const { t } = useTranslation();

  GoogleSignin.configure({
    webClientId:
      "710892196291-cmo8kv1h9jeim09c6f3kchup3oknosts.apps.googleusercontent.com",
    scopes: ["openid", "email", "profile"],
    offlineAccess: true,
    forceCodeForRefreshToken: false,
    iosClientId:
      "710892196291-00dbprivpdqs5qe0vbeeu21k9pgibqv7.apps.googleusercontent.com",
  });

  const GoogleLogin = async () => {
    try {
      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });

      const userInfo = await GoogleSignin.signIn();
      return userInfo;
    } catch (err: any) {
      console.log("Error GoogleLogin", err);
      console.log("Error GoogleLogin response", err.response);
      console.log("Error GoogleLogin response data", err.response.data);
      throw err;
    }
  };

  const processUserData = async (idToken: string) => {
    const userString = await SecureStore.getItemAsync("user");
    const userObj: User | null = userString ? JSON.parse(userString) : null;
    try {
      const res = await axios.post(`${apiUrl}/auth/sign-in-with-google`, {
        userId: userObj?.id,
        uuid: userObj?.uuid,
        idToken,
      });

      if (res?.status !== 200 && res?.status !== 201) {
        console.log("No data returned from server");
        Toast.show({
          type: "error",
          text1: t(`error.noDataReturnedFromServer`),
        });
        return;
      }

      await SecureStore.setItemAsync("user", JSON.stringify(res.data.user));
      await SecureStore.setItemAsync("token", res.data.accessToken);

      onSuccessSignWithGoogle();
      UserEvents.emit("userLoggedIn", res.data.user);
    } catch (err: any) {
      console.error("Error during Google sign-in:", err);
      console.error("Error during Google sign-in response:", err.response);
      console.error(
        "Error during Google sign-in response data:",
        err.response.data,
      );
      Toast.show({
        type: "error",
        text1: t(
          `errors.${ErrorMessages[err.response.data.code as keyof typeof ErrorMessages]}`,
        ),
      });
    }
  };

  const googleSignIn = async () => {
    try {
      const response = await GoogleLogin();

      const { idToken } = response.data ?? {};
      if (idToken) {
        await processUserData(idToken);
      }
    } catch (err: any) {
      console.log("Error googleSignIn", err);
      console.log("Error googleSignIn response", err.response);
      console.log("Error googleSignIn response data", err.response.data);
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
          contentFit="cover"
          cachePolicy="memory-disk"
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
