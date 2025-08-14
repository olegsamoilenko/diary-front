import React from "react";
import { View } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import Toast, {
  SuccessToast,
  ErrorToast,
  InfoToast,
} from "react-native-toast-message";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import { getFont } from "@/utils";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";

export default function CustomToast() {
  const font = useSelector((state: RootState) => state.font.font);
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const toastConfig = {
    success: (props: any) => (
      <SuccessToast
        {...props}
        style={{ padding: 10, borderLeftColor: "green", height: 70 }}
        text1Style={{
          fontSize: 16,
          fontFamily: getFont(font.name, "bold"),
          color: colors.text,
        }}
        text2Style={{
          fontSize: 14,
          fontFamily: getFont(font.name, "regular"),
          color: colors.text,
        }}
      />
    ),
    error: (props: any) => (
      <ErrorToast
        {...props}
        contentContainerStyle={{}}
        style={{ padding: 10, borderLeftColor: "red", height: 70 }}
        text1Style={{
          fontSize: 16,
          fontFamily: getFont(font.name, "bold"),
          color: colors.text,
        }}
        text2Style={{
          fontSize: 14,
          fontFamily: getFont(font.name, "regular"),
          color: colors.text,
        }}
      />
    ),
    info: (props: any) => (
      <InfoToast
        {...props}
        style={{ padding: 10, borderLeftColor: "yellow", height: 70 }}
        text1Style={{
          fontSize: 16,
          fontFamily: getFont(font.name, "bold"),
          color: colors.text,
        }}
        text2Style={{
          fontSize: 14,
          fontFamily: getFont(font.name, "regular"),
          color: colors.text,
        }}
      />
    ),
  };
  return <Toast config={toastConfig} visibilityTime={5000} topOffset={60} />;
}
