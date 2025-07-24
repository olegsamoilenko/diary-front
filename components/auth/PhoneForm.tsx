import {
  ActivityIndicator,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { ThemedText } from "@/components/ThemedText";
import React, { useState } from "react";
import { ColorTheme } from "@/types";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";
import { useTranslation } from "react-i18next";
import axios from "axios";
import Constants from "expo-constants";
import * as SecureStore from "expo-secure-store";

type PhoneFormProps = {
  forPlanSelect: boolean;
  onSuccessPhoneCode: () => void;
};
export default function PhoneForm({
  forPlanSelect,
  onSuccessPhoneCode,
}: PhoneFormProps) {
  const [code, setCode] = useState("");
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const styles = getStyles(colors);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const apiUrl = Constants.expoConfig?.extra?.API_URL;

  const handleSubmit = async () => {
    if (code.length !== 6) {
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post(`${apiUrl}/auth/verify-phone`, {
        code,
      });

      if (res && res.status !== 201) {
        throw new Error("Failed to confirm email");
      }

      setCode("");

      await SecureStore.setItemAsync("user", JSON.stringify(res.data.user));
      await SecureStore.setItemAsync("token", res.data.accessToken);

      console.log("Code submission response:", res.data);
      if (forPlanSelect) {
        onSuccessPhoneCode();
      }
    } catch (error) {
      console.error("Error submitting code:", error);
      alert("Failed to submit code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.center}>
      <ThemedText style={styles.label}>
        {t("auth.weHaveSentYouCodeToYourPhone")}
      </ThemedText>
      <TextInput
        value={code}
        onChangeText={setCode}
        keyboardType="number-pad"
        maxLength={6}
        style={[styles.input, { letterSpacing: 5 }]}
        placeholder="******"
      />
      <TouchableOpacity
        style={styles.btn}
        onPress={() => handleSubmit()}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <ThemedText
            style={{
              color: colors.textInPrimary,
              textAlign: "center",
            }}
          >
            {t("auth.confirm")}
          </ThemedText>
        )}
      </TouchableOpacity>
    </View>
  );
}

const getStyles = (colors: ColorTheme) =>
  StyleSheet.create({
    center: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      padding: 20,
    },
    label: {
      fontSize: 18,
      marginBottom: 16,
      textAlign: "center",
      fontWeight: "500",
    },
    input: {
      borderRadius: 12,
      padding: 12,
      fontSize: 20,
      marginBottom: 16,
      width: 180,
      textAlign: "center",
      backgroundColor: colors.inputBackground,
    },
    btn: {
      paddingHorizontal: 18,
      paddingVertical: 10,
      backgroundColor: colors.primary,
      borderRadius: 12,
      textAlign: "center",
    },
  });
