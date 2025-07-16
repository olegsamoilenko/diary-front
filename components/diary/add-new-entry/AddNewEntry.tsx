import React, { forwardRef, useEffect, useRef, useState } from "react";
import SideSheet, { SideSheetRef } from "@/components/SideSheet";
import {
  StyleSheet,
  TextInput,
  View,
  Keyboard,
  Platform,
  KeyboardAvoidingView,
  TouchableHighlight,
  TouchableOpacity,
  ActivityIndicator,
  Pressable,
} from "react-native";
import { AiComment, ColorTheme, Entry } from "@/types";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";
import { apiRequest, getFont, getTodayDateStr } from "@/utils";
import { useAppSelector } from "@/store/hooks";
import { useTranslation } from "react-i18next";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import BackArrow from "@/components/ui/BackArrow";
import TitleEntry from "@/components/diary/add-new-entry/TitleEntry";
import AddContentInputEntry from "@/components/diary/add-new-entry/AddContentInputEntry";
import ContentEntry from "@/components/diary/add-new-entry/ContentEntry";
import type { EntrySettings } from "@/types";
import Background from "@/components/diary/add-new-entry/Background";
import i18n from "i18next";
import { ThemedText } from "@/components/ThemedText";
import RichToolbar from "@/components/ui/RichToolbar";
import SettingsEntry from "@/components/diary/add-new-entry/settings-entry/SettingsEntry";
import { FONTS } from "@/assets/fonts/entry";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";

type ActiveActions = {
  isBold?: boolean;
  isItalic?: boolean;
  isUnderline?: boolean;
  isInsertUnorderedList?: boolean;
  isInsertOrderedList?: boolean;
};

const AddNewEntry = forwardRef<
  SideSheetRef,
  { isOpen: boolean; handleBack: (back: boolean) => void; tabBarHeight: number }
>((props, ref) => {
  const aiModel = useAppSelector((state) => state.settings.aiModel);
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const lang = i18n.language || "uk";
  const [isBoldAction, setIsBoldAction] = useState(false);
  const [isItalicAction, setIsItalicAction] = useState(false);
  const [sizeAction, setSizeAction] = useState(16);
  const [colorAction, setColorAction] = useState(colors.text);
  const [showBackgroundSetting, setShowBackgroundSetting] = useState(false);
  const [showFontSetting, setShowFontSetting] = useState(false);
  const [showSizeSetting, setShowSizeSetting] = useState(false);
  const [showColorSetting, setShowColorSetting] = useState(false);
  const [showTitleFontSetting, setShowTitleFontSetting] = useState(false);
  const [showTitleSizeSetting, setShowTitleSizeSetting] = useState(false);
  const [showTitleColorSetting, setShowTitleColorSetting] = useState(false);
  const [selectedColor, setSelectedColor] = useState(colors.text);
  const [selectedFont, setSelectedFont] = useState(FONTS[0]);
  const [selectedSize, setSelectedSize] = useState(16);
  const [aiDialogLoading, setAiDialogLoading] = useState(false);
  const [textReachEditorKey, setTextReachEditorKey] = useState(0);
  const [titleReachEditorKey, setTitleReachEditorKey] = useState(0);
  const [isFocusTextRichEditor, setIsFocusTextRichEditor] = useState(false);
  const font = useSelector((state: RootState) => state.font.font);

  const [entry, setEntry] = useState<Entry>({
    id: 0,
    title: "",
    content: "",
    mood: "",
    aiComment: {
      content: "",
      aiModel: aiModel,
    },
    embedding: [],
    dialogs: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  const [entrySettings, setEntrySettings] = useState<EntrySettings>({
    background: {
      id: 0,
      type: "color",
      value: colors.card,
      url: undefined,
    },
  });

  const { t } = useTranslation();
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);

  const [isAddNewEntryOpen, setIsAddNewEntryOpen] = useState(false);

  const [isEntrySaved, setIsEntrySaved] = useState(false);
  const today = new Date();
  const todayDate = getTodayDateStr(today.toString(), lang);
  const [activeActions, setActiveActions] = useState<ActiveActions | null>(
    null,
  );
  const [isFocusTitleRichEditor, setIsFocusTitleRichEditor] = useState(false);
  const [dialogQuestion, setDialogQuestion] = useState("");

  useEffect(() => {
    setColorAction(colors.text);
  }, [colorScheme]);

  useEffect(() => {
    if (!isAddNewEntryOpen) {
      setIsEntrySaved(false);
    }

    setEntry({
      id: 0,
      title: "",
      content: "",
      mood: "",
      aiComment: {
        content: "",
        aiModel: aiModel,
      },
      embedding: [],
      dialogs: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    setEntrySettings({
      background: {
        id: 0,
        type: "color",
        value: colors.card,
        url: undefined,
      },
    });
  }, [isAddNewEntryOpen]);

  useEffect(() => {
    const onKeyboardShow = Keyboard.addListener("keyboardDidShow", () => {
      setIsKeyboardOpen(true);
    });

    const onKeyboardHide = Keyboard.addListener("keyboardDidHide", () => {
      setIsKeyboardOpen(false);
    });

    return () => {
      onKeyboardShow.remove();
      onKeyboardHide.remove();
    };
  }, []);

  const handleBoldAction = () => {
    setIsBoldAction(!isBoldAction);
  };

  const handleItalicAction = () => {
    setIsItalicAction(!isItalicAction);
  };

  const setColor = (color: string) => {
    setSelectedColor(color);
    setColorAction(color);
  };

  const setSize = (size: number) => {
    setSelectedSize(size);
    setSizeAction(size);
  };

  const setFont = (font: any) => {
    setSelectedFont(font);
  };

  const handleFontAction = () => {
    setShowTitleFontSetting(true);
  };

  const handleColorAction = () => {
    if (isKeyboardOpen) {
      setShowTitleColorSetting(true);
    }
  };

  const handleSizeAction = () => {
    if (isKeyboardOpen) {
      setShowTitleSizeSetting(true);
    }
  };

  const handleFocus = () => {
    console.log(111);
    setIsFocusTitleRichEditor(true);
  };

  const handleBlur = () => {
    console.log(222);
    setIsFocusTitleRichEditor(false);
  };

  useEffect(() => {
    const onShow = (e: any) => setKeyboardHeight(e.endCoordinates.height);
    const onHide = () => setKeyboardHeight(0);

    const showListener = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow",
      onShow,
    );
    const hideListener = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide",
      onHide,
    );

    return () => {
      showListener.remove();
      hideListener.remove();
    };
  }, []);

  const handleSave = async () => {
    console.log("handleSave called");
    setLoading(true);
    setIsFocusTitleRichEditor(false);
    setIsFocusTextRichEditor(false);
    setTextReachEditorKey((k) => k + 1);
    setTitleReachEditorKey((k) => k + 1);

    console.log("Saving entry:", entry);

    try {
      // const res = await apiRequest({
      //   url: `/diary-entries/create`,
      //   method: "POST",
      //   data: {
      //     title: entry.title,
      //     content: entry.content,
      //     mood: entry.mood,
      //     aiModel,
      //     settings: entrySettings,
      //   },
      // });
      //
      // if (!res || res.status !== 201) {
      //   console.log("No data returned from server");
      //   setLoading(false);
      //   return;
      // }
      //
      // const newEntry: Entry = res.data;
      //
      // setEntry((prev) => ({ ...prev, ...newEntry }));
      //
      setLoading(false);
      //
      // setIsEntrySaved(true);
      //
      // // if (ref && typeof ref !== "function" && ref?.current) {
      // //   ref.current.close();
      // // }
      //
      // // if (props.onSuccess && entry) props.onSuccess(entry);
      //
      // await generateAiContent(
      //   Number(newEntry!.id),
      //   newEntry!.content,
      //   newEntry!.embedding,
      //   aiModel,
      //   newEntry!.mood,
      // );
    } catch (err) {
      console.log("Error saving entry.ts:", err);
      setLoading(false);
    }
  };

  const generateAiContent = async (
    entryId: number,
    content: string,
    embedding: number[],
    aiModel: string,
    mood: string,
  ) => {
    setAiLoading(true);

    try {
      const response = await apiRequest({
        url: "/ai/generate-comment",
        method: "POST",
        data: {
          entryId,
          data: {
            content,
            embedding,
            aiModel,
            mood,
          },
        },
      });

      if (!response || response.status !== 201) {
        console.log("No data returned from server");
        setAiLoading(false);
        return;
      }

      const aiComment: AiComment = response.data;

      setEntry((prev) => ({ ...prev, aiComment: aiComment }));

      setAiLoading(false);
    } catch (error) {
      console.error("Error generating AI content:", error);
      setAiLoading(false);
    }
  };

  const onHandleTooltip = (show: boolean) => {
    setTooltipVisible(show);
  };

  const ROW_HEIGHT = 20;
  const [tooltipVisible, setTooltipVisible] = useState(false);

  const handleDialog = async () => {
    setAiDialogLoading(true);
    try {
      const response = await apiRequest({
        url: "/diary-entries/dialog",
        method: "POST",
        data: {
          entryId: entry.id,
          question: dialogQuestion,
        },
      });

      if (!response || response.status !== 201) {
        console.log("No data returned from server");
        setAiDialogLoading(false);
        return;
      }

      setEntry((prev) => ({
        ...prev,
        dialogs: prev.dialogs?.length
          ? [...prev.dialogs, response.data]
          : [response.data],
      }));
      setAiDialogLoading(false);
    } catch (error) {
      console.error("Error generating AI content:", error);
      setAiDialogLoading(false);
    }
  };

  function handleCloseSheet() {
    setIsFocusTitleRichEditor(false);
    props.handleBack(true);
  }

  const handleSend = async () => {
    Keyboard.dismiss();
    await handleDialog();
  };

  const anySettingOpen =
    showTitleColorSetting ||
    showColorSetting ||
    showTitleSizeSetting ||
    showSizeSetting ||
    showTitleFontSetting ||
    showFontSetting ||
    showBackgroundSetting;

  return (
    <SideSheet ref={ref} onOpenChange={setIsAddNewEntryOpen}>
      <View style={{ flex: 1 }}>
        <Background background={entrySettings.background} />
        <View
          style={{
            flex: 1,
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            marginBottom: -50,
          }}
        >
          <BackArrow
            ref={ref}
            style={{
              paddingLeft: 10,
            }}
            onClose={handleCloseSheet}
          />
          <KeyboardAvoidingView
            style={{ flex: 1, position: "relative" }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 44 : 0}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                paddingLeft: 10,
                paddingRight: 20,
              }}
            >
              <ThemedText>{todayDate}</ThemedText>
              {!isEntrySaved && (
                <TouchableOpacity
                  style={{
                    paddingVertical: 5,
                    paddingHorizontal: 10,
                    borderRadius: 50,
                    backgroundColor: colors.primary,
                  }}
                  onPress={handleSave}
                >
                  {loading ? (
                    <ActivityIndicator color={colors.textInPrimary} />
                  ) : (
                    <ThemedText
                      style={{
                        color: colors.textInPrimary,
                      }}
                    >
                      {t("diary.addEntryButton")}
                    </ThemedText>
                  )}
                </TouchableOpacity>
              )}
            </View>
            <TitleEntry
              titleReachEditorKey={titleReachEditorKey}
              disabledTitleReachEditor={isEntrySaved}
              onChangeEntry={setEntry}
              entry={entry}
              isAddNewEntryOpen={isAddNewEntryOpen}
              onHandleTooltip={onHandleTooltip}
              isKeyboardOpen={isKeyboardOpen}
              setActiveActions={setActiveActions}
              activeActions={activeActions}
              handleFocus={handleFocus}
              handleBlur={handleBlur}
              isBoldAction={isBoldAction}
              isItalicAction={isItalicAction}
              colorAction={colorAction}
              sizeAction={sizeAction}
              selectedFont={selectedFont}
            />

            {entry && entry.content && isEntrySaved ? (
              <ContentEntry
                entry={entry}
                aiLoading={aiLoading}
                aiDialogLoading={aiDialogLoading}
                isKeyboardOpen={isKeyboardOpen}
              />
            ) : (
              <>
                <AddContentInputEntry
                  isFocusTextRichEditor={isFocusTextRichEditor}
                  setIsFocusTextRichEditor={setIsFocusTextRichEditor}
                  showFontSetting={showFontSetting}
                  setShowFontSetting={setShowFontSetting}
                  showSizeSetting={showSizeSetting}
                  setShowSizeSetting={setShowSizeSetting}
                  showColorSetting={showColorSetting}
                  setShowColorSetting={setShowColorSetting}
                  showBackgroundSetting={showBackgroundSetting}
                  setShowBackgroundSetting={setShowBackgroundSetting}
                  textReachEditorKey={textReachEditorKey}
                  isKeyboardOpen={isKeyboardOpen}
                  entry={entry}
                  isEntrySaved={isEntrySaved}
                  loading={loading}
                  keyboardHeight={keyboardHeight}
                  onChangeEntry={setEntry}
                  onChangeEntrySettings={(entrySettings: EntrySettings) =>
                    setEntrySettings((prev) => ({
                      ...prev,
                      ...entrySettings,
                    }))
                  }
                  onHandleSave={handleSave}
                  tooltipVisible={tooltipVisible}
                  entrySettings={entrySettings}
                />
              </>
            )}

            {isKeyboardOpen && isFocusTitleRichEditor && (
              <RichToolbar
                actions={{
                  bold: true,
                  italic: true,
                  color: true,
                  size: true,
                  font: true,
                }}
                activeActions={activeActions}
                handleBoldAction={handleBoldAction}
                handleItalicAction={handleItalicAction}
                handleColorAction={handleColorAction}
                handleSizeAction={handleSizeAction}
                handleFontAction={handleFontAction}
              ></RichToolbar>
            )}

            <SettingsEntry
              keyboardHeight={keyboardHeight}
              entrySettings={entrySettings}
              setShowColorSetting={setShowTitleColorSetting}
              showColorSetting={showTitleColorSetting}
              setColor={setColor}
              selectedColor={selectedColor}
              setShowSizeSetting={setShowTitleSizeSetting}
              showSizeSetting={showTitleSizeSetting}
              setShowFontSetting={setShowTitleFontSetting}
              showFontSetting={showTitleFontSetting}
              setSize={setSize}
              setFont={setFont}
              selectedFont={selectedFont}
              selectedSize={selectedSize}
            />

            {isEntrySaved && (
              <View
                style={{
                  position: "relative",
                  bottom: isKeyboardOpen ? 7 : -25,
                  left: 0,
                  right: 0,
                  elevation: 10,
                  borderWidth: 1,
                  borderColor: colors.border,
                  borderRadius: 20,
                  backgroundColor: colors.diaryNotesBackground,
                  marginTop: isKeyboardOpen ? 0 : -33,
                  padding: 10,
                  marginHorizontal: 10,
                }}
              >
                <TextInput
                  multiline
                  onChangeText={setDialogQuestion}
                  placeholder="Enter text"
                  scrollEnabled={true}
                  style={{
                    maxHeight: ROW_HEIGHT * 10,
                    color: colors.text,
                    fontFamily: getFont(font.name, "regular"),
                  }}
                />
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "flex-end",
                    alignItems: "center",
                    paddingHorizontal: 15,
                  }}
                >
                  <TouchableOpacity onPress={handleSend}>
                    <MaterialCommunityIcons
                      name="send"
                      size={28}
                      color="#4A90E2"
                    />
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </KeyboardAvoidingView>
        </View>
        {anySettingOpen && (
          <Pressable
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(0,0,0,0.07)",
              zIndex: 0,
            }}
            onPress={() => {
              setShowBackgroundSetting(false);
              setShowColorSetting(false);
              setShowSizeSetting(false);
              setShowFontSetting(false);
              setShowTitleColorSetting(false);
              setShowTitleSizeSetting(false);
              setShowTitleFontSetting(false);
            }}
          />
        )}
      </View>
    </SideSheet>
  );
});

AddNewEntry.displayName = "AddNewEntry";

export default AddNewEntry;

const getStyles = (colors: ColorTheme) => StyleSheet.create({});
