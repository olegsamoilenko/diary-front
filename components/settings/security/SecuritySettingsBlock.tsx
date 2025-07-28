import { TouchableOpacity, View } from "react-native";
import { useTranslation } from "react-i18next";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";
import { ThemedText } from "@/components/ThemedText";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { RefObject, useEffect, useState } from "react";
import { SideSheetRef } from "@/components/SideSheet";
import { useBiometry } from "@/context/BiometryContext";

export default function SecuritySettingsBlock({
  biometryRef,
}: {
  biometryRef: RefObject<SideSheetRef | null>;
}) {
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme] ?? Colors.system;
  const { biometryEnabled } = useBiometry();

  return (
    <View
      style={{
        // iOS
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 8,

        // Android
        borderRadius: 10,
        backgroundColor: colors.backgroundAdditional,
        padding: 20,
        display: "flex",
        flexDirection: "column",
        gap: 10,
        elevation: 8,
      }}
    >
      <TouchableOpacity
        onPress={() => {
          biometryRef.current?.open();
        }}
      >
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <ThemedText>{t("settings.biometry.title")}</ThemedText>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: 10,
            }}
          >
            {biometryEnabled ? (
              <ThemedText>{t(`settings.biometry.on`)}</ThemedText>
            ) : (
              <ThemedText>{t(`settings.biometry.off`)}</ThemedText>
            )}
            <MaterialCommunityIcons
              name="chevron-right"
              size={28}
              color={colors.text}
            />
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
}
