import * as React from "react";
import { View, TouchableOpacity } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { ErrorMessages } from "@/types";
import { useTranslation } from "react-i18next";
import { Image } from "expo-image";
import Toast from "react-native-toast-message";
import { RootState, useAppDispatch } from "@/store";
import { signInWithGoogle } from "@/store/thunks/auth/signInWithGoogle";
import { useSelector } from "react-redux";
import { useUIStyles } from "@/hooks/useUIStyles";

export default function GoogleSignInButton({
  forPlanSelect,
  onSuccessSignWithGoogle,
  type = "register",
}: {
  forPlanSelect?: boolean;
  onSuccessSignWithGoogle: () => void;
  type?: "login" | "register" | "refresh";
}) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const googleLogo = require("@/assets/images/logo/google_logo.webp");
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const user = useSelector((s: RootState) => s.user.value);
  const ui = useUIStyles();

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
      console.error("Error GoogleLogin", err);
      console.error("Error GoogleLogin response", err.response);
      throw err;
    }
  };

  const processUserData = async (idToken: string) => {
    try {
      await dispatch(
        signInWithGoogle({
          userId: Number(user!.id),
          uuid: user!.uuid,
          idToken,
        }),
      ).unwrap();
      onSuccessSignWithGoogle();
    } catch (err: any) {
      console.error("Error during Google sign-in:", err);
      Toast.show({
        type: "error",
        text1: t(
          `errors.${ErrorMessages[err.code as keyof typeof ErrorMessages]}`,
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
      console.error("Error googleSignIn", err);
      console.error("Error googleSignIn response", err.response);
    }
  };

  return (
    <TouchableOpacity
      style={[ui.btnPrimary, { flexDirection: "row", alignItems: "center" }]}
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
        {type === "login"
          ? t("auth.signInWithGoogle")
          : type === "refresh"
            ? t("auth.refreshWithGoogle")
            : t("auth.signUpWithGoogle")}
      </ThemedText>
    </TouchableOpacity>
  );
}
