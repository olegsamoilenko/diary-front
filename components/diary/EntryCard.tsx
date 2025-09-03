import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import i18n from "i18next";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

import { ThemedText } from "@/components/ThemedText";
import EntryCardBackground from "@/components/diary/EntryCardBackground";
import NemoryIcon from "@/components/ui/logo/NemoryIcon";
import ModalPortal from "@/components/ui/Modal";
import { ExpandableSection } from "@/components/ExpandableSection";
import HtmlViewer from "@/components/ui/HtmlViewer";
import RotatingIcon from "@/components/ui/RotatingIcon";

import type { ColorTheme, Entry, Dialog, User } from "@/types";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";
import type { RootState } from "@/store";
import { apiRequest, hydrateEntryHtmlFromAlbum } from "@/utils";
import * as SecureStore from "@/utils/store/secureStore";

type EntryCardProps = {
  entry: Entry;
  deleteEntry: (entry: Entry) => void;
  setActiveMoods: React.Dispatch<React.SetStateAction<{ id: number }[]>>;
};
export default React.memo(function EntryCard({
  entry,
  deleteEntry,
  setActiveMoods,
}: EntryCardProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const styles = useMemo(() => getStyles(colors), [colors]);

  const { t } = useTranslation();
  const timeFormat = useSelector((state: RootState) => state.timeFormat);

  const [isExpanded, setIsExpanded] = useState(false);
  const [visibleDeleteModal, setVisibleDeleteModal] = useState(false);
  const [showAiComment, setShowAiComment] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (isExpanded) {
      setActiveMoods((prev) => {
        return [...prev, { id: entry.id }];
      });
    } else {
      setActiveMoods((prev) => prev.filter((mood) => mood.id !== entry.id));
    }
  }, [isExpanded]);

  useEffect(() => {
    (async () => {
      const rawUser = await SecureStore.getItemAsync("user");
      const user = rawUser ? JSON.parse(rawUser) : null;
      setUser(user);
    })();
  }, [entry.content, entry.id]);

  const [details, setDetails] = useState<{
    content?: string | null;
    aiComment?: { content?: string | null } | null;
    dialogs?: Dialog[] | null;
  }>({
    content: entry.content ?? entry.previewContent ?? null,
    aiComment: entry.aiComment ?? null,
    dialogs: entry.dialogs ?? null,
  });

  const formattedTime = useMemo(() => {
    try {
      return new Date(entry.createdAt)
        .toLocaleTimeString(i18n.language!, {
          hour: "2-digit",
          minute: "2-digit",
          hour12: timeFormat === "12h",
        })
        .toUpperCase();
    } catch {
      return "";
    }
  }, [entry.createdAt, timeFormat]);

  const background = useMemo(
    () =>
      entry.settings?.background ?? {
        type: "color" as "color" | "image",
        value: colors.card,
      },
    [entry.settings?.background, colors.card],
  );

  const handleToggle = useCallback(async () => {
    if (!isExpanded) {
      try {
        const res = await apiRequest({
          url: `/diary-entries/get-by-id/${entry.id}`,
          method: "GET",
        });
        const hydrated = await hydrateEntryHtmlFromAlbum(
          res.data?.content ?? "",
          Number(user?.id ?? 0),
          Number(entry.id),
        );
        setDetails((prev) => ({
          ...prev,
          content: hydrated ?? prev.content ?? null,
          aiComment: res.data?.aiComment ?? prev.aiComment ?? null,
          dialogs: res.data?.dialogs ?? prev.dialogs ?? null,
        }));
      } catch (e) {
        console.error("Error fetching diary entry:", e);
      } finally {
        setIsExpanded(true);
      }
      return;
    }
    setIsExpanded((v) => !v);
  }, [entry.id, isExpanded, user]);

  const hasAi = useMemo(() => {
    const c = details.aiComment?.content?.trim?.();
    return Boolean(c);
  }, [details.aiComment?.content]);

  const hasDialogs = useMemo(() => {
    const d = Array.isArray(details.dialogs) ? details.dialogs.length : 0;
    return d > 0;
  }, [details.dialogs]);

  const handleDeleteEntry = async (entry: Entry) => {
    setVisibleDeleteModal(false);
    deleteEntry(entry);
  };

  return (
    <EntryCardBackground background={background}>
      <View style={styles.container}>
        <View style={styles.titleContainer}>
          <View style={styles.moodContainer}>
            <Text
              style={{
                fontSize: 24,
                marginRight: 8,
              }}
            >
              {entry.mood}
            </Text>
          </View>
          <View
            style={{
              flex: 1,
              marginBottom: 8,
            }}
          >
            <HtmlViewer htmlContent={entry.title} />
          </View>
          <View style={styles.timeContainer}>
            <ThemedText type="small" style={styles.time}>
              {formattedTime}
            </ThemedText>
          </View>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => {
              setVisibleDeleteModal(true);
            }}
            accessibilityRole="button"
            accessibilityLabel={t("common.delete") as string}
          >
            <MaterialIcons
              name="delete-outline"
              size={24}
              color={colors.error}
            />
          </TouchableOpacity>
          <ModalPortal
            visible={visibleDeleteModal}
            onClose={() => setVisibleDeleteModal(false)}
          >
            <View>
              <ThemedText>
                {t("diary.entry.deleteEntryConfirmation")}
              </ThemedText>
              <View style={styles.modalInner}>
                <TouchableOpacity
                  style={styles.modalCancelButton}
                  onPress={() => setVisibleDeleteModal(false)}
                >
                  <ThemedText
                    style={{
                      color: colors.text,
                    }}
                  >
                    {t("common.cancel")}
                  </ThemedText>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.modalDeleteButton}
                  onPress={() => handleDeleteEntry(entry)}
                >
                  <ThemedText
                    style={{
                      color: colors.textInPrimary,
                    }}
                  >
                    {t("common.delete")}
                  </ThemedText>
                </TouchableOpacity>
              </View>
            </View>
          </ModalPortal>
        </View>

        <ExpandableSection
          expanded={isExpanded}
          collapsedHeight={100}
          style={styles.expandedSectionContainer}
        >
          <Pressable
            onPress={handleToggle}
            style={styles.content}
            accessibilityRole="button"
          >
            <HtmlViewer
              htmlContent={
                isExpanded
                  ? (details.content ?? entry.previewContent ?? "")
                  : (entry.previewContent ?? "")
              }
            />
            <View style={styles.contentIcon}>
              <RotatingIcon expanded={isExpanded} onPress={handleToggle} />
            </View>
          </Pressable>

          {(hasAi || hasDialogs) && (
            <TouchableOpacity
              style={styles.showDialogButton}
              onPress={() => setShowAiComment((v) => !v)}
            >
              <ThemedText
                type="small"
                style={{
                  color: colors.textInPrimary,
                  textAlign: "center",
                }}
              >
                {!showAiComment
                  ? t("diary.showDialogWithNemory")
                  : t("diary.hideDialogWithNemory")}
              </ThemedText>
            </TouchableOpacity>
          )}

          {isExpanded && showAiComment && !!details.aiComment?.content && (
            <View style={styles.aiCommentContent}>
              <View
                style={{
                  paddingLeft: 5,
                  paddingTop: 10,
                }}
              >
                <NemoryIcon />
              </View>
              <ThemedText style={{ padding: 5 }}>
                {details.aiComment.content}
              </ThemedText>
            </View>
          )}
          {isExpanded &&
            showAiComment &&
            Array.isArray(details.dialogs) &&
            details.dialogs.length > 0 &&
            details.dialogs.map((dialog) => (
              <View key={dialog.id} style={{ marginBottom: 18 }}>
                <View style={styles.question}>
                  <ThemedText
                    style={{
                      marginTop: 6,
                      justifyContent: "flex-end",
                      alignItems: "flex-end",
                    }}
                  >
                    {dialog.question}
                  </ThemedText>
                </View>
                <View style={styles.answer}>
                  <View style={{ paddingTop: 10 }}>
                    <NemoryIcon />
                  </View>
                  <ThemedText style={{ marginTop: 6 }}>
                    {dialog.answer}
                  </ThemedText>
                </View>
              </View>
            ))}
        </ExpandableSection>
      </View>
    </EntryCardBackground>
  );
});

const getStyles = (colors: ColorTheme) =>
  StyleSheet.create({
    container: {
      backgroundColor: "transparent",
      borderRadius: 8,
      marginBottom: 8,
      padding: 2,
      position: "relative",
      zIndex: 0,
    },
    titleContainer: {
      flexDirection: "row",
      alignItems: "flex-start",
      justifyContent: "space-between",
      backgroundColor: "transparent",
      marginBottom: 10,
    },
    moodContainer: {
      alignItems: "flex-end",
      justifyContent: "flex-end",
      backgroundColor: "transparent",
      marginBottom: 0,
      marginTop: 0,
      paddingBottom: 0,
    },
    timeContainer: {
      justifyContent: "flex-start",
      flexDirection: "row",
      alignItems: "flex-start",
      marginTop: 10,
    },
    time: {
      marginLeft: 8,
      paddingBottom: 5,
      color: colors.textAdditional,
    },
    deleteButton: {
      justifyContent: "flex-start",
      flexDirection: "row",
      alignItems: "flex-start",
      marginTop: 5,
      marginLeft: 7,
    },
    modalInner: {
      flexDirection: "row",
      justifyContent: "flex-end",
      alignItems: "center",
      gap: 10,
      marginTop: 10,
    },
    modalCancelButton: {
      paddingVertical: 5,
      paddingHorizontal: 10,
      borderRadius: 50,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: "transparent",
    },
    modalDeleteButton: {
      paddingVertical: 5,
      paddingHorizontal: 10,
      borderRadius: 50,
      backgroundColor: colors.primary,
    },
    expandedSectionContainer: {
      borderRadius: 8,
      marginBottom: 2,
      padding: 0,
    },
    content: {
      marginBottom: 15,
      position: "relative",
      zIndex: 10,
    },
    contentIcon: {
      position: "absolute",
      zIndex: 0,
      top: -10,
      right: 0,
      marginTop: 10,
      marginBottom: 10,
    },
    aiCommentContent: {
      backgroundColor: colors.aiCommentBackground,
      borderRadius: 10,
      paddingHorizontal: 5,
      paddingBottom: 5,
      width: "80%",
      marginBottom: 18,
    },
    question: {
      backgroundColor: colors.questionBackground,
      borderRadius: 10,
      width: "80%",
      alignSelf: "flex-end",
      padding: 0,
      marginBottom: 18,
    },
    answer: {
      backgroundColor: colors.answerBackground,
      borderRadius: 10,
      paddingHorizontal: 10,
      paddingBottom: 10,
      width: "80%",
    },
    showDialogButton: {
      backgroundColor: colors.primary,
      paddingVertical: 5,
      paddingHorizontal: 20,
      borderRadius: 50,
      alignSelf: "center",
      marginBottom: 20,
      zIndex: 11,
    },
  });
