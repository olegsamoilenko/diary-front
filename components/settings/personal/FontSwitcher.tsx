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
import React, { forwardRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Fonts } from "@/constants/Fonts";
import { useSelector, useDispatch } from "react-redux";
import { setFont } from "@/store/slices/settings/fontSlice";
import type { RootState } from "@/store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { apiRequest, getFont } from "@/utils";
import Background from "@/components/Background";
import * as SecureStore from "expo-secure-store";
import type { User } from "@/types";
import { Font } from "@/types";

const FontSwitcher = forwardRef<SideSheetRef, {}>((props, ref) => {
  const font = useSelector((state: RootState) => state.font);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const styles = getStyles(colors);

  const handleFont = async (font: Font) => {
    dispatch(setFont(font));
    try {
      await apiRequest({
        url: `/users/update-settings`,
        method: "POST",
        data: { font },
      });

      const stored = await SecureStore.getItemAsync("user");
      const user: User | null = stored ? JSON.parse(stored) : null;

      if (user?.settings) {
        user.settings.font = font;
        await SecureStore.setItemAsync("user", JSON.stringify(user));
      }
    } catch (error) {
      console.warn("Failed to update lang", error);
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
          <ScrollView style={{ marginBottom: 0 }}>
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
                          f.name === font ? colors.primary : "transparent",
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
