import React, { forwardRef } from "react";
import SideSheet, { SideSheetRef } from "@/components/SideSheet";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { AI_MODELS } from "@/constants/AIModels";
import { Colors } from "@/constants/Colors";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useColorScheme } from "@/hooks/useColorScheme";
import { setAiModel } from "@/store/slices/settings/settingsSlice";

const ModelSwitcher = forwardRef<SideSheetRef, {}>((props, ref) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const aiModel = useAppSelector((state) => state.settings.aiModel);
  const colorScheme = useColorScheme();

  return (
    <SideSheet ref={ref} isKeyboardOpen={false}>
      <View style={styles.container}>
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
                  borderColor: Colors[colorScheme].radioSelectedBorder,
                  backgroundColor: Colors[colorScheme].radioSelectedBackground,
                },
                {
                  borderColor: Colors[colorScheme].radioBorder,
                  backgroundColor: Colors[colorScheme].radioBackground,
                },
              ]}
            >
              {aiModel === model.key && (
                <View
                  style={[
                    styles.radioDot,
                    { backgroundColor: Colors[colorScheme].radioSelectedDot },
                  ]}
                />
              )}
            </View>
            <Text style={[styles.label, { color: Colors[colorScheme].text }]}>
              {t(`settings.model.${model.key}`)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </SideSheet>
  );
});

ModelSwitcher.displayName = "ThemeSwitcher";
export default ModelSwitcher;

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
    gap: 16,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
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
    backgroundColor: "#0284c7",
  },
  label: {
    fontSize: 16,
    color: "#18181b",
  },
});
