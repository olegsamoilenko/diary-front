import React, { useRef, useEffect } from "react";
import { Animated, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";

export default function RotatingIcon({
  expanded,
  onPress,
}: {
  expanded: boolean;
  onPress?: () => void;
}) {
  const rotation = useRef(new Animated.Value(0)).current;
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];

  useEffect(() => {
    Animated.timing(rotation, {
      toValue: expanded ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [expanded]);

  const rotateInterpolate = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });

  return (
    <TouchableOpacity onPress={onPress}>
      <Animated.View
        style={{
          transform: [{ rotate: rotateInterpolate }],
          zIndex: 0,
        }}
      >
        <MaterialCommunityIcons
          name="chevron-down"
          size={28}
          color={colors.icon}
        />
      </Animated.View>
    </TouchableOpacity>
  );
}
