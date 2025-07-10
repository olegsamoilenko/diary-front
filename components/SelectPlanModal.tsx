import React from "react";
import {
  View,
  Text,
  Modal,
  Pressable,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Plans } from "@/constants/Plans";
import { ColorTheme, Plan } from "@/types";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";
import { useTranslation } from "react-i18next";

type Props = {
  visible: boolean;
  onSelect: (plan: Plan) => void;
};

export default function SelectPlanModal({ visible, onSelect }: Props) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const styles = getStyles(colors);
  const { t } = useTranslation();
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>{t("tariffModal.title")}</Text>
          <ScrollView>
            {Plans.map((plan) => (
              <Pressable
                key={plan.name}
                style={styles.card}
                onPress={() => onSelect(plan)}
              >
                <Text style={styles.planName}>{plan.name}</Text>
                <Text style={styles.desc}>{t(plan.descriptionKey)}</Text>
                <Text style={styles.price}>
                  {plan.price > 0
                    ? `${plan.price} $ / ${t("tariffModal.month")}`
                    : t("tariffModal.free")}
                </Text>
                <Text style={styles.tokens}>
                  {plan.tokensLimit.toLocaleString()}{" "}
                  {t("tariffModal.tokensPerMonth")}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const getStyles = (colors: ColorTheme) =>
  StyleSheet.create({
    overlay: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: colors.background,
    },
    container: {
      width: "90%",
      backgroundColor: colors.secondaryBackground,
      borderRadius: 18,
      padding: 20,
      elevation: 10,
    },
    title: {
      fontSize: 22,
      fontWeight: "bold",
      marginBottom: 14,
      textAlign: "center",
      color: colors.text,
    },
    card: {
      backgroundColor: colors.entryBackground,
      borderRadius: 12,
      padding: 18,
      marginBottom: 14,
      borderWidth: 1,
      borderColor: colors.border,
    },
    planName: {
      fontSize: 18,
      fontWeight: "600",
      marginBottom: 4,
      color: colors.text,
    },
    desc: { fontSize: 14, color: colors.secondaryText, marginBottom: 4 },
    price: {
      fontSize: 16,
      fontWeight: "500",
      color: colors.tariff,
      marginBottom: 2,
    },
    tokens: { fontSize: 12, color: colors.tokens },
  });
