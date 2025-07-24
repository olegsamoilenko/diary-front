import { TouchableOpacity, View } from "react-native";
import { useTranslation } from "react-i18next";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { RefObject } from "react";
import { SideSheetRef } from "@/components/SideSheet";
import { useAppSelector } from "@/store/hooks";

export default function AiSettingsBlock({
  modelSwitcherRef,
}: {
  modelSwitcherRef: RefObject<SideSheetRef | null>;
}) {
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const aiModel = useAppSelector((state) => state.settings.aiModel);
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
          modelSwitcherRef.current?.open();
        }}
      >
        <ThemedView
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <ThemedText>{t("settings.model.title")}</ThemedText>
          <ThemedView
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: 10,
            }}
          >
            <ThemedText>{t(`settings.model.${aiModel}`)}</ThemedText>
            <MaterialCommunityIcons
              name="chevron-right"
              size={28}
              color={colors.text}
            />
          </ThemedView>
        </ThemedView>
      </TouchableOpacity>
    </View>
  );
}
