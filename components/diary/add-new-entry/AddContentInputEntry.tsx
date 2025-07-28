import { StyleSheet, View } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import type { ColorTheme, Entry, EntrySettings } from "@/types";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";
import SettingsEntry from "@/components/diary/add-new-entry/settings-entry/SettingsEntry";
import debounce from "lodash.debounce";
import { FONTS } from "@/assets/fonts/entry";
import RichToolbar from "@/components/ui/RichToolbar";
import TextReachEditor from "@/components/diary/add-new-entry/TextReachEditor";

type InputEntryProps = {
  entry: Entry;
  isKeyboardOpen: boolean;
  isEntrySaved: boolean;
  loading: boolean;
  keyboardHeight: number;
  onChangeEntry: (entry: (prev: Entry) => Entry) => void;
  onChangeEntrySettings: (settings: any) => void;
  onHandleSave: () => void;
  tooltipVisible: boolean;
  entrySettings: EntrySettings;
  textReachEditorKey: number;
  showBackgroundSetting: boolean;
  setShowBackgroundSetting: (show: boolean) => void;
  showSizeSetting: boolean;
  setShowSizeSetting: (show: boolean) => void;
  showFontSetting: boolean;
  setShowFontSetting: (show: boolean) => void;
  showColorSetting: boolean;
  setShowColorSetting: (show: boolean) => void;
  showEmojiSetting: boolean;
  setShowEmojiSetting: (show: boolean) => void;
  isFocusTextRichEditor: boolean;
  setIsFocusTextRichEditor: (focus: boolean) => void;
  emoji: string;
  addEmoji: (emoji: string) => void;
};

export default function AddContentInputEntry({
  entry,
  isKeyboardOpen,
  keyboardHeight,
  onChangeEntry,
  onChangeEntrySettings,
  tooltipVisible,
  entrySettings,
  textReachEditorKey,
  showBackgroundSetting,
  setShowBackgroundSetting,
  showSizeSetting,
  setShowSizeSetting,
  showFontSetting,
  setShowFontSetting,
  showColorSetting,
  setShowColorSetting,
  showEmojiSetting,
  setShowEmojiSetting,
  isFocusTextRichEditor,
  setIsFocusTextRichEditor,
  emoji,
  addEmoji,
}: InputEntryProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme] ?? Colors.system;
  const [showImageSetting, setShowImageSetting] = useState(false);
  const [showPhotoSetting, setShowPhotoSetting] = useState(false);
  const [selectedColor, setSelectedColor] = useState(colors.text);
  const [selectedSize, setSelectedSize] = useState(16);
  const [selectedFont, setSelectedFont] = useState(FONTS[0]);
  const [content, setContent] = useState("");
  const [isBoldAction, setIsBoldAction] = useState(false);
  const [isItalicAction, setIsItalicAction] = useState(false);
  const [isUnderlineAction, setIsUnderlineAction] = useState(false);
  const [isBulletedListAction, setIsBulletedListAction] = useState(false);
  const [isOrderedListAction, setIsOrderedListAction] = useState(false);
  const [sizeAction, setSizeAction] = useState(16);
  const [colorAction, setColorAction] = useState(colors.text);
  const [activeActions, setActiveActions] = useState<Record<string, boolean>>(
    {},
  );

  const setEntryContent = (content: any) => {
    onChangeEntry((prev: Entry) => ({ ...prev, content }));
  };

  const debouncedSave = useCallback(
    debounce((content: string) => {
      setEntryContent(content);
    }, 300),
    [],
  );

  useEffect(() => {
    debouncedSave(content);
  }, [content]);

  const handleBackgroundAction = () => {
    setShowBackgroundSetting(true);
  };

  const handleBoldAction = () => {
    setIsBoldAction(!isBoldAction);
  };

  const handleItalicAction = () => {
    setIsItalicAction(!isItalicAction);
  };

  const handleUnderlineAction = () => {
    setIsUnderlineAction(!isUnderlineAction);
  };

  const setColor = (color: string) => {
    setSelectedColor(color);
    setColorAction(color);
  };

  const setSize = (size: number) => {
    setSelectedSize(size);
    setSizeAction(size);
  };

  const handleBulletedListAction = () => {
    setIsBulletedListAction(!isBulletedListAction);
  };

  const handleOrderedListAction = () => {
    setIsOrderedListAction(!isOrderedListAction);
  };

  const handleColorAction = () => {
    if (isKeyboardOpen) {
      setShowColorSetting(true);
    }
  };

  const handleSizeAction = () => {
    if (isKeyboardOpen) {
      setShowSizeSetting(true);
    }
  };

  const handleFontAction = () => {
    setShowFontSetting(true);
  };

  const setFont = (font: any) => {
    setSelectedFont(font);
  };

  const handleEmojiAction = () => {
    setShowEmojiSetting(true);
  };

  const handleEmoji = (emoji: string) => {
    addEmoji(emoji);
    setShowEmojiSetting(false);
  };

  const handleFocus = () => {
    setIsFocusTextRichEditor(true);
  };

  const handleBlur = () => {
    setIsFocusTextRichEditor(false);
  };

  const handleImageAction = () => {
    setShowImageSetting(true);
  };

  const handlePhotoAction = () => {
    setShowPhotoSetting(true);
  };

  return (
    <View
      style={{
        flex: 1,
        marginBottom:
          isKeyboardOpen && !tooltipVisible
            ? 0
            : !isKeyboardOpen && tooltipVisible
              ? 0
              : !isKeyboardOpen && !tooltipVisible
                ? -33
                : 0,
      }}
    >
      <TextReachEditor
        textReachEditorKey={textReachEditorKey}
        content={content}
        setContent={setContent}
        isKeyboardOpen={isKeyboardOpen}
        isBoldAction={isBoldAction}
        isItalicAction={isItalicAction}
        isUnderlineAction={isUnderlineAction}
        isBulletedListAction={isBulletedListAction}
        isOrderedListAction={isOrderedListAction}
        colorAction={colorAction}
        sizeAction={sizeAction}
        selectedFont={selectedFont}
        handleFocus={handleFocus}
        handleBlur={handleBlur}
        setActiveActions={setActiveActions}
        showImageSetting={showImageSetting}
        setShowImageSetting={setShowImageSetting}
        showPhotoSetting={showPhotoSetting}
        setShowPhotoSetting={setShowPhotoSetting}
        emoji={emoji}
      />

      {isKeyboardOpen && isFocusTextRichEditor && (
        <RichToolbar
          actions={{
            background: true,
            bold: true,
            italic: true,
            underline: true,
            color: true,
            size: true,
            font: true,
            bulletedList: true,
            orderedList: true,
            emoji: true,
            photo: true,
            image: true,
          }}
          activeActions={activeActions}
          handleBackgroundAction={handleBackgroundAction}
          handleBoldAction={handleBoldAction}
          handleItalicAction={handleItalicAction}
          handleUnderlineAction={handleUnderlineAction}
          handleColorAction={handleColorAction}
          handleSizeAction={handleSizeAction}
          handleFontAction={handleFontAction}
          handleBulletedListAction={handleBulletedListAction}
          handleOrderedListAction={handleOrderedListAction}
          handleEmojiAction={handleEmojiAction}
          handleImageAction={handleImageAction}
          handlePhotoAction={handlePhotoAction}
        ></RichToolbar>
      )}
      <SettingsEntry
        keyboardHeight={keyboardHeight}
        entrySettings={entrySettings}
        setShowBackgroundSetting={setShowBackgroundSetting}
        showBackgroundSetting={showBackgroundSetting}
        onChangeBackground={onChangeEntrySettings}
        setShowColorSetting={setShowColorSetting}
        showColorSetting={showColorSetting}
        setColor={setColor}
        selectedColor={selectedColor}
        setShowSizeSetting={setShowSizeSetting}
        showSizeSetting={showSizeSetting}
        selectedSize={selectedSize}
        setShowFontSetting={setShowFontSetting}
        showFontSetting={showFontSetting}
        setSize={setSize}
        setFont={setFont}
        selectedFont={selectedFont}
        setShowEmojiSetting={setShowEmojiSetting}
        showEmojiSetting={showEmojiSetting}
        addEmoji={handleEmoji}
      />
    </View>
  );
}

const getStyles = (colors: ColorTheme, isKeyboardOpen: boolean) =>
  StyleSheet.create({});
