import { ThemedText } from "@/components/ThemedText";
import { TouchableOpacity, View } from "react-native";
import React from "react";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";
import { useTranslation } from "react-i18next";
import { Plan } from "@/types";

type PaymentProps = {
  onSuccessPayment: () => void;
  plan: Plan | null;
};

export default function Payment({ onSuccessPayment, plan }: PaymentProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme] ?? Colors.system;
  const { t } = useTranslation();
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
      }}
    >
      <ThemedText>{plan && plan.name}</ThemedText>
      <TouchableOpacity
        style={{
          backgroundColor: colors.background,
          borderRadius: 12,
          padding: 18,
          marginBottom: 14,
          marginTop: 10,
          alignItems: "center",
          justifyContent: "center",
        }}
        onPress={() => onSuccessPayment()}
      >
        <ThemedText>{t("common.continue")}</ThemedText>
      </TouchableOpacity>
    </View>
  );
}
