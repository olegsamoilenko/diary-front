import React, { forwardRef, useEffect, useState } from "react";
import SideSheet, { SideSheetRef } from "@/components/SideSheet";
import Background from "@/components/Background";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";
import { useTranslation } from "react-i18next";
import { ColorTheme } from "@/types";
import { StyleSheet, View, Switch } from "react-native";
import BackArrow from "@/components/ui/BackArrow";
import { ThemedText } from "@/components/ThemedText";
import { useBiometry } from "@/context/BiometryContext";

const BiometrySettings = forwardRef<SideSheetRef, {}>((props, ref) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const styles = getStyles(colors);
  const { t } = useTranslation();
  const { biometryEnabled, setBiometry } = useBiometry();

  return (
    <SideSheet ref={ref}>
      <Background background={colors.backgroundImage} paddingTop={10}>
        <View style={styles.container}>
          <BackArrow ref={ref} />
          <ThemedText
            type={"titleLG"}
            style={{
              marginBottom: 20,
            }}
          >
            {t("settings.biometry.title")}
          </ThemedText>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            {biometryEnabled ? (
              <ThemedText>{t(`settings.biometry.on`)}</ThemedText>
            ) : (
              <ThemedText>{t(`settings.biometry.off`)}</ThemedText>
            )}
            <Switch
              value={biometryEnabled}
              onValueChange={setBiometry}
              trackColor={{
                false: colors.background,
                true: colors.background,
              }}
              thumbColor={biometryEnabled ? colors.primary : "#acacac"}
              ios_backgroundColor="#3e3e3e"
            />
          </View>
        </View>
      </Background>
    </SideSheet>
  );
});

BiometrySettings.displayName = "BiometrySettings";

export default BiometrySettings;

const getStyles = (colors: ColorTheme) =>
  StyleSheet.create({
    container: {
      paddingHorizontal: 20,
      flex: 1,
      marginBottom: -6,
    },
  });
