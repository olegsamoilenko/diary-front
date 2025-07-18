import { Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";

const EMOJI = [
  { label: "😀", mood: "joyful" },
  { label: "😁", mood: "very happy" },
  { label: "😂", mood: "laughing" },
  { label: "🤣", mood: "hilarious" },
  { label: "😊", mood: "happy" },
  { label: "😇", mood: "blessed" },
  { label: "🙂", mood: "calm" },
  { label: "🙃", mood: "playful" },
  { label: "😉", mood: "winking" },
  { label: "😌", mood: "relaxed" },
  { label: "😍", mood: "in love" },
  { label: "🥰", mood: "adoring" },
  { label: "😘", mood: "kissing" },
  { label: "😋", mood: "satisfied" },
  { label: "😎", mood: "cool" },
  { label: "🤩", mood: "excited" },
  { label: "🤗", mood: "hugging" },
  { label: "🤔", mood: "thinking" },
  { label: "😏", mood: "smirking" },
  { label: "😜", mood: "goofy" },
  { label: "😝", mood: "playful2" },
  { label: "🤑", mood: "money-minded" },
  { label: "🤠", mood: "adventurous" },
  { label: "😴", mood: "sleepy" },
  { label: "😪", mood: "tired" },
  { label: "😒", mood: "unimpressed" },
  { label: "😔", mood: "disappointed" },
  { label: "😢", mood: "sad" },
  { label: "😭", mood: "crying" },
  { label: "😞", mood: "down" },
  { label: "😟", mood: "worried" },
  { label: "😕", mood: "confused" },
  { label: "🙁", mood: "frowning" },
  { label: "😣", mood: "frustrated" },
  { label: "😖", mood: "distressed" },
  { label: "😫", mood: "exhausted" },
  { label: "😩", mood: "overwhelmed" },
  { label: "🥺", mood: "pleading" },
  { label: "😤", mood: "annoyed" },
  { label: "😠", mood: "angry" },
  { label: "😡", mood: "furious" },
  { label: "🤬", mood: "outraged" },
  { label: "😨", mood: "anxious" },
  { label: "😰", mood: "nervous" },
  { label: "😱", mood: "shocked" },
  { label: "😳", mood: "embarrassed" },
  { label: "🥶", mood: "cold" },
  { label: "🥵", mood: "hot" },
  { label: "🤒", mood: "sick" },
  { label: "🤕", mood: "hurt" },
  { label: "🤢", mood: "disgusted" },
  { label: "🥳", mood: "celebrating" },
];

type EmojiSettingProps = {
  setEmoji: (emoji: string) => void;
};
export default function EmojiSetting({ setEmoji }: EmojiSettingProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: colors.backgroundColor,
        width: "100%",
      }}
    >
      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          gap: 8,
          margin: 8,
          width: "100%",
        }}
      >
        {EMOJI.map((e) => (
          <View key={e.mood}>
            <TouchableOpacity
              onPress={() => setEmoji(e.label)}
              style={{
                borderRadius: 15,
                marginHorizontal: 6,
                alignItems: "center",
                justifyContent: "center",
                zIndex: 1,
              }}
            >
              <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 24 }}>
                {e.label}
              </Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </View>
  );
}
