import { StyleSheet, View } from "react-native";
import React from "react";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";
import type { ColorTheme, EntrySettings } from "@/types";
import BackgroundSetting from "@/components/diary/add-new-entry/settings-entry/BackgroundSetting";
import EmojiSetting from "@/components/diary/add-new-entry/settings-entry/EmojiSetting";
import TitleSettingEntry from "@/components/diary/add-new-entry/settings-entry/TitleSettingEntry";
import { useTranslation } from "react-i18next";
import ColorSetting from "@/components/diary/add-new-entry/settings-entry/ColorSetting";
import SizeSetting from "@/components/diary/add-new-entry/settings-entry/SizeSetting";
import FontSetting from "@/components/diary/add-new-entry/settings-entry/FontSetting";

type SettingsEntryProps = {
  keyboardHeight: number;
  entrySettings: EntrySettings;
  setShowBackgroundSetting?: (value: boolean) => void;
  showBackgroundSetting?: boolean;
  onChangeBackground?: (background: any) => void;
  setShowColorSetting: (value: boolean) => void;
  showColorSetting: boolean;
  setColor: (color: string) => void;
  selectedColor: string;
  setShowSizeSetting: (value: boolean) => void;
  showSizeSetting: boolean;
  setSize: (size: number) => void;
  selectedSize?: number;
  setShowFontSetting: (value: boolean) => void;
  showFontSetting: boolean;
  setFont: (font: any) => void;
  selectedFont: any;
  setShowEmojiSetting?: (value: boolean) => void;
  showEmojiSetting?: boolean;
  addEmoji: (emoji: string) => void;
};

export default function SettingsEntry({
  keyboardHeight,
  entrySettings,
  setShowBackgroundSetting,
  showBackgroundSetting,
  onChangeBackground,
  setShowColorSetting,
  showColorSetting,
  setColor,
  selectedColor,
  setShowSizeSetting,
  showSizeSetting,
  setSize,
  selectedSize,
  setShowFontSetting,
  showFontSetting,
  setFont,
  selectedFont,
  setShowEmojiSetting,
  showEmojiSetting,
  addEmoji,
}: SettingsEntryProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const styles = getStyles(colors, keyboardHeight);
  const { t } = useTranslation();

  return (
    <View
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        top: 0,
      }}
    >
      {showBackgroundSetting &&
        setShowBackgroundSetting &&
        onChangeBackground && (
          <View style={styles.setting}>
            <TitleSettingEntry
              title={t("diary.entry.settings.background")}
              onPress={setShowBackgroundSetting}
            />
            <BackgroundSetting
              backgroundEntry={entrySettings.background}
              onChangeBackground={onChangeBackground}
            ></BackgroundSetting>
          </View>
        )}

      {showColorSetting && (
        <View style={styles.setting}>
          <TitleSettingEntry
            title={t("diary.entry.settings.color")}
            onPress={setShowColorSetting}
          />
          <ColorSetting
            setColor={setColor}
            selectedColor={selectedColor}
          ></ColorSetting>
        </View>
      )}

      {showSizeSetting && (
        <View style={styles.setting}>
          <TitleSettingEntry
            title={t("diary.entry.settings.size")}
            onPress={setShowSizeSetting}
          />
          <SizeSetting
            setSize={setSize}
            selectedSize={selectedSize}
          ></SizeSetting>
        </View>
      )}

      {showFontSetting && (
        <View style={styles.setting}>
          <TitleSettingEntry
            title={t("diary.entry.settings.font")}
            onPress={setShowFontSetting}
          />
          <FontSetting
            setFont={setFont}
            selectedFont={selectedFont}
          ></FontSetting>
        </View>
      )}

      {showEmojiSetting && setShowEmojiSetting && (
        <View style={styles.setting}>
          <TitleSettingEntry
            title={t("diary.entry.settings.emoji")}
            onPress={setShowEmojiSetting}
          />
          <EmojiSetting setEmoji={addEmoji}></EmojiSetting>
        </View>
      )}
    </View>
  );
}

const getStyles = (colors: ColorTheme, keyboardHeight: number) =>
  StyleSheet.create({
    container: {
      // position: "relative",
      flexDirection: "row",
      justifyContent: "space-between",
      // alignItems: "center",
      padding: 10,
      // height: 50,
      // bottom: keyboardHeight,
      backgroundColor: colors.background,
      width: "100%",
      // zIndex: 80,
      // borderWidth: 0,
      // elevation: 8,
    },
    setting: {
      position: "absolute",
      bottom: 0,
      zIndex: 10,
      // minHeight: 50,
      // backgroundColor: "blue",
      // zIndex: 101,
      width: "100%",
      // padding: 10,
    },
  });
