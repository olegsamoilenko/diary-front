import { TouchableOpacity, StyleProp, ViewStyle } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import React from "react";
import { useColorScheme } from "@/hooks/useColorScheme";
import { SideSheetRef } from "@/components/SideSheet";
import { isRefObject } from "@/utils";

type BackArrowProps = {
  ref: React.Ref<SideSheetRef>;
  style?: StyleProp<ViewStyle>;
  onClose?: () => void;
};

export default function BackArrow({ ref, style, onClose }: BackArrowProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme] ?? Colors.system;

  function closeSheet() {
    if (isRefObject<SideSheetRef>(ref) && ref.current) {
      ref.current.close();
    }
    if (onClose) {
      onClose();
    }
  }
  return (
    <TouchableOpacity
      onPress={closeSheet}
      style={[
        {
          paddingTop: 35,
          paddingBottom: 10,
          width: 40,
        },
        style,
      ]}
    >
      <MaterialCommunityIcons
        name="arrow-left"
        size={28}
        color={colors.primary}
      />
    </TouchableOpacity>
  );
}
