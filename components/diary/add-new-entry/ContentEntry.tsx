import { Text, View } from "react-native";
import { AILoader } from "@/components/ui/AILoader";
import { ThemedText } from "@/components/ThemedText";
import React from "react";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";
import { Entry } from "@/types";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import ViewReachEditor from "@/components/diary/ViewReachEditor";

type ContentEntryProps = {
  entry: Entry;
  aiLoading: boolean;
  aiDialogLoading: boolean;
  isKeyboardOpen: boolean;
};

export default function ContentEntry({
  entry,
  aiLoading,
  aiDialogLoading,
  isKeyboardOpen,
}: ContentEntryProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];

  return (
    <ParallaxScrollView isPadding={false} style={{ marginBottom: 0 }}>
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
            {aiLoading ? (
              <AILoader />
            ) : (
              <View
                style={{
                  flex: 1,
                  padding: 0,
                  marginLeft: 15,
                  marginRight: 50,
                  borderRadius: 8,
                  backgroundColor: colors.aiCommentBackground,
                  elevation: 1,
                  marginBottom: 20,
                }}
              >
                <ThemedText style={{ color: colors.text, padding: 10 }}>
                  <ThemedText
                    style={{
                      fontWeight: "bold",
                      color: colors.primary,
                      marginRight: 5,
                    }}
                  >
                    NEMORY: <ThemedText> </ThemedText>
                  </ThemedText>
                  {entry.aiComment.content}
                </ThemedText>
              </View>
            )}
          </>
        )}
        {entry && entry.dialogs && entry.dialogs.length > 0 && (
          <>
            {entry.dialogs.map((dialog, index) => (
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
                    width: "80%",
                    alignItems: "flex-start",
                    backgroundColor: colors.aiCommentBackground,
                    padding: 10,
                    borderRadius: 8,
                    elevation: 1,
                  }}
                >
                  <ThemedText style={{ color: colors.text }}>
                    {dialog.answer}
                  </ThemedText>
                </View>
              </View>
            ))}
          </>
        )}
        <View>
          {aiDialogLoading && (
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
              <AILoader />
            </View>
          )}
        </View>
      </View>
    </ParallaxScrollView>
  );
}
