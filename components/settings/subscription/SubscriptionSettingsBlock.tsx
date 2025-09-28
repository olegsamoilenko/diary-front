import { TouchableOpacity, View } from "react-native";
import React, { useState, RefObject, useEffect } from "react";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";
import { ThemedText } from "@/components/ThemedText";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { SideSheetRef } from "@/components/SideSheet";
import { useTranslation } from "react-i18next";
import type { Plan } from "@/types";
import { PlanEvents } from "@/utils/events/planEvents";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function SubscriptionSettingsBlock({
  plansRef,
}: {
  plansRef: RefObject<SideSheetRef | null>;
}) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const { t } = useTranslation();
  const [plan, setPlan] = useState<Plan | null>(null);

  const getPlan = async () => {
    const storedPlan = await AsyncStorage.getItem("plan");
    setPlan(storedPlan ? JSON.parse(storedPlan) : null);
  };

  useEffect(() => {
    getPlan();
  }, []);

  useEffect(() => {
    const handler = () => getPlan();
    PlanEvents.on("planChanged", handler);
    return () => PlanEvents.off("planChanged", handler);
  }, []);

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
          plansRef!.current?.open();
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
          <ThemedText>{t("settings.plans.title")}</ThemedText>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: 10,
            }}
          >
            <ThemedText>{plan?.name}</ThemedText>
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
