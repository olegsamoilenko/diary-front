import React, { forwardRef } from "react";
import SideSheet, { SideSheetRef } from "@/components/SideSheet";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { AI_MODELS } from "@/constants/AIModels";
import { Colors } from "@/constants/Colors";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useColorScheme } from "@/hooks/useColorScheme";
import { setAiModel } from "@/store/slices/settings/settingsSlice";
import BackArrow from "@/components/ui/BackArrow";
import { ThemedText } from "@/components/ThemedText";
import Background from "@/components/Background";

const ModelSwitcher = forwardRef<SideSheetRef, {}>((props, ref) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const aiModel = useAppSelector((state) => state.settings.aiModel);
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme] ?? Colors.system;
  const styles = getStyles(colors);

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
                key={model.value}
                style={styles.row}
                onPress={() => dispatch(setAiModel(model.key))}
              >
                <View
                  style={[
                    styles.radio,
                    aiModel === model.key && {
                      borderColor: colors.primary,
                    },
                    {
                      borderColor: colors.primary,
                    },
                  ]}
                >
                  {aiModel === model.key && (
                    <View
                      style={[
                        styles.radioDot,
                        { backgroundColor: colors.primary },
                      ]}
                    />
                  )}
                </View>
                <ThemedText style={[styles.label, { color: colors.text }]}>
                  {t(`settings.model.${model.key}`)}
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
