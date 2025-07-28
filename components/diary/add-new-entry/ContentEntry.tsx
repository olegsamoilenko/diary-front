import { ScrollView, Text, View } from "react-native";
import { AILoader } from "@/components/ui/AILoader";
import { ThemedText } from "@/components/ThemedText";
import React, { useEffect, useRef, useState } from "react";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";
import { Entry } from "@/types";
import ViewReachEditor from "@/components/diary/ViewReachEditor";
import NemoryIcon from "@/components/ui/logo/NemoryIcon";
import { useTypewriter } from "@/hooks/useTypewriter";
import TypewriterAIResponse from "@/components/diary/add-new-entry/TypewriterAIResponse";

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
  const animatedAiComment = useTypewriter(entry.aiComment.content, 30);
  const scrollViewRef = useRef(null);
  const [idx, setIdx] = useState<number>(0);

  useEffect(() => {
    if (scrollViewRef.current) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [animatedAiComment, idx, isEntrySaved, aiDialogLoading]);

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

                  {/*<ThemedText*/}
                  {/*  style={{*/}
                  {/*    fontWeight: "bold",*/}
                  {/*    color: colors.primary,*/}
                  {/*    marginRight: 5,*/}
                  {/*    position: "absolute",*/}
                  {/*    top: 10,*/}
                  {/*    left: 0,*/}
                  {/*  }}*/}
                  {/*>*/}
                  {/*  <NemoryIcon /> <ThemedText> </ThemedText>*/}
                  {/*</ThemedText>*/}
                  <ThemedText
                    style={{
                      color: colors.text,
                      padding: 10,
                    }}
                  >
                    {/*<ThemedText*/}
                    {/*  style={{*/}
                    {/*    paddingLeft: 300,*/}
                    {/*  }}*/}
                    {/*>*/}
                    {/*  {"        "}*/}
                    {/*</ThemedText>*/}
                    {animatedAiComment}
                  </ThemedText>
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
                    {aiDialogLoading ? (
                      <AILoader width={50} height={60} dotFontSize={24} />
                    ) : (
                      <NemoryIcon width={50} height={60} />
                    )}

                    {/*<TypewriterAIResponse*/}
                    {/*  response={dialog.answer}*/}
                    {/*  style={{ color: colors.text }}*/}
                    {/*  setIdx={setIdx}*/}
                    {/*/>*/}
                    <ThemedText style={{ color: colors.text }}>
                      {animatedAiComment}
                    </ThemedText>
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
