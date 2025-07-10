import { TouchableOpacity, View } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";
import { green } from "react-native-reanimated/lib/typescript/Colors";

const FONT_SIZES = [12, 16, 18, 22, 28];

type SizeSettingProps = {
  setSize: (size: number) => void;
  selectedSize?: number;
};
export default function SizeSetting({
  setSize,
  selectedSize,
}: SizeSettingProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: colors.background,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "flex-end",
          justifyContent: "flex-end",
          gap: 10,
          marginBottom: 20,
        }}
      >
        {FONT_SIZES.map((size) => (
          <View
            key={size}
            style={{
              alignItems: "flex-end",
              justifyContent: "flex-end",
              position: "relative",
            }}
          >
            <TouchableOpacity
              onPress={() => setSize(size)}
              key={size}
              style={{
                alignItems: "flex-end",
                justifyContent: "flex-end",
              }}
            >
              <ThemedText
                style={{
                  fontSize: size,
                  borderWidth: 1,
                  borderColor:
                    selectedSize === size ? colors.primary : "transparent",
                  padding: 5,
                }}
              >
                {size}
              </ThemedText>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </View>
  );
}
