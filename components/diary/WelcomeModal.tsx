import ModalPortal from "@/components/ui/Modal";
import { ThemedText } from "@/components/ThemedText";
import React, { useEffect, useState } from "react";
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
  const styles = getStyles(colors);

  useEffect(() => {
    const getData = async () => {
      // await AsyncStorage.removeItem("show_welcome");
      const value = await AsyncStorage.getItem("show_welcome");
      if (value === null) {
        setShowWelcome(true);
      } else {
        setShowWelcome(value === "true");
      }
    };
    getData();
  }, []);

  useEffect(() => {
    const storeData = async () => {
      try {
        await AsyncStorage.setItem("show_welcome", JSON.stringify(!checked));
      } catch (e) {
        console.error("Failed to save the data to the storage", e);
      }
    };
    storeData();
  }, [checked]);
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
          onChange={setChecked}
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
