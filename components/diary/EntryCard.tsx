import {
  Animated,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { getEmojiByMood } from "@/constants/Mood";
import { ThemedText } from "@/components/ThemedText";
import type { Entry } from "@/types";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";
import React, { useEffect, useRef, useState } from "react";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import i18n from "i18next";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import ViewReachEditor from "@/components/diary/ViewReachEditor";
import EntryCardBackground from "@/components/diary/EntryCardBackground";
import NemoryIcon from "@/components/ui/logo/NemoryIcon";
import ModalPortal from "@/components/ui/Modal";
import { useTranslation } from "react-i18next";
import { ExpandableSection } from "@/components/ExpandableSection";

type EntryCardProps = { entry: Entry; deleteEntry: (id: number) => void };
export default function EntryCard({ entry, deleteEntry }: EntryCardProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const [expanded, setExpanded] = useState<{ [key: number]: boolean }>({});
  const format = useSelector((state: RootState) => state.timeFormat.value);
  const [key, setKey] = useState<number>(0);
  const [visibleDeleteModal, setVisibleDeleteModal] = useState(false);
  const { t } = useTranslation();

  const toggleExpand = (id: number) => {
    setExpanded((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
    setKey((prevKey) => prevKey + 1);
  };

  const handleDeleteEntry = async (id: number) => {
    setVisibleDeleteModal(false);
    deleteEntry(id);
  };

  const [contentHeight, setContentHeight] = useState<number>(30);
  const onLayout = (e) => {
    const height = e.nativeEvent.layout.height;
    if (height > 0) setContentHeight(height);
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
                  hour12: Number(format) === 12,
                })
                .toUpperCase()}
            </ThemedText>
          </View>
          <TouchableOpacity
            style={{
              justifyContent: "flex-start",
              flexDirection: "row",
              alignItems: "flex-start",
              marginTop: 5,
              marginLeft: 7,
            }}
            onPress={() => {
              setVisibleDeleteModal(true);
            }}
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
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "flex-end",
                  alignItems: "center",
                  gap: 10,
                  marginTop: 10,
                }}
              >
                <TouchableOpacity
                  style={{
                    paddingVertical: 5,
                    paddingHorizontal: 10,
                    borderRadius: 50,
                    borderWidth: 1,
                    borderColor: colors.border,
                    backgroundColor: "transparent",
                  }}
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
                  style={{
                    paddingVertical: 5,
                    paddingHorizontal: 10,
                    borderRadius: 50,
                    backgroundColor: colors.primary,
                  }}
                  onPress={() => handleDeleteEntry(Number(entry.id))}
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
          expanded={expanded[Number(entry.id)]}
          collapsedHeight={115}
          expandedHeight={180}
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.05)",
            borderRadius: 8,
            marginBottom: 12,
            padding: 6,
          }}
        >
          <Pressable
            key={entry.id}
            onPress={() => toggleExpand(Number(entry.id))}
          >
            <View onLayout={onLayout}>
              <ViewReachEditor
                key={key}
                content={
                  expanded[Number(entry.id)]
                    ? entry.content
                    : entry.previewContent
                }
              />
            </View>
          </Pressable>

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
              <ThemedText
                style={{
                  fontWeight: "bold",
                  color: colors.primary,
                  marginRight: 5,
                  position: "absolute",
                  top: 10,
                  left: 0,
                }}
              >
                <NemoryIcon /> <ThemedText> </ThemedText>
              </ThemedText>
              <ThemedText style={{ marginTop: 6, padding: 5 }}>
                <ThemedText
                  style={{
                    paddingLeft: 300,
                  }}
                >
                  {"        "}
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
        </ExpandableSection>

        {/*<Pressable onPress={() => toggleExpand(Number(entry.id))}>*/}
        {/*  <View*/}
        {/*    style={{*/}
        {/*      justifyContent: "center",*/}
        {/*      alignItems: "center",*/}
        {/*      marginTop: 5,*/}
        {/*    }}*/}
        {/*  >*/}
        {/*    <MaterialCommunityIcons*/}
        {/*      name="chevron-down"*/}
        {/*      size={5}*/}
        {/*      style={{*/}
        {/*        transform: expanded[Number(entry.id)]*/}
        {/*          ? [{ rotate: "180deg" }, { scaleX: 5.6 }, { scaleY: 6.9 }]*/}
        {/*          : [{ scaleX: 5.6 }, { scaleY: 6.9 }],*/}
        {/*        color: colors.tabIcon,*/}
        {/*      }}*/}
        {/*    />*/}
        {/*  </View>*/}
        {/*</Pressable>*/}
      </View>
    </EntryCardBackground>
  );
}
