import SideSheet, { SideSheetRef } from "@/components/SideSheet";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import BackArrow from "@/components/ui/BackArrow";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import React, { forwardRef, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Fonts } from "@/constants/Fonts";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "@/store";
import { getFont } from "@/utils";
import Background from "@/components/Background";
import { Font } from "@/types";
import { updateSettings } from "@/store/thunks/settings/updateSettings";

const FontSwitcher = forwardRef<SideSheetRef, {}>((props, ref) => {
  const settings = useSelector((s: RootState) => s.settings.value);
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const styles = useMemo(() => getStyles(colors), [colors]);

  const handleFont = async (font: Font) => {
    try {
      await dispatch(updateSettings({ font })).unwrap();
    } catch (error: any) {
      console.warn("Failed to update font", error);
      console.warn("Failed to update font response", error.response);
    }
  };

  return (
    <SideSheet ref={ref}>
      <Background background={colors.backgroundImage} paddingTop={10}>
        <View style={styles.container}>
          <BackArrow ref={ref} />
          <ThemedText
            type="titleLG"
            style={{
              marginBottom: 16,
            }}
          >
            {t("settings.font.titlePlural")}
          </ThemedText>
          <ScrollView
            style={{ marginBottom: 0 }}
            showsVerticalScrollIndicator={false}
          >
            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                rowGap: 16,
                columnGap: 6,
                justifyContent: "space-between",
              }}
            >
              {Fonts.map((f) => {
                return (
                  <TouchableOpacity
                    key={f.name}
                    onPress={() => handleFont(f.name)}
                  >
                    <View style={styles.fontContainer}>
                      <Text
                        style={{
                          fontFamily: getFont(f.name, "regular"),
                          color: colors.text,
                          textAlign: "center",
                          fontSize: 16,
                        }}
                      >
                        {f.title}
                      </Text>
                    </View>
                    <View
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        borderRadius: 10,
                        borderWidth: 3,
                        borderColor:
                          f.name === settings?.font
                            ? colors.primary
                            : "transparent",
                      }}
                    />
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>
        </View>
      </Background>
    </SideSheet>
  );
});

FontSwitcher.displayName = "FontSwitcher";
export default FontSwitcher;

const getStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flexDirection: "column",
      flex: 1,
      paddingHorizontal: 15,
      marginBottom: -6,
    },
    fontContainer: {
      width: 100,
      height: 100,
      borderRadius: 10,
      elevation: 5,
      padding: 10,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: colors.backgroundAdditional,
    },
  });
