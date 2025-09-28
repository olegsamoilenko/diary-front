import { TouchableOpacity, View } from "react-native";
import React, { useState, RefObject, useEffect } from "react";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";
import { ThemedText } from "@/components/ThemedText";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { SideSheetRef } from "@/components/SideSheet";
import { useTranslation } from "react-i18next";
import type { User } from "@/types";
import * as SecureStore from "expo-secure-store";
import { UserEvents } from "@/utils/events/userEvents";

export default function ProfileSettingsBlock({
  profileRef,
}: {
  profileRef: RefObject<SideSheetRef | null>;
}) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const { t } = useTranslation();
  const [user, setUser] = useState<User | null>(null);

  const getUser = async () => {
    const storedUser = await SecureStore.getItemAsync("user");
    setUser(storedUser ? JSON.parse(storedUser) : null);
  };

  useEffect(() => {
    getUser();
  }, []);

  // useEffect(() => {
  //   const handler = () => getUser();
  //   UserEvents.on("userChanged", handler);
  //   return () => UserEvents.off("userChanged", handler);
  // }, []);

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
          profileRef!.current?.open();
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
          <ThemedText>{t("settings.profile.title")}</ThemedText>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: 10,
            }}
          >
            <ThemedText>{user?.name}</ThemedText>
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
