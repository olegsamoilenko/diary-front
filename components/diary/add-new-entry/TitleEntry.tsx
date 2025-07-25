import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { getEmojiByMood } from "@/constants/Mood";
import { GreySmileEmoji } from "@/components/ui/GreySmileEmoji";
import ModalPortal from "@/components/ui/Modal";
import Emoji from "@/components/diary/Emoji";
import { Portal } from "@gorhom/portal";
import ToolTip from "@/components/ui/ToolTip";
import React, { useEffect, useRef, useState } from "react";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";
import { ColorTheme, Entry } from "@/types";
import { useTranslation } from "react-i18next";
import TitleRichEditor from "@/components/diary/add-new-entry/TitleReachEditor";

type TitleEntryProps = {
  onChangeEntry: (entry: (prev: Entry) => Entry) => void;
  entry: Entry;
  isAddNewEntryOpen: boolean;
  onHandleTooltip: (show: boolean) => void;
  isKeyboardOpen: boolean;
  isBoldAction: boolean;
  isItalicAction: boolean;
  colorAction: string;
  sizeAction: number;
  selectedFont: {
    name: string;
    label: string;
    css: string;
  };
  handleFocus: () => void;
  handleBlur: () => void;
  setActiveActions: (actions: (prev: any) => any) => void;
  activeActions: {
    isBold?: boolean;
    isItalic?: boolean;
    isUnderline?: boolean;
    isInsertUnorderedList?: boolean;
    isInsertOrderedList?: boolean;
  } | null;
  disabledTitleReachEditor?: boolean;
  titleReachEditorKey: number;
  titleEmoji: string;
};
export default function TitleEntry({
  onChangeEntry,
  entry,
  isAddNewEntryOpen,
  onHandleTooltip,
  isKeyboardOpen,
  isBoldAction,
  isItalicAction,
  colorAction,
  sizeAction,
  selectedFont,
  handleFocus,
  handleBlur,
  setActiveActions,
  disabledTitleReachEditor,
  titleReachEditorKey,
  titleEmoji,
}: TitleEntryProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const styles = getStyles(colors);
  const { t } = useTranslation();
  const [showTip, setShowTip] = useState(false);
  const [visibleEmojiModal, setVisibleEmojiModal] = useState(false);

  useEffect(() => {
    setShowTip(isAddNewEntryOpen && !entry.mood);
    onHandleTooltip(isAddNewEntryOpen && !entry.mood);
  }, [isAddNewEntryOpen, entry.mood]);

  const setTitle = (title: any) => {
    onChangeEntry((prev: Entry) => ({ ...prev, title }));
  };

  const handleEmoji = () => {
    setShowTip(false);
    setVisibleEmojiModal(true);
  };

  const handleMood = (mood: string) => {
    console.log("Selected mood:", mood);
    onChangeEntry((prev: Entry) => ({ ...prev, mood }));
    setShowTip(false);
    setVisibleEmojiModal(false);
  };

  const onCloseTooltip = () => {
    setShowTip(false);
    onHandleTooltip(false);
  };

  return (
    <View
      style={{
        flex: 0,
        paddingBottom: 10,
        flexDirection: "row",
        gap: 10,
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
      }}
    >
      <View
        style={{
          position: "relative",
        }}
      >
        <TouchableOpacity
          style={{
            position: "relative",
            zIndex: 10,
            right: 0,
            top: 0,
            left: 0,
            bottom: 0,
          }}
          onPress={() => {
            handleEmoji();
          }}
        >
          {entry && entry.mood ? (
            <Text style={styles.moodEmoji}>{getEmojiByMood(entry.mood)}</Text>
          ) : (
            <GreySmileEmoji />
          )}
        </TouchableOpacity>

        <ModalPortal
          visible={visibleEmojiModal}
          onClose={() => setVisibleEmojiModal(false)}
        >
          <Emoji
            handleSelectedEmoji={(mood) => handleMood(mood)}
            mood={entry && entry.mood ? entry!.mood : undefined}
          />
        </ModalPortal>
        <Portal>
          {showTip && (!entry || !entry.mood) && (
            <ToolTip
              position={"right"}
              left={70}
              top={100}
              maxWidth={200}
              onClose={onCloseTooltip}
            >
              {t("toolTips.howAreYouFeeling")}
            </ToolTip>
          )}
        </Portal>
      </View>
      <TitleRichEditor
        titleReachEditorKey={titleReachEditorKey}
        disabledTitleReachEditor={disabledTitleReachEditor}
        title={entry.title}
        setTitle={setTitle}
        isKeyboardOpen={isKeyboardOpen}
        isBoldAction={isBoldAction}
        isItalicAction={isItalicAction}
        colorAction={colorAction}
        sizeAction={sizeAction}
        selectedFont={selectedFont}
        handleFocus={handleFocus}
        handleBlur={handleBlur}
        setActiveActions={setActiveActions}
        titleEmoji={titleEmoji}
      />
    </View>
  );
}

const getStyles = (colors: ColorTheme) =>
  StyleSheet.create({
    moodEmoji: {
      fontSize: 35,
    },
    titleInput: {
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      fontSize: 18,
      paddingVertical: 8,
      marginBottom: 18,
      color: colors.text,
      width: "80%",
    },
  });
