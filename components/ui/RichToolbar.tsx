import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import React from "react";
import type { ColorTheme } from "@/types";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";

type RichToolbarProps = {
  actions?: {
    background?: boolean;
    bold?: boolean;
    italic?: boolean;
    underline?: boolean;
    color?: boolean;
    size?: boolean;
    font?: boolean;
    bulletedList?: boolean;
    orderedList?: boolean;
    emoji?: boolean;
    image?: boolean;
    photo?: boolean;
  };
  activeActions: {
    isBold?: boolean;
    isItalic?: boolean;
    isUnderline?: boolean;
    isInsertUnorderedList?: boolean;
    isInsertOrderedList?: boolean;
  } | null;
  handleBackgroundAction?: () => void;
  handleBoldAction?: () => void;
  handleItalicAction?: () => void;
  handleUnderlineAction?: () => void;
  handleColorAction?: () => void;
  handleSizeAction?: () => void;
  handleFontAction?: () => void;
  handleBulletedListAction?: () => void;
  handleOrderedListAction?: () => void;
  handleEmojiAction?: () => void;
  handleImageAction?: () => void;
  handlePhotoAction?: () => void;
};
export default function RichToolbar({
  actions,
  activeActions,
  handleBackgroundAction,
  handleBoldAction,
  handleItalicAction,
  handleUnderlineAction,
  handleColorAction,
  handleSizeAction,
  handleFontAction,
  handleBulletedListAction,
  handleOrderedListAction,
  handleEmojiAction,
  handleImageAction,
  handlePhotoAction,
}: RichToolbarProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const styles = getStyles(colors);
  return (
    <View
      style={{
        width: "100%",
      }}
    >
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        pointerEvents="auto"
        contentContainerStyle={styles.richToolbar}
      >
        {actions?.background && (
          <TouchableOpacity onPress={handleBackgroundAction}>
            <MaterialIcons
              name="texture"
              size={24}
              color={colors.toolbarIcon}
            />
          </TouchableOpacity>
        )}

        {actions?.bold && (
          <TouchableOpacity
            onPress={handleBoldAction}
            style={{
              backgroundColor: activeActions?.isBold
                ? colors.backgroundAdditional
                : "transparent",
            }}
          >
            <MaterialIcons
              name="format-bold"
              size={24}
              color={colors.toolbarIcon}
            />
          </TouchableOpacity>
        )}

        {actions?.italic && (
          <TouchableOpacity
            onPress={handleItalicAction}
            style={{
              backgroundColor: activeActions?.isItalic
                ? colors.backgroundAdditional
                : "transparent",
            }}
          >
            <MaterialIcons
              name="format-italic"
              size={24}
              color={colors.toolbarIcon}
            />
          </TouchableOpacity>
        )}

        {actions?.underline && (
          <TouchableOpacity
            onPress={handleUnderlineAction}
            style={{
              backgroundColor: activeActions?.isUnderline
                ? colors.backgroundAdditional
                : "transparent",
            }}
          >
            <MaterialIcons
              name="format-underlined"
              size={24}
              color={colors.toolbarIcon}
            />
          </TouchableOpacity>
        )}

        {actions?.color && (
          <TouchableOpacity onPress={handleColorAction}>
            <MaterialIcons
              name="color-lens"
              size={24}
              color={colors.toolbarIcon}
            />
          </TouchableOpacity>
        )}

        {actions?.size && (
          <TouchableOpacity onPress={handleSizeAction}>
            <MaterialIcons
              name="format-size"
              size={24}
              color={colors.toolbarIcon}
            />
          </TouchableOpacity>
        )}

        {actions?.font && (
          <TouchableOpacity onPress={handleFontAction}>
            <MaterialIcons
              name="text-format"
              size={24}
              color={colors.toolbarIcon}
            />
          </TouchableOpacity>
        )}

        {actions?.bulletedList && (
          <TouchableOpacity
            onPress={handleBulletedListAction}
            style={{
              backgroundColor: activeActions?.isInsertUnorderedList
                ? colors.backgroundAdditional
                : "transparent",
            }}
          >
            <MaterialIcons
              name="format-list-bulleted"
              size={24}
              color={colors.toolbarIcon}
            />
          </TouchableOpacity>
        )}

        {actions?.orderedList && (
          <TouchableOpacity
            onPress={handleOrderedListAction}
            style={{
              backgroundColor: activeActions?.isInsertOrderedList
                ? colors.backgroundAdditional
                : "transparent",
            }}
          >
            <MaterialIcons
              name="format-list-numbered"
              size={24}
              color={colors.toolbarIcon}
            />
          </TouchableOpacity>
        )}

        {actions?.emoji && (
          <TouchableOpacity onPress={handleEmojiAction}>
            <MaterialIcons
              name="sentiment-satisfied-alt"
              size={24}
              color={colors.toolbarIcon}
            />
          </TouchableOpacity>
        )}

        {actions?.image && (
          <TouchableOpacity onPress={handleImageAction}>
            <Ionicons
              name="image-outline"
              size={24}
              color={colors.toolbarIcon}
            />
          </TouchableOpacity>
        )}

        {actions?.photo && (
          <TouchableOpacity onPress={handlePhotoAction}>
            <Ionicons
              name="camera-outline"
              size={24}
              color={colors.toolbarIcon}
            />
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
}

const getStyles = (colors: ColorTheme) =>
  StyleSheet.create({
    richToolbar: {
      flexDirection: "row",
      justifyContent: "space-between",
      padding: 10,
      gap: 15,
      backgroundColor: colors.toolbarBackground,
      minWidth: "100%",
    },
  });
