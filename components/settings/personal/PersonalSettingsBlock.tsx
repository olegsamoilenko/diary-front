import { TouchableOpacity, View } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import i18n from "i18next";
import { SideSheetRef } from "@/components/SideSheet";
import { useTranslation } from "react-i18next";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useThemeCustom } from "@/context/ThemeContext";
import { Colors } from "@/constants/Colors";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { RefObject } from "react";

export default function PersonalSettingsBlock({
  themeSwitcherRef,
  fontSwitcherRef,
  timeFormatSwitcherRef,
  languageSwitcherRef,
  activitySwitcherRef,
}: {
  themeSwitcherRef: RefObject<SideSheetRef | null>;
  fontSwitcherRef: RefObject<SideSheetRef | null>;
  timeFormatSwitcherRef: RefObject<SideSheetRef | null>;
  languageSwitcherRef: RefObject<SideSheetRef | null>;
  activitySwitcherRef: RefObject<SideSheetRef | null>;
}) {
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const { theme } = useThemeCustom();
  const colors = Colors[colorScheme];
  const format = useSelector((state: RootState) => state.timeFormat.value);
  const font = useSelector((state: RootState) => state.font.font);

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
          // @ts-ignore
          themeSwitcherRef!.current?.open();
        }}
      >
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <ThemedText>{t("settings.theme.title")}</ThemedText>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: 10,
            }}
          >
            <ThemedText>{t(`settings.theme.themes.${theme}`)}</ThemedText>
            <MaterialCommunityIcons
              name="chevron-right"
              size={28}
              color={colors.text}
            />
          </View>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          // @ts-ignore
          fontSwitcherRef!.current?.open();
        }}
      >
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <ThemedText>{t("settings.font.title")}</ThemedText>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: 10,
            }}
          >
            <ThemedText>{font.title ?? "Default"}</ThemedText>
            <MaterialCommunityIcons
              name="chevron-right"
              size={28}
              color={colors.text}
            />
          </View>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          // @ts-ignore
          timeFormatSwitcherRef!.current?.open();
        }}
      >
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <ThemedText>{t("settings.timeFormat.title")}</ThemedText>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: 10,
            }}
          >
            <ThemedText>
              {format} {t("settings.timeFormat.h")}{" "}
            </ThemedText>
            <MaterialCommunityIcons
              name="chevron-right"
              size={28}
              color={colors.text}
            />
          </View>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          // @ts-ignore
          activitySwitcherRef!.current?.open();
        }}
      >
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <ThemedText>{t("settings.common.activeHours")}</ThemedText>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: 10,
            }}
          >
            <ThemedText>Test</ThemedText>
            <MaterialCommunityIcons
              name="chevron-right"
              size={28}
              color={colors.text}
            />
          </View>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          // @ts-ignore
          languageSwitcherRef!.current?.open();
        }}
      >
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <ThemedText>{t("settings.languages.title")}</ThemedText>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: 10,
            }}
          >
            <ThemedText>{t(`settings.languages.${i18n.language}`)}</ThemedText>
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
