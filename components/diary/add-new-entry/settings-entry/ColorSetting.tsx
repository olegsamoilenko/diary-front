import { Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";

export const COLORS = [
  { name: "red", code: "#F44336" },
  { name: "pink", code: "#E91E63" },
  { name: "purple", code: "#9C27B0" },
  { name: "deepPurple", code: "#673AB7" },
  { name: "indigo", code: "#3F51B5" },
  { name: "blue", code: "#2196F3" },
  { name: "lightBlue", code: "#03A9F4" },
  { name: "cyan", code: "#00BCD4" },
  { name: "teal", code: "#009688" },
  { name: "green", code: "#4CAF50" },
  { name: "lightGreen", code: "#8BC34A" },
  { name: "lime", code: "#CDDC39" },
  { name: "yellow", code: "#FFEB3B" },
  { name: "amber", code: "#FFC107" },
  { name: "orange", code: "#FF9800" },
  { name: "deepOrange", code: "#FF5722" },
  { name: "brown", code: "#795548" },
  { name: "grey", code: "#9E9E9E" },
  { name: "blueGrey", code: "#607D8B" },
  { name: "black", code: "#000000" },
  { name: "white", code: "#FFFFFF" },
];

type ColorSettingProps = {
  setColor: (color: string) => void;
  selectedColor: string;
};

export default function ColorSetting({
  setColor,
  selectedColor,
}: ColorSettingProps) {
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
        {COLORS.map((c) => (
          <View key={c.code}>
            <TouchableOpacity
              onPress={() => setColor(c.code)}
              style={{
                backgroundColor: c.code,
                width: 30,
                height: 30,
                borderRadius: 15,
                marginHorizontal: 6,
                borderWidth: 1,
                borderColor: "#333",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 1,
              }}
            >
              <Text style={{ color: "#fff", fontWeight: "bold" }}>
                {c.name.slice(0, 1).toUpperCase()}
              </Text>
            </TouchableOpacity>
            <View
              style={{
                position: "absolute",
                top: -2,
                left: 4,
                width: 34,
                height: 34,
                borderRadius: 50,
                borderWidth: 2,
                borderColor:
                  c.code === selectedColor ? colors.primary : "transparent",
              }}
            ></View>
          </View>
        ))}
      </View>
    </View>
  );
}
