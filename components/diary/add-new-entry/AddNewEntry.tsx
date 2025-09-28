import React, {
  forwardRef,
  useEffect,
  useCallback,
  useMemo,
  useRef,
  useState,
} from "react";
import SideSheet, { SideSheetRef } from "@/components/SideSheet";
import {
  StyleSheet,
  TextInput,
  View,
  Keyboard,
  Platform,
  KeyboardAvoidingView,
  TouchableOpacity,
  ActivityIndicator,
  Pressable,
} from "react-native";
import { ColorTheme, Entry, EPlatform, PlanStatus } from "@/types";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";
import {
  apiRequest,
  getFont,
  getTodayDateStr,
  getToken,
  aiStreamEmitter,
  addToAiChunkBuffer,
  resetAiChunkBuffer,
  runAIStream,
  clearPending,
  tokeniseInlineBase64,
  hydrateHtmlWithLocalUris,
} from "@/utils";
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
import * as SecureStore from "expo-secure-store";
import { Dialog } from "@/types/dialog";
import uuid from "react-native-uuid";
import Toast from "react-native-toast-message";
import { persistPrivateThenMaybeExportWithMeta } from "@/utils/files/media";

type ActiveActions = {
  isBold?: boolean;
  isItalic?: boolean;
  isUnderline?: boolean;
  isInsertUnorderedList?: boolean;
  isInsertOrderedList?: boolean;
};

const AddNewEntry = forwardRef<
  SideSheetRef,
  {
    isOpen: boolean;
    handleBack: (back: boolean) => void;
    onClose?: () => void;
    tabBarHeight: number;
  }
>((props, ref) => {
  const aiModel = useAppSelector((state) => state.aiModel);
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const styles = useMemo(() => getStyles(colors), [colors]);
  const font = useSelector((state: RootState) => state.font);
  const { t } = useTranslation();

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
  const [showEmojiSetting, setShowEmojiSetting] = useState(false);
  const [showTitleFontSetting, setShowTitleFontSetting] = useState(false);
  const [showTitleSizeSetting, setShowTitleSizeSetting] = useState(false);
  const [showTitleColorSetting, setShowTitleColorSetting] = useState(false);
  const [showTitleEmojiSetting, setShowTitleEmojiSetting] = useState(false);
  const [selectedColor, setSelectedColor] = useState(colors.text);
  const [selectedFont, setSelectedFont] = useState(FONTS[0]);
  const [selectedSize, setSelectedSize] = useState(16);
  const [emoji, setEmoji] = useState<string>("");
  const [titleEmoji, setTitleEmoji] = useState<string>("");
  const [aiDialogLoading, setAiDialogLoading] = useState(false);
  const [textReachEditorKey, setTextReachEditorKey] = useState(0);
  const [titleReachEditorKey, setTitleReachEditorKey] = useState(0);
  const [isFocusTextRichEditor, setIsFocusTextRichEditor] = useState(false);

  const [contentLoading, setContentLoading] = useState(false);
  const [showTip, setShowTip] = useState(false);

  useEffect(() => {
    setSizeAction(16);
    setColorAction(colors.text);
    setSelectedFont(FONTS[0]);
  }, [props.isOpen]);

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
    images: [],
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
      key: "",
    },
  });

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
  }, [colorScheme, colors.text]);

  const resetForm = useCallback(() => {
    setIsEntrySaved(false);
    setEntry({
      id: 0,
      title: "",
      content: "",
      mood: "",
      aiComment: { content: "", aiModel },
      embedding: [],
      dialogs: [],
      images: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    setEntrySettings({
      background: {
        id: 0,
        type: "color",
        value: colors.card,
        url: undefined,
        key: "",
      },
    });
    setEmoji("");
    setTitleEmoji("");
    setActiveActions(null);
    setShowTip(false);
    setTextReachEditorKey((k) => k + 1);
    setTitleReachEditorKey((k) => k + 1);
  }, [aiModel, colors.card]);

  useEffect(() => {
    if (!props.isOpen) resetForm();
  }, [props.isOpen, resetForm]);

  useEffect(() => {
    const onShow = (e: any) => {
      setIsKeyboardOpen(true);
      setKeyboardHeight(e.endCoordinates?.height ?? 0);
    };
    const onHide = () => {
      setIsKeyboardOpen(false);
      setKeyboardHeight(0);
    };

    const showEvt =
      Platform.OS === EPlatform.IOS ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvt =
      Platform.OS === EPlatform.IOS ? "keyboardWillHide" : "keyboardDidHide";

    const showL = Keyboard.addListener(showEvt, onShow);
    const hideL = Keyboard.addListener(hideEvt, onHide);
    return () => {
      showL.remove();
      hideL.remove();
    };
  }, []);

  const handleBoldAction = useCallback(() => setIsBoldAction((v) => !v), []);
  const handleItalicAction = useCallback(
    () => setIsItalicAction((v) => !v),
    [],
  );
  const setColor = useCallback((color: string) => {
    setSelectedColor(color);
    setColorAction(color);
  }, []);
  const setSize = useCallback((size: number) => {
    setSelectedSize(size);
    setSizeAction(size);
  }, []);
  const setFont = useCallback((f: any) => setSelectedFont(f), []);

  const handleFontAction = useCallback(() => setShowTitleFontSetting(true), []);
  const handleColorAction = useCallback(
    () => isKeyboardOpen && setShowTitleColorSetting(true),
    [isKeyboardOpen],
  );
  const handleSizeAction = useCallback(
    () => isKeyboardOpen && setShowTitleSizeSetting(true),
    [isKeyboardOpen],
  );
  const handleEmojiAction = useCallback(
    () => setShowTitleEmojiSetting(true),
    [],
  );
  const handleFocus = useCallback(() => setIsFocusTitleRichEditor(true), []);
  const handleBlur = useCallback(() => setIsFocusTitleRichEditor(false), []);

  const counterTitleEmojiRef = useRef(0);
  const handleTitleEmoji = useCallback((e: string) => {
    setTitleEmoji(e);
    setShowTitleEmojiSetting(false);
    counterTitleEmojiRef.current++;
  }, []);

  useEffect(() => {
    const onShow = (e: any) => setKeyboardHeight(e.endCoordinates.height);
    const onHide = () => setKeyboardHeight(0);

    const showListener = Keyboard.addListener(
      Platform.OS === EPlatform.IOS ? "keyboardWillShow" : "keyboardDidShow",
      onShow,
    );
    const hideListener = Keyboard.addListener(
      Platform.OS === EPlatform.IOS ? "keyboardWillHide" : "keyboardDidHide",
      onHide,
    );

    return () => {
      showListener.remove();
      hideListener.remove();
    };
  }, []);

  const changeUserPlanStatus = async (status: PlanStatus) => {
    const rowUser = await SecureStore.getItemAsync("user");
    if (!rowUser) return;
    const user = JSON.parse(rowUser);

    user.plan.status = status;

    await SecureStore.setItemAsync("user", JSON.stringify(user));
  };

  const toastError = useCallback(
    (error: any) => {
      Toast.show({
        type: "error",
        text1: t(`errors.${error?.statusMessage}`),
        text2: t(`errors.${error?.message}`),
      });
    },
    [t],
  );

  const aiLoadingRef = useRef(aiLoading);
  const [strimCommentError, setStrimCommentError] = useState<boolean>(false);
  const [strimDialogError, setStrimDialogError] = useState<{
    uuid: string;
  } | null>(null);

  useEffect(() => {
    aiLoadingRef.current = aiLoading;
  }, [aiLoading]);

  const handleSave = useCallback(async () => {
    if (!entry.mood) {
      setShowTip(true);
      return;
    }

    setLoading(true);
    setIsFocusTitleRichEditor(false);
    setIsFocusTextRichEditor(false);
    setTextReachEditorKey((k) => k + 1);
    setTitleReachEditorKey((k) => k + 1);
    setContentLoading(true);

    const rawUser = await SecureStore.getItemAsync("user");
    const userId = rawUser ? JSON.parse(rawUser).id : null;

    try {
      const contentWithTokens = tokeniseInlineBase64(entry.content);

      const res = await apiRequest({
        url: `/diary-entries/create`,
        method: "POST",
        data: {
          title: entry.title,
          content: contentWithTokens,
          mood: entry.mood,
          aiModel,
          settings: entrySettings,
        },
      });

      if (res.status !== 200 && res.status !== 201) {
        console.log("No data returned from server");
        Toast.show({
          type: "error",
          text1: t(`error.noDataReturnedFromServer`),
        });
        return;
      }

      const newEntry: Entry = await res.data;

      setEntry((prev) => ({
        ...prev,
        ...newEntry,
        content: contentWithTokens,
      }));
      setIsEntrySaved(true);

      if (userId) {
        try {
          const meta = await persistPrivateThenMaybeExportWithMeta(
            userId,
            Number(newEntry.id),
            {
              exportToGallery: true,
            },
          );

          if (meta.length) {
            const hydrated = hydrateHtmlWithLocalUris(contentWithTokens, meta);
            setEntry((prev) => ({ ...prev, content: hydrated }));
          }

          const itemsForServer = meta.map(({ localUri, ...rest }) => rest);

          if (itemsForServer.length) {
            const res2 = await apiRequest({
              url: `/entry-images/${newEntry.id}`,
              method: "POST",
              data: { items: itemsForServer },
            });
          }
        } catch (err: any) {
          console.warn("Images persist error:", err);
          console.warn("Images persist error response:", err.response);
          console.warn(
            "Images persist error response data:",
            err.response.data,
          );
        } finally {
          clearPending();
        }
      } else {
        clearPending();
      }

      setLoading(false);
      setContentLoading(false);

      setAiLoading(true);
      setStrimCommentError(false);

      await runAIStream({
        endpoint: "stream_ai_comment",
        data: {
          entryId: newEntry.id,
          content: contentWithTokens,
          aiModel: aiModel,
          mood: newEntry.mood,
        },
        eventNames: {
          chunk: "ai_stream_comment_chunk",
          done: "ai_stream_comment_done",
          error: [
            "unauthorized_error",
            "ai_stream_comment_error",
            "user_error",
            "plan_error",
          ],
        },
        handlers: {
          onChunk: ({ text }) => {
            addToAiChunkBuffer(`comment-${newEntry.id}`, text);
            aiStreamEmitter.emit(`comment-${newEntry.id}`, text);

            if (aiLoadingRef.current) {
              aiLoadingRef.current = false;

              setTimeout(() => {
                setAiLoading(false);
              }, 0);
            }
          },
          onDone: ({ aiComment }) => {
            resetAiChunkBuffer(`comment-${newEntry.id}`);
            setEntry((prev) => ({ ...prev, aiComment: aiComment }));
            setAiLoading(false);
          },
          onError: (error) => {
            setAiLoading(false);
            toastError(error);
            setStrimCommentError(true);
          },
        },
        getToken: async () => await getToken(),
      });
    } catch (err: any) {
      console.log("Error saving entry.ts:", err);
      console.log("Error saving entry.ts response:", err?.response);
      console.log("Error saving entry.ts response data:", err?.response?.data);
      setLoading(false);
      setContentLoading(false);
    }
  }, [
    aiModel,
    changeUserPlanStatus,
    entry.content,
    entry.mood,
    entry.title,
    entrySettings,
    toastError,
    aiLoading,
  ]);

  const onHandleTooltip = (show: boolean) => {
    setTooltipVisible(show);
  };

  const ROW_HEIGHT = 20;
  const [tooltipVisible, setTooltipVisible] = useState(false);

  const aiDialogLoadingRef = useRef(aiDialogLoading);

  useEffect(() => {
    aiDialogLoadingRef.current = aiDialogLoading;
  }, [aiDialogLoading]);

  const handleDialog = useCallback(
    async (dialog: Dialog) => {
      setAiDialogLoading(true);
      setStrimDialogError(null);

      await runAIStream({
        endpoint: "stream_ai_dialog",
        data: {
          entryId: Number(entry!.id),
          uuid: dialog.uuid,
          content: dialogQuestion,
          aiModel,
          mood: entry!.mood,
        },
        eventNames: {
          chunk: "ai_stream_dialog_chunk",
          done: "ai_stream_dialog_done",
          error: [
            "unauthorized_error",
            "ai_stream_dialog_error",
            "user_error",
            "plan_error",
          ],
        },
        handlers: {
          onChunk: ({ text }) => {
            addToAiChunkBuffer(`dialog-${dialog.uuid}`, text);
            aiStreamEmitter.emit(`dialog-${dialog.uuid}`, text);
            if (aiDialogLoadingRef.current) {
              aiDialogLoadingRef.current = false;

              setEntry((prev) => ({
                ...prev,
                dialogs: prev.dialogs.map((d) => {
                  if (d.uuid === dialog.uuid) {
                    return { ...d, loading: false };
                  }
                  return d;
                }),
              }));

              setTimeout(() => {
                setAiDialogLoading(false);
              }, 0);
            }
          },
          onDone: ({ respDialog }) => {
            resetAiChunkBuffer(`dialog-${dialog.uuid}`);
            setEntry((prev) => ({
              ...prev,
              dialogs: prev.dialogs.map((d) => {
                if (d.uuid === dialog.uuid) {
                  const { question, ...restData } = respDialog;
                  return {
                    ...d,
                    ...restData,
                  };
                }
                return d;
              }),
            }));
          },
          onError: (error) => {
            toastError(error);
            setAiDialogLoading(false);
            setStrimDialogError({
              uuid: dialog.uuid,
            });
          },
        },
        getToken: async () => await getToken(),
      });
    },
    [
      aiDialogLoading,
      aiModel,
      changeUserPlanStatus,
      dialogQuestion,
      entry.id,
      entry.mood,
      toastError,
    ],
  );

  function handleCloseSheet() {
    setIsFocusTitleRichEditor(false);
    setIsFocusTextRichEditor(false);
    props.handleBack(true);
    setEmoji("");
    setTitleEmoji("");
  }

  const handleSend = useCallback(async () => {
    const newUuid = uuid.v4();
    const dialog = {
      uuid: newUuid,
      question: dialogQuestion,
      answer: "",
      loading: true,
    };
    setEntry((prev) => ({
      ...prev,
      dialogs:
        prev.dialogs && prev.dialogs.length
          ? [...prev.dialogs, dialog]
          : [dialog],
    }));
    Keyboard.dismiss();
    setDialogQuestion("");
    await handleDialog(dialog);
  }, [dialogQuestion, handleDialog]);

  const closeAllSettings = useCallback(() => {
    setShowBackgroundSetting(false);
    setShowColorSetting(false);
    setShowSizeSetting(false);
    setShowFontSetting(false);
    setShowEmojiSetting(false);
    setShowTitleColorSetting(false);
    setShowTitleSizeSetting(false);
    setShowTitleFontSetting(false);
    setShowTitleEmojiSetting(false);
  }, []);

  const anySettingOpen = useMemo(
    () =>
      showTitleColorSetting ||
      showColorSetting ||
      showTitleSizeSetting ||
      showSizeSetting ||
      showTitleFontSetting ||
      showFontSetting ||
      showBackgroundSetting ||
      showEmojiSetting ||
      showTitleEmojiSetting,
    [
      showTitleColorSetting,
      showColorSetting,
      showTitleSizeSetting,
      showSizeSetting,
      showTitleFontSetting,
      showFontSetting,
      showBackgroundSetting,
      showEmojiSetting,
      showTitleEmojiSetting,
    ],
  );

  return (
    <SideSheet ref={ref} onOpenChange={setIsAddNewEntryOpen}>
      <View style={{ flex: 1 }}>
        <Background background={entrySettings.background} />
        <View style={styles.containerInner}>
          <BackArrow
            ref={ref}
            style={{
              paddingLeft: 10,
            }}
            onClose={handleCloseSheet}
          />
          <KeyboardAvoidingView
            style={{ flex: 1, position: "relative" }}
            behavior={Platform.OS === EPlatform.IOS ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === EPlatform.IOS ? 44 : 0}
          >
            <View style={styles.header}>
              <ThemedText>{todayDate}</ThemedText>
              {!isEntrySaved && (
                <TouchableOpacity
                  style={[
                    styles.addEntryButton,
                    {
                      backgroundColor: loading
                        ? colors.disabledPrimary
                        : colors.primary,
                    },
                  ]}
                  onPress={handleSave}
                  disabled={loading}
                >
                  <ThemedText
                    style={{
                      color: colors.textInPrimary,
                    }}
                  >
                    {t("diary.addEntryButton")}
                  </ThemedText>
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
              titleEmoji={titleEmoji}
              setShowTip={setShowTip}
              showTip={showTip}
              counterTitleEmojiRef={counterTitleEmojiRef}
            />

            {contentLoading ? (
              <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color={colors.primary} />
              </View>
            ) : entry && entry.content && isEntrySaved && !contentLoading ? (
              <ContentEntry
                entry={entry}
                aiLoading={aiLoading}
                aiDialogLoading={aiDialogLoading}
                isKeyboardOpen={isKeyboardOpen}
                isEntrySaved={isEntrySaved}
                strimCommentError={strimCommentError}
                strimDialogError={strimDialogError}
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
                  showEmojiSetting={showEmojiSetting}
                  setShowEmojiSetting={setShowEmojiSetting}
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
                  addEmoji={setEmoji}
                  emoji={emoji}
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
                  emoji: true,
                }}
                activeActions={activeActions}
                handleBoldAction={handleBoldAction}
                handleItalicAction={handleItalicAction}
                handleColorAction={handleColorAction}
                handleSizeAction={handleSizeAction}
                handleFontAction={handleFontAction}
                handleEmojiAction={handleEmojiAction}
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
              showEmojiSetting={showTitleEmojiSetting}
              setShowEmojiSetting={setShowTitleEmojiSetting}
              setSize={setSize}
              setFont={setFont}
              selectedFont={selectedFont}
              selectedSize={selectedSize}
              addEmoji={handleTitleEmoji}
            />

            {isEntrySaved && entry.aiComment.content && (
              <View
                style={[
                  styles.chatContainer,
                  {
                    bottom: isKeyboardOpen ? 7 : -25,
                    marginTop: isKeyboardOpen ? 0 : -33,
                  },
                ]}
              >
                <TextInput
                  multiline
                  onChangeText={setDialogQuestion}
                  value={dialogQuestion}
                  placeholder={t("diary.askAnything")}
                  scrollEnabled={true}
                  placeholderTextColor={colors.inputPlaceholder}
                  style={{
                    maxHeight: ROW_HEIGHT * 10,
                    color: colors.text,
                    fontFamily: getFont(font, "regular"),
                  }}
                />
                <View style={styles.sendMessageButton}>
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
          <Pressable style={styles.settings} onPress={closeAllSettings} />
        )}
      </View>
    </SideSheet>
  );
});

AddNewEntry.displayName = "AddNewEntry";

export default AddNewEntry;

const getStyles = (colors: ColorTheme) =>
  StyleSheet.create({
    containerInner: {
      flex: 1,
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      marginBottom: -50,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingLeft: 10,
      paddingRight: 20,
    },
    addEntryButton: {
      paddingVertical: 5,
      paddingHorizontal: 10,
      borderRadius: 50,
    },
    loaderContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    chatContainer: {
      position: "relative",
      left: 0,
      right: 0,
      elevation: 10,
      borderRadius: 20,
      backgroundColor: colors.backgroundAdditional,
      padding: 10,
      marginHorizontal: 10,
    },
    sendMessageButton: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "flex-end",
      alignItems: "center",
      paddingHorizontal: 15,
    },
    settings: {
      position: "absolute",
      left: 0,
      top: 0,
      width: "100%",
      height: "100%",
      backgroundColor: "rgba(0,0,0,0.07)",
      zIndex: 0,
    },
  });
