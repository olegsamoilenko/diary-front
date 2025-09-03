import { ScrollView, StyleSheet, Text, View } from "react-native";
import { AILoader } from "@/components/ui/AILoader";
import { ThemedText } from "@/components/ThemedText";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";
import { ColorTheme, Entry } from "@/types";
import NemoryIcon from "@/components/ui/logo/NemoryIcon";
import StreamingText from "@/components/diary/add-new-entry/StreamingText";
import HtmlViewer from "@/components/ui/HtmlViewer";
import * as SecureStore from "@/utils/store/secureStore";
import { hydrateEntryHtmlFromAlbum } from "@/utils";

type ContentEntryProps = {
  entry: Entry;
  aiLoading: boolean;
  aiDialogLoading: boolean;
  isKeyboardOpen: boolean;
  isEntrySaved?: boolean;
  onChange?: (text: string) => void;
  strimCommentError: boolean;
  strimDialogError: { uuid: string } | null;
};

export default function ContentEntry({
  entry,
  aiLoading,
  aiDialogLoading,
  isKeyboardOpen,
  isEntrySaved,
  onChange,
  strimCommentError,
  strimDialogError,
}: ContentEntryProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const styles = useMemo(() => getStyles(colors), [colors]);
  const scrollViewRef = useRef(null);
  const [idx, setIdx] = useState<number>(0);
  const [html, setHtml] = useState(entry.content ?? "");

  useEffect(() => {
    if (
      scrollViewRef.current &&
      // @ts-ignore
      typeof scrollViewRef.current.scrollToEnd === "function"
    ) {
      setTimeout(() => {
        // @ts-ignore
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 1000);
    }
  }, [idx, isEntrySaved, aiDialogLoading, entry.content]);

  useEffect(() => {
    (async () => {
      const rawUser = await SecureStore.getItemAsync("user");
      const user = rawUser ? JSON.parse(rawUser) : null;
      if (user.id && entry.id && entry.content?.includes("nemory://i/")) {
        const hydrated = await hydrateEntryHtmlFromAlbum(
          entry.content,
          Number(user.id),
          Number(entry.id),
        );
        setHtml(hydrated);
      } else {
        setHtml(entry.content);
      }
    })();
  }, []);

  return (
    <ScrollView style={{ marginBottom: 0 }} ref={scrollViewRef}>
      <View
        style={{
          marginBottom: isKeyboardOpen ? 0 : 20,
        }}
      >
        <View style={styles.content}>
          <HtmlViewer htmlContent={html} />
        </View>
        {entry && entry.aiComment && !strimCommentError && (
          <>
            <View style={styles.commentContainer}>
              {aiLoading ? (
                <View style={styles.loaderContainer}>
                  <AILoader width={50} height={60} dotFontSize={24} />
                </View>
              ) : (
                <View>
                  <View
                    style={{
                      padding: 10,
                    }}
                  >
                    <NemoryIcon width={50} height={60} />
                  </View>
                  <StreamingText
                    key={entry.id}
                    id={`comment-${entry.id}`}
                    speed={50}
                    style={{ color: colors.text, padding: 10 }}
                    onChange={() => {
                      setTimeout(() => {
                        // @ts-ignore
                        scrollViewRef.current?.scrollToEnd({ animated: true });
                      }, 20);
                    }}
                  />
                </View>
              )}
            </View>
          </>
        )}
        {entry && entry.dialogs && entry.dialogs.length > 0 && (
          <>
            {entry.dialogs.map((dialog, index) => {
              return (
                <View key={index} style={{ marginBottom: 10 }}>
                  <View
                    style={{
                      alignItems: "flex-end",
                    }}
                  >
                    <View style={styles.questionContainer}>
                      <ThemedText
                        style={{
                          color: colors.text,
                          marginBottom: 5,
                        }}
                      >
                        {dialog.question}
                      </ThemedText>
                    </View>
                  </View>
                  {(!strimDialogError ||
                    (strimDialogError &&
                      strimDialogError.uuid !== dialog.uuid)) && (
                    <View style={styles.answerContainer}>
                      {aiDialogLoading && dialog.loading ? (
                        <AILoader width={50} height={60} dotFontSize={24} />
                      ) : (
                        <NemoryIcon width={50} height={60} />
                      )}
                      <StreamingText
                        key={dialog.uuid}
                        id={`dialog-${dialog.uuid}`}
                        speed={50}
                        style={{ color: colors.text, padding: 10 }}
                        onChange={() => {
                          setTimeout(() => {
                            // @ts-ignore
                            scrollViewRef.current?.scrollToEnd({
                              animated: true,
                            });
                          }, 20);
                        }}
                      />
                    </View>
                  )}
                </View>
              );
            })}
          </>
        )}
      </View>
    </ScrollView>
  );
}

const getStyles = (colors: ColorTheme) =>
  StyleSheet.create({
    content: {
      flex: 1,
      padding: 10,
      backgroundColor: "transparent",
      borderRadius: 8,
      marginBottom: 10,
    },
    commentContainer: {
      flex: 1,
      padding: 0,
      marginLeft: 15,
      width: "75%",
      alignItems: "flex-start",
      borderRadius: 8,
      backgroundColor: colors.aiCommentBackground,
      marginBottom: 20,
      position: "relative",
    },
    loaderContainer: {
      width: "75%",
      alignItems: "flex-start",
      padding: 10,
    },
    questionContainer: {
      width: "80%",
      marginBottom: 20,
      padding: 10,
      backgroundColor: colors.questionBackground,
    },
    answerContainer: {
      width: "75%",
      alignItems: "flex-start",
      backgroundColor: colors.aiCommentBackground,
      padding: 10,
      marginLeft: 10,
      borderRadius: 8,
    },
  });
