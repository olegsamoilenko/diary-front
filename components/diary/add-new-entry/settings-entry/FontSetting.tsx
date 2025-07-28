import { ScrollView, TouchableOpacity, View } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";
import { FONTS } from "@/assets/fonts/entry";
import { useEffect } from "react";

type SizeSettingProps = {
  setFont: (font: any) => void;
  selectedFont: any;
};
export default function SizeSetting({
  setFont,
  selectedFont,
}: SizeSettingProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme] ?? Colors.system;

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: colors.background,
      }}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ maxHeight: 350, width: "100%" }}
        contentContainerStyle={{
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 10,
          padding: 10,
        }}
      >
        {FONTS.map((font) => (
          <View
            key={font.name}
            style={{
              width: "30%",
              height: 70,
              justifyContent: "center",
              alignItems: "center",
              elevation: 5,
              backgroundColor: colors.background,
              borderRadius: 2,
            }}
          >
            <View
              style={{
                position: "relative",
                zIndex: 100,
              }}
            >
              <TouchableOpacity onPress={() => setFont(font)}>
                <ThemedText
                  style={{
                    fontFamily: font.name,
                    color: colors.text,
                  }}
                >
                  {font.label}
                </ThemedText>
              </TouchableOpacity>
            </View>
            <View
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: 70,
                borderWidth: selectedFont.name === font.name ? 2 : 0,
                borderColor: colors.primary,
                borderRadius: 2,
              }}
            ></View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
