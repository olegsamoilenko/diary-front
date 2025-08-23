import React, { useEffect, useRef } from "react";
import { Animated, Text, View, ViewStyle } from "react-native";

type Props = {
  emoji: string;
  size: number;
  active?: boolean;
  zIndex?: number;
  ringColor?: string;
  ringWidth?: number;
  ringPadding?: number;
  style?: ViewStyle;
};

export default function EmojiBadge({
  emoji,
  size,
  active = false,
  zIndex = 0,
  ringColor = "#6C5CE7",
  ringWidth = 2,
  ringPadding = 0,
  style,
}: Props) {
  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!active) return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0,
          duration: 900,
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [active, pulse]);

  const pulseScale = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.4],
  });
  const pulseOpacity = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.7],
  });

  const ringSize = size + ringPadding * 2;

  return (
    <View
      style={[
        {
          width: size,
          height: size,
          alignItems: "center",
          justifyContent: "center",
          zIndex: active ? zIndex + 100 : zIndex,
          backgroundColor: "transparent",
        },
        style,
      ]}
      pointerEvents="box-none"
    >
      {active && (
        <Animated.View
          pointerEvents="none"
          style={{
            position: "absolute",
            width: ringSize,
            height: ringSize,
            borderRadius: ringSize / 2,
            borderWidth: ringWidth,
            borderColor: ringColor,
            opacity: pulseOpacity,
            transform: [{ scale: pulseScale }],
          }}
        />
      )}

      <View
        pointerEvents="none"
        style={{
          position: "absolute",
          width: ringSize,
          height: ringSize,
          borderRadius: ringSize / 2,
          borderWidth: ringWidth,
        }}
      />

      <Text
        style={{
          fontSize: size,
          lineHeight: size,
          textAlign: "center",
          includeFontPadding: false as any,
        }}
        allowFontScaling={false}
      >
        {emoji}
      </Text>
    </View>
  );
}
