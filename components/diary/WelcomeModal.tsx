import ModalPortal from "@/components/ui/Modal";
import { ThemedText } from "@/components/ThemedText";
import React, { useEffect, useState, useCallback, useMemo } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Checkbox from "@/components/ui/Checkbox";
import { useTranslation } from "react-i18next";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";
import { ColorTheme } from "@/types";

export default function WelcomeModal({}) {
  const [showWelcome, setShowWelcome] = useState<boolean>(false);
  const [checked, setChecked] = useState(false);
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const styles = useMemo(() => getStyles(colors), [colors]);

  useEffect(() => {
    const getData = async () => {
      const value = await AsyncStorage.getItem("show_welcome");
      console.log("WelcomeModal: show_welcome", value);
      if (value === null) {
        setShowWelcome(true);
      } else {
        setShowWelcome(value === "true");
      }
    };
    getData();
  }, []);

  const onToggle = useCallback((value: boolean) => {
    setChecked(value);
    AsyncStorage.setItem("show_welcome", JSON.stringify(!value)).catch(
      console.error,
    );
  }, []);
  return (
    <ModalPortal visible={showWelcome} onClose={() => setShowWelcome(false)}>
      <View
        style={{
          marginBottom: 20,
        }}
      >
        <ThemedText
          type="subtitleXL"
          style={{
            marginBottom: 10,
          }}
        >
          {t("welcome.title")}
        </ThemedText>
        <ThemedText>{t("welcome.description.part1")}</ThemedText>
        <ThemedText></ThemedText>
        <ThemedText>{t("welcome.description.part2")}</ThemedText>
        <ThemedText>{t("welcome.description.list1")}</ThemedText>
        <ThemedText>{t("welcome.description.list2")}</ThemedText>
        <ThemedText>{t("welcome.description.list3")}</ThemedText>
        <ThemedText>{t("welcome.description.list4")}</ThemedText>
        <ThemedText>{t("welcome.description.list5")}</ThemedText>
      </View>
      <View
        style={{
          marginBottom: 20,
        }}
      >
        <Checkbox
          checked={checked}
          onChange={onToggle}
          label={t("welcome.doNotShowAnymore")}
        />
      </View>
      <TouchableOpacity
        style={styles.btn}
        onPress={() => setShowWelcome(false)}
      >
        <ThemedText
          style={{
            color: colors.textInPrimary,
            textAlign: "center",
          }}
        >
          {t("common.close")}
        </ThemedText>
      </TouchableOpacity>
    </ModalPortal>
  );
}

const getStyles = (colors: ColorTheme) =>
  StyleSheet.create({
    btn: {
      paddingHorizontal: 18,
      paddingVertical: 10,
      backgroundColor: colors.primary,
      borderRadius: 12,
      textAlign: "center",
    },
  });
