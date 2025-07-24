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
import Background from "@/components/Background";

type Props = {
  visible: boolean;
  onSelect: (plan: Plan) => void;
};

export default function SelectPlan({ visible, onSelect }: Props) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const styles = getStyles(colors);
  const { t } = useTranslation();
  return (
    // <Modal visible={visible} transparent animationType="fade">
    <Background background={colors.backgroundImage}>
      <View style={styles.container}>
        <Text style={styles.title}>{t("planModal.title")}</Text>
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            paddingBottom: 20,
            width: "100%",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <View
            style={{
              flexDirection: "column",
              width: "100%",
              paddingHorizontal: 16,
              paddingBottom: 20,
            }}
          >
            {Plans.map((plan) => (
              <Pressable key={plan.name} onPress={() => onSelect(plan)}>
                <View style={styles.card}>
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
                </View>
              </Pressable>
            ))}
          </View>
        </ScrollView>
      </View>
    </Background>
    // </Modal>
  );
}

const getStyles = (colors: ColorTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      flexGrow: 1,
      backgroundColor: "transparent",
      borderRadius: 18,
      padding: 10,
      marginTop: 50,
      alignItems: "center",
      justifyContent: "center",
    },
    title: {
      fontSize: 22,
      fontWeight: "bold",
      marginBottom: 14,
      textAlign: "center",
      color: colors.text,
    },
    card: {
      minWidth: "100%",
      backgroundColor: colors.backgroundAdditional,
      borderRadius: 12,
      padding: 18,
      marginBottom: 14,
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
  });
