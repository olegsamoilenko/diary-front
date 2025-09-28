import React, { forwardRef, useEffect, useMemo } from "react";
import SideSheet, { SideSheetRef } from "@/components/SideSheet";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { AI_MODELS } from "@/constants/AIModels";
import { Colors } from "@/constants/Colors";
import { useTranslation } from "react-i18next";
import { useColorScheme } from "@/hooks/useColorScheme";
import BackArrow from "@/components/ui/BackArrow";
import { ThemedText } from "@/components/ThemedText";
import Background from "@/components/Background";
import { AiModel } from "@/types";
import { apiRequest } from "@/utils";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "@/store";
import { updateSettings } from "@/store/thunks/settings/updateSettings";

const ModelSwitcher = forwardRef<SideSheetRef, {}>((props, ref) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const styles = useMemo(() => getStyles(colors), [colors]);
  const settings = useSelector((s: RootState) => s.settings.value);

  const handleAiModel = async (aiModel: AiModel) => {
    try {
      await dispatch(updateSettings({ aiModel })).unwrap();
      await apiRequest({
        url: `/users/update-settings`,
        method: "POST",
        data: { aiModel },
      });
    } catch (error: any) {
      console.warn("Failed to update aiModel", error);
      console.warn("Failed to update aiModel response", error.response);
    }
  };

  return (
    <SideSheet ref={ref}>
      <Background background={colors.backgroundImage} paddingTop={10}>
        <View style={styles.container}>
          <BackArrow ref={ref} />
          <ThemedText type={"titleLG"}>
            {t("settings.model.titlePlural")}
          </ThemedText>
          <ScrollView style={{ marginBottom: 0 }}>
            {AI_MODELS.map((model) => (
              <TouchableOpacity
                key={model}
                style={styles.row}
                onPress={() => handleAiModel(model)}
              >
                <View
                  style={[
                    styles.radio,
                    settings?.aiModel === model && {
                      borderColor: colors.primary,
                    },
                    {
                      borderColor: colors.primary,
                    },
                  ]}
                >
                  {settings?.aiModel === model && (
                    <View
                      style={[
                        styles.radioDot,
                        { backgroundColor: colors.primary },
                      ]}
                    />
                  )}
                </View>
                <ThemedText style={[styles.label, { color: colors.text }]}>
                  {t(`settings.model.${model}`)}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </Background>
    </SideSheet>
  );
});

ModelSwitcher.displayName = "ThemeSwitcher";
export default ModelSwitcher;
const getStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      paddingLeft: 20,
      flex: 1,
      marginBottom: -6,
    },
    row: {
      flexDirection: "row",
      alignItems: "center",
      marginVertical: 10,
    },
    radio: {
      width: 22,
      height: 22,
      borderRadius: 12,
      borderWidth: 2,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 12,
    },
    radioDot: {
      width: 10,
      height: 10,
      borderRadius: 6,
    },
    label: {
      fontSize: 16,
      color: colors.text,
    },
  });
