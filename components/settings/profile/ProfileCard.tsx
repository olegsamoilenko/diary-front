import { ThemedText } from "@/components/ThemedText";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";
import { ColorTheme } from "@/types";
import { useUIStyles } from "@/hooks/useUIStyles";

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
  const styles = useMemo(() => getStyles(colors), [colors]);
  const ui = useUIStyles();

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
        <View style={{ flex: 1, minWidth: 0, marginRight: 8 }}>
          <ThemedText
            numberOfLines={2}
            ellipsizeMode="tail"
            style={{ flexShrink: 1 }}
          >
            {val}
          </ThemedText>
        </View>
        {isActionButton && (
          <TouchableOpacity
            style={[ui.btnPrimary, { flexShrink: 0 }]}
            onPress={handleAction}
          >
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

const getStyles = (colors: ColorTheme) => StyleSheet.create({});
