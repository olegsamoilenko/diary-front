import { ScrollView, Text, View } from "react-native";
import { AILoader } from "@/components/ui/AILoader";
import { ThemedText } from "@/components/ThemedText";
import React, { useEffect, useRef, useState } from "react";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";
import { Entry } from "@/types";
import ViewReachEditor from "@/components/diary/ViewReachEditor";
import NemoryIcon from "@/components/ui/logo/NemoryIcon";
// import { useTypewriter } from "@/hooks/useTypewriter";
import TypewriterText from "@/components/diary/add-new-entry/TypewriterText";

type ContentEntryProps = {
  entry: Entry;
  aiLoading: boolean;
  aiDialogLoading: boolean;
  isKeyboardOpen: boolean;
  isEntrySaved?: boolean;
};

export default function ContentEntry({
  entry,
  aiLoading,
  aiDialogLoading,
  isKeyboardOpen,
  isEntrySaved,
}: ContentEntryProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme] ?? Colors.system;
  // const animatedAiComment = useTypewriter(entry.aiComment.content, 30);
  const scrollViewRef = useRef(null);
  const [idx, setIdx] = useState<number>(0);

  useEffect(() => {
    if (
      scrollViewRef.current &&
      // @ts-ignore
      typeof scrollViewRef.current.scrollToEnd === "function"
    ) {
      setTimeout(() => {
        // @ts-ignore
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [idx, isEntrySaved, aiDialogLoading]);

  useEffect(() => {
    console.log("ContentEntry entry dialogs:", entry.dialogs);
  }, [entry]);

  return (
    <ScrollView style={{ marginBottom: 0 }} ref={scrollViewRef}>
      <View
        style={{
          marginBottom: isKeyboardOpen ? 0 : 20,
        }}
      >
        <View
          style={{
            flex: 1,
            padding: 10,
            marginHorizontal: 15,
            backgroundColor: "transparent",
            borderRadius: 8,
            marginBottom: 10,
          }}
        >
          <ViewReachEditor content={entry.content} />
        </View>
        {entry && entry.aiComment && (
          <>
            <View
              style={{
                flex: 1,
                padding: 0,
                marginLeft: 15,
                width: "75%",
                alignItems: "flex-start",
                borderRadius: 8,
                backgroundColor: colors.aiCommentBackground,
                marginBottom: 20,
                position: "relative",
              }}
            >
              {aiLoading ? (
                <View
                  style={{
                    width: "75%",
                    alignItems: "flex-start",
                    padding: 10,
                  }}
                >
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

                  <TypewriterText
                    text={entry.aiComment.content}
                    speed={30}
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
                    <View
                      style={{
                        width: "80%",
                        marginBottom: 20,
                        padding: 10,
                        backgroundColor: colors.questionBackground,
                      }}
                    >
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
                  <View
                    style={{
                      width: "75%",
                      alignItems: "flex-start",
                      backgroundColor: colors.aiCommentBackground,
                      padding: 10,
                      marginLeft: 10,
                      borderRadius: 8,
                    }}
                  >
                    {aiDialogLoading && dialog.loading ? (
                      <AILoader width={50} height={60} dotFontSize={24} />
                    ) : (
                      <NemoryIcon width={50} height={60} />
                    )}

                    <TypewriterText
                      key={dialog.id || dialog.question}
                      text={dialog.answer ?? ""}
                      speed={30}
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
                </View>
              );
            })}
          </>
        )}
        {/*<View>*/}
        {/*  {aiDialogLoading && (*/}
        {/*    <View*/}
        {/*      style={{*/}
        {/*        width: "75%",*/}
        {/*        alignItems: "flex-start",*/}
        {/*        backgroundColor: colors.aiCommentBackground,*/}
        {/*        padding: 10,*/}
        {/*        marginLeft: 10,*/}
        {/*        borderRadius: 8,*/}
        {/*      }}*/}
        {/*    >*/}
        {/*      <AILoader width={50} height={60} dotFontSize={24} />*/}
        {/*    </View>*/}
        {/*  )}*/}
        {/*</View>*/}
      </View>
    </ScrollView>
  );
}
