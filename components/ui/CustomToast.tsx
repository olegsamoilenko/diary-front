import React from "react";
import { View, StyleSheet } from "react-native";
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
import { Portal } from "@gorhom/portal";
import { Font } from "@/types";

export default function CustomToast() {
  const { value: settings } = useSelector((s: RootState) => s.settings);
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];

  const toastConfig = {
    success: (props: any) => (
      <SuccessToast
        {...props}
        style={{
          backgroundColor: colors.backgroundAdditional,
          padding: 10,
          borderLeftColor: "green",
          height: "auto",
          zIndex: 999999,
          elevation: 9999,
        }}
        text1NumberOfLines={0}
        text2NumberOfLines={0}
        text1Style={{
          fontSize: 16,
          fontFamily: getFont(settings?.font ?? Font.NUNITO, "bold"),
          color: colors.text,
        }}
        text2Style={{
          fontSize: 14,
          fontFamily: getFont(settings?.font ?? Font.NUNITO, "regular"),
          color: colors.text,
        }}
      />
    ),
    error: (props: any) => (
      <ErrorToast
        {...props}
        style={{
          backgroundColor: colors.backgroundAdditional,
          padding: 10,
          borderLeftColor: "red",
          height: "auto",
          zIndex: 999999,
          elevation: 9999,
        }}
        text1NumberOfLines={0}
        text2NumberOfLines={0}
        text1Style={{
          fontSize: 16,
          fontFamily: getFont(settings?.font ?? Font.NUNITO, "bold"),
          color: colors.text,
        }}
        text2Style={{
          fontSize: 14,
          fontFamily: getFont(settings?.font ?? Font.NUNITO, "regular"),
          color: colors.text,
        }}
      />
    ),
    info: (props: any) => (
      <InfoToast
        {...props}
        style={{
          backgroundColor: colors.backgroundAdditional,
          padding: 10,
          borderLeftColor: "yellow",
          height: "auto",
          zIndex: 999999,
          elevation: 9999,
        }}
        text1NumberOfLines={0}
        text2NumberOfLines={0}
        text1Style={{
          fontSize: 16,
          fontFamily: getFont(settings?.font ?? Font.NUNITO, "bold"),
          color: colors.text,
        }}
        text2Style={{
          fontSize: 14,
          fontFamily: getFont(settings?.font ?? Font.NUNITO, "regular"),
          color: colors.text,
        }}
      />
    ),
  };
  return (
    <Portal>
      <View pointerEvents="box-none" style={styles.host}>
        <Toast config={toastConfig} visibilityTime={6000} topOffset={60} />
      </View>
    </Portal>
  );
}

const styles = StyleSheet.create({
  host: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 99999,
    elevation: 99999,
  },
});
