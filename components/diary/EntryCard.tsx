import { Button, Pressable, Text, View } from "react-native";
import { getEmojiByMood, MoodEmoji } from "@/constants/Mood";
import { ThemedText } from "@/components/ThemedText";
import { AILoader } from "@/components/ui/AILoader";
import type { Entry } from "@/types";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";
import React, { useEffect, useState } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import i18n from "i18next";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import ViewReachEditor from "@/components/diary/ViewReachEditor";
import { RichEditor } from "react-native-pell-rich-editor";
import Background from "@/components/diary/add-new-entry/Background";
import EntryCardBackground from "@/components/diary/EntryCardBackground";

type EntryCardProps = { entry: Entry };
export default function EntryCard({ entry }: EntryCardProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const [expanded, setExpanded] = useState<{ [key: number]: boolean }>({});
  const lang = useState<string | null>(i18n.language)[0];
  const format = useSelector((state: RootState) => state.timeFormat.value);
  const [key, setKey] = useState<number>(0);

  const toggleExpand = (id: number) => {
    setExpanded((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
    setKey((prevKey) => prevKey + 1);
  };
  return (
    <EntryCardBackground
      background={
        entry.settings?.background ?? { type: "color", value: colors.card }
      }
    >
      <View
        key={entry.id}
        style={{
          backgroundColor: "transparent",
          borderRadius: 8,
          marginBottom: 18,
          padding: 8,
          position: "relative",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "flex-start",
            justifyContent: "space-between",
            backgroundColor: "transparent",
          }}
        >
          <View
            style={{
              alignItems: "flex-start",
              justifyContent: "flex-start",
              // flex: 1,
              backgroundColor: "transparent",
              marginBottom: 8,
              marginTop: 8,
            }}
          >
            <ThemedText
              style={{
                fontSize: 22,
                marginRight: 8,
              }}
            >
              {getEmojiByMood(entry.mood)}
            </ThemedText>
          </View>
          <View
            style={{
              flex: 1,
              marginBottom: 8,
            }}
          >
            <ViewReachEditor content={entry.title} />
          </View>
          <View
            style={{
              justifyContent: "flex-start",
              flexDirection: "row",
              alignItems: "flex-start",
              marginTop: 10,
            }}
          >
            <ThemedText
              type="small"
              style={{
                marginLeft: 8,
                paddingBottom: 5,
                color: colors.textAdditional,
              }}
            >
              {new Date(entry.createdAt)
                .toLocaleTimeString(i18n.language!, {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: format === 12,
                })
                .toUpperCase()}
            </ThemedText>
          </View>
        </View>

        <Pressable key={entry.id}>
          <View
            style={{
              backgroundColor: "rgba(0, 0, 0, 0.05)",
              // backgroundColor: "rgba(255, 255, 255, 0.3)",
              borderRadius: 8,
              marginBottom: 12,
            }}
          >
            {expanded[Number(entry.id)] ? (
              <ViewReachEditor key={key} content={entry.content} />
            ) : (
              <ViewReachEditor key={key} content={entry.previewContent} />
            )}
          </View>

          {expanded[Number(entry.id)] && entry.aiComment && (
            <View
              style={{
                backgroundColor: colors.aiCommentBackground,
                borderRadius: 10,
                paddingLeft: 4,
                width: "80%",
                elevation: 2,
                marginBottom: 18,
              }}
            >
              <ThemedText style={{ marginTop: 6, padding: 5 }}>
                <ThemedText
                  style={{
                    fontWeight: "bold",
                    color: colors.primary,
                    marginRight: 5,
                  }}
                >
                  NEMORY: <ThemedText> </ThemedText>
                </ThemedText>
                {entry.aiComment?.content}
              </ThemedText>
            </View>
          )}
          {expanded[Number(entry.id)] &&
            entry.dialogs &&
            entry.dialogs.length > 0 &&
            entry.dialogs.map((dialog) => (
              <View
                key={dialog.id}
                style={{
                  marginBottom: 18,
                }}
              >
                <View
                  style={{
                    backgroundColor: colors.diaryNotesBackground,
                    borderRadius: 10,
                    width: "80%",
                    alignSelf: "flex-end",
                    padding: 8,
                    marginBottom: 18,
                    elevation: 2,
                  }}
                >
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
                <View
                  style={{
                    backgroundColor: colors.aiCommentBackground,
                    borderRadius: 10,
                    paddingLeft: 4,
                    width: "80%",
                    elevation: 2,
                  }}
                >
                  <ThemedText style={{ marginTop: 6 }}>
                    {dialog.answer}
                  </ThemedText>
                </View>
              </View>
            ))}
        </Pressable>
        <Pressable onPress={() => toggleExpand(Number(entry.id))}>
          <Text
            style={{
              justifyContent: "center",
              alignItems: "center",
              textAlign: "center",
              marginTop: 5,
              color: "#888",
            }}
          >
            <MaterialCommunityIcons
              name="chevron-down"
              size={24}
              color="#000"
              style={{
                transform: [{ scaleX: 5.6 }, { scaleY: 6.9 }],
                color: colors.icon,
              }}
            />
          </Text>
        </Pressable>
      </View>
    </EntryCardBackground>
  );
}
