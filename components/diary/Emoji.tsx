import { MoodEmoji } from "@/constants/Mood";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useState } from "react";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";

export default function Emoji({
  handleSelectedEmoji,
  mood,
}: {
  handleSelectedEmoji: (emoji: string) => void;
  mood?: string;
}) {
  const [selectedEmoji, setSelectedEmoji] = useState<string | undefined>(mood);
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];

  const handleEmoji = (emoji: string) => {
    setSelectedEmoji(emoji);
    handleSelectedEmoji(emoji);
  };
  return (
    <View
      style={{
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "center",
        alignItems: "center",
        gap: 5,
      }}
    >
      {MoodEmoji.map((emoji, index) => (
        <TouchableOpacity
          key={emoji.value}
          onPress={() => handleEmoji(emoji.value)}
          style={{
            backgroundColor:
              selectedEmoji === emoji.value ? colors.primary : undefined,
            borderRadius: 50,
            padding: 5,
          }}
        >
          <Text
            style={{
              fontSize: 36,
              lineHeight: 40,
              textAlign: "center",
            }}
          >
            {emoji.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
