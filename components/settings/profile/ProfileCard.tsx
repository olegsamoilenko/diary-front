import { ThemedText } from "@/components/ThemedText";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import React from "react";
import { useTranslation } from "react-i18next";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";
import { ColorTheme } from "@/types";

type ProfileCardProps = {
  title: string;
  val: string | null | undefined;
  handleAction?: () => void;
  isActionButton?: boolean;
};
export default function ProfileCard({
  title,
  val,
  handleAction,
  isActionButton = true,
}: ProfileCardProps) {
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const styles = getStyles(colors);

  return (
    <View style={{ marginBottom: 20, flexDirection: "column", gap: 5 }}>
      <ThemedText type={"bold"}>{title}:</ThemedText>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <View>
          <ThemedText>{val}</ThemedText>
        </View>
        {isActionButton && (
          <TouchableOpacity style={styles.btn} onPress={handleAction}>
            <ThemedText
              style={{
                color: colors.textInPrimary,
                textAlign: "center",
              }}
            >
              {t("auth.change")}
            </ThemedText>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const getStyles = (colors: ColorTheme) =>
  StyleSheet.create({
    container: {
      flexDirection: "column",
      gap: 5,
    },
    info: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    btn: {
      paddingHorizontal: 14,
      paddingVertical: 8,
      backgroundColor: colors.primary,
      borderRadius: 12,
      textAlign: "center",
    },
  });
