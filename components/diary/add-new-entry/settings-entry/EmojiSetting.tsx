import { Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";
import { MoodEmoji } from "@/constants/Mood";

type EmojiSettingProps = {
  setEmoji: (emoji: string) => void;
};
export default function EmojiSetting({ setEmoji }: EmojiSettingProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme] ?? Colors.system;

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: colors.background,
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
        {MoodEmoji.map((e) => (
          <View key={e.value}>
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
