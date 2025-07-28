import BackArrow from "@/components/ui/BackArrow";
import { ThemedText } from "@/components/ThemedText";
import React, { forwardRef, useEffect, useState } from "react";
import SideSheet, { SideSheetRef } from "@/components/SideSheet";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";
import { useTranslation } from "react-i18next";
import { Plans } from "@/constants/Plans";
import { ColorTheme } from "@/types";
import Background from "@/components/Background";
import * as SecureStore from "@/utils/store/secureStore";
import type { User } from "@/types";

const PlansSettings = forwardRef<SideSheetRef, {}>((props, ref) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme] ?? Colors.system;
  const styles = getStyles(colors);
  const { t } = useTranslation();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const storedUser = await SecureStore.getItemAsync("user");
      setUser(storedUser ? JSON.parse(storedUser) : null);
    };
    getUser();
  }, []);

  useEffect(() => {
    console.log("user", user);
  }, [user]);

  const onSubscribe = (plan: (typeof Plans)[number]) => {
    // Handle plan selection logic here
    console.log("Selected plan:", plan);
  };

  const onUnsubscribe = () => {
    // Handle unsubscribe logic here
    console.log("Unsubscribed from plan");
  };
  return (
    <SideSheet ref={ref}>
      <Background background={colors.backgroundImage} paddingTop={10}>
        <View style={styles.container}>
          <BackArrow ref={ref} />
          <ThemedText type={"titleLG"}>
            {t("settings.plans.titlePlural")}
          </ThemedText>
          <ScrollView>
            {Plans.map((plan) => (
              <View key={plan.name} style={styles.card}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <ThemedText type="subtitleLG">{plan.name}</ThemedText>
                  {user?.plan?.name === plan.name ? (
                    <View
                      style={{
                        backgroundColor: colors.primary,
                        paddingVertical: 4,
                        paddingHorizontal: 8,
                        borderRadius: 16,
                      }}
                    >
                      <ThemedText
                        style={{
                          color: colors.textInPrimary,
                        }}
                      >
                        {t("settings.plans.youCurrentPlan")}
                      </ThemedText>
                    </View>
                  ) : (
                    <TouchableOpacity
                      style={{
                        backgroundColor: colors.background,
                        paddingVertical: 4,
                        paddingHorizontal: 8,
                        borderRadius: 16,
                      }}
                      onPress={() => onSubscribe(plan)}
                    >
                      <ThemedText>
                        {t("settings.plans.getTheVersion")}
                        {" " + plan.name}
                      </ThemedText>
                    </TouchableOpacity>
                  )}
                </View>
                <Text style={styles.desc}>{t(plan.descriptionKey)}</Text>
                <Text style={styles.price}>
                  {plan.price > 0
                    ? `${plan.price} $ / ${t("planModal.month")}`
                    : t("planModal.free")}
                </Text>
                <Text style={styles.tokens}>
                  {plan.tokensLimit.toLocaleString()}{" "}
                  {t("planModal.tokensPerMonth")}
                </Text>
              </View>
            ))}
            <TouchableOpacity onPress={onUnsubscribe}>
              <View
                style={[
                  styles.button,
                  {
                    borderWidth: 1,
                    borderColor: colors.border,
                    borderRadius: 12,
                  },
                ]}
              >
                <ThemedText
                  type="subtitleLG"
                  style={{
                    color: colors.text,
                  }}
                >
                  {t("settings.plans.unsubscribe")}
                </ThemedText>
              </View>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Background>
    </SideSheet>
  );
});

PlansSettings.displayName = "PlansSettings";

export default PlansSettings;

const getStyles = (colors: ColorTheme) =>
  StyleSheet.create({
    container: {
      paddingHorizontal: 20,
      flex: 1,
      marginBottom: -6,
    },
    card: {
      backgroundColor: colors.backgroundAdditional,
      borderRadius: 12,
      padding: 18,
      marginBottom: 14,
      marginTop: 10,
    },
    planName: {
      fontSize: 18,
      fontWeight: "600",
      marginBottom: 4,
      color: colors.text,
    },
    desc: { fontSize: 14, color: colors.textAdditional, marginBottom: 4 },
    price: {
      fontSize: 16,
      fontWeight: "500",
      color: colors.text,
      marginBottom: 2,
    },
    tokens: { fontSize: 12, color: colors.textAdditional },
    button: {
      borderRadius: 12,
      padding: 18,
      marginBottom: 14,
      marginTop: 10,
      alignItems: "center",
      justifyContent: "center",
    },
  });
