import { Tabs } from "expo-router";
import React from "react";
import { Platform, Text } from "react-native";

import { HapticTab } from "@/components/HapticTab";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useTranslation } from "react-i18next";

import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { getFont } from "@/utils/common/getFont";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const { t } = useTranslation();
  const font = useSelector((state: RootState) => state.font);
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.tabIconSelected,
        tabBarInactiveTintColor: colors.tabIcon,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        sceneStyle: { backgroundColor: "transparent" },
        tabBarStyle: {
          backgroundColor: colors.tabBackground,
          height: 60 + insets.bottom,
          paddingBottom: insets.bottom,
          // borderTopWidth: 0,
          ...Platform.select({
            ios: { position: "absolute" },
            default: {},
          }),
        },
      }}
    >
      <Tabs.Screen
        name="diary"
        options={{
          tabBarLabel: ({ color }) => {
            return (
              <Text
                style={{
                  fontFamily: getFont(font, "regular"),
                  color,
                  fontSize: 13,
                }}
              >
                {t("diary.title")}
              </Text>
            );
          },
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="notebook-outline"
              size={28}
              color={color}
            />
          ),
        }}
      />
      {/*<Tabs.Screen*/}
      {/*  name="iap-diagnostics"*/}
      {/*  options={{*/}
      {/*    tabBarLabel: ({ color }) => {*/}
      {/*      return (*/}
      {/*        <Text*/}
      {/*          style={{*/}
      {/*            fontFamily: getFont(font, "regular"),*/}
      {/*            color,*/}
      {/*            fontSize: 13,*/}
      {/*          }}*/}
      {/*        >*/}
      {/*          iap-diagnostics*/}
      {/*        </Text>*/}
      {/*      );*/}
      {/*    },*/}
      {/*    tabBarIcon: ({ color }) => (*/}
      {/*      <MaterialCommunityIcons*/}
      {/*        name="robot-outline"*/}
      {/*        size={28}*/}
      {/*        color={color}*/}
      {/*      />*/}
      {/*    ),*/}
      {/*  }}*/}
      {/*/>*/}
      <Tabs.Screen
        name="settings"
        options={{
          tabBarLabel: ({ color }) => {
            return (
              <Text
                style={{
                  fontFamily: getFont(font, "regular"),
                  color,
                  fontSize: 13,
                }}
              >
                {t("settings.title")}
              </Text>
            );
          },
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="cog-outline"
              size={28}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
