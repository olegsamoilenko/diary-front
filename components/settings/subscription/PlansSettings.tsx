import BackArrow from "@/components/ui/BackArrow";
import { ThemedText } from "@/components/ThemedText";
import React, { forwardRef } from "react";
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

const PlansSettings = forwardRef<SideSheetRef, {}>((props, ref) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const styles = getStyles(colors);
  const { t } = useTranslation();

  const onSelect = (plan: (typeof Plans)[number]) => {
    // Handle plan selection logic here
    console.log("Selected plan:", plan);
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
            {Plans.slice(1).map((plan) => (
              <Pressable
                key={plan.name}
                style={styles.card}
                onPress={() => onSelect(plan)}
              >
                <Text style={styles.planName}>{plan.name}</Text>
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
              </Pressable>
            ))}

            <TouchableOpacity>
              <View
                style={[styles.button, { backgroundColor: colors.primary }]}
              >
                <ThemedText
                  type="subtitleLG"
                  style={{
                    color: colors.textInPrimary,
                  }}
                >
                  {t("settings.plans.subscribe")}
                </ThemedText>
              </View>
            </TouchableOpacity>
            <TouchableOpacity>
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
