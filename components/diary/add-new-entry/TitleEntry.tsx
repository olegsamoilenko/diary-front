import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { GreySmileEmoji } from "@/components/ui/GreySmileEmoji";
import ModalPortal from "@/components/ui/Modal";
import Emoji from "@/components/diary/Emoji";
import { Portal } from "@gorhom/portal";
import ToolTip from "@/components/ui/ToolTip";

import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";
import { ColorTheme, Entry } from "@/types";
import { useTranslation } from "react-i18next";
import TitleReachEditor from "@/components/diary/add-new-entry/TitleReachEditor";

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
  setShowTip: (show: boolean) => void;
  showTip?: boolean;
  isOpen: boolean;
};
export default React.memo(function TitleEntry({
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
  setShowTip,
  showTip,
  isOpen,
}: TitleEntryProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const styles = useMemo(() => getStyles(colors), [colors]);
  const { t } = useTranslation();

  const [visibleEmojiModal, setVisibleEmojiModal] = useState(false);

  useEffect(() => {
    setShowTip(isAddNewEntryOpen && !entry.mood);
    onHandleTooltip(isAddNewEntryOpen && !entry.mood);
  }, [isAddNewEntryOpen, entry.mood]);

  const setTitle = useCallback(
    (title: string) => {
      onChangeEntry((prev) => ({ ...prev, title }));
    },
    [onChangeEntry],
  );

  const handleEmoji = useCallback(() => {
    setShowTip(false);
    setVisibleEmojiModal(true);
  }, [setShowTip]);

  const handleMood = useCallback(
    (mood: string) => {
      onChangeEntry((prev: Entry) => ({ ...prev, mood }));
      setShowTip(false);
      setVisibleEmojiModal(false);
    },
    [onChangeEntry, setShowTip],
  );

  const onCloseTooltip = useCallback(() => {
    setShowTip(false);
    onHandleTooltip(false);
  }, [onHandleTooltip, setShowTip]);

  return (
    <View style={styles.root}>
      <View style={styles.left}>
        <TouchableOpacity
          style={styles.moodButton}
          onPress={() => {
            handleEmoji();
          }}
        >
          {entry && entry.mood ? (
            <Text style={styles.moodEmoji}>{entry.mood}</Text>
          ) : (
            <GreySmileEmoji />
          )}
        </TouchableOpacity>

        <ModalPortal
          visible={visibleEmojiModal}
          maxHeight={true}
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
      <TitleReachEditor
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
        isOpen={isOpen}
      />
    </View>
  );
});

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
    root: {
      flex: 0,
      paddingBottom: 10,
      flexDirection: "row",
      gap: 10,
      justifyContent: "center",
      alignItems: "center",
      position: "relative",
    },
    left: {
      position: "relative",
    },
    moodButton: {
      position: "relative",
      zIndex: 10,
    },
  });
