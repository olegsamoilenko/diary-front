import { ColorTheme } from "@/types";
import {
  StyleSheet,
  View,
  TouchableWithoutFeedback,
  Animated,
} from "react-native";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";
import { ThemedText } from "@/components/ThemedText";
import { useEffect, useRef, useState } from "react";

type Position = "top" | "bottom" | "left" | "right";
type ArrowPosition = "start" | "center" | "end";
export default function ToolTip({
  children,
  position = "top",
  arrowPosition = "start",
  maxWidth = 100,
  left = 0,
  top = 0,
  right = 0,
  bottom = 0,
  onClose,
}: {
  children: React.ReactNode;
  position?: Position;
  arrowPosition?: ArrowPosition;
  maxWidth?: number;
  left?: number;
  top?: number;
  right?: number;
  bottom?: number;
  onClose?: () => void;
}) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const [lines, setLines] = useState(0);
  const styles = getStyles(
    colors,
    position,
    arrowPosition,
    maxWidth,
    lines,
    left,
    top,
    right,
    bottom,
  );
  const animation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animation, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [animation]);

  const animatedStyle = {
    opacity: animation,
    transform: [
      {
        scale: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [0.8, 1],
        }),
      },
    ],
  };

  return (
    <View style={StyleSheet.absoluteFillObject} pointerEvents="box-none">
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay} />
      </TouchableWithoutFeedback>
      <Animated.View style={[styles.tip, animatedStyle]}>
        <View style={styles.arrow}></View>
        <ThemedText onLinesCount={setLines}>{children}</ThemedText>
      </Animated.View>
    </View>
  );
}

const getStyles = (
  colors: ColorTheme,
  position: Position,
  arrowPosition: ArrowPosition,
  maxWidth: number,
  lines: number,
  left: number,
  top: number,
  right: number,
  bottom: number,
) =>
  StyleSheet.create({
    overlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: "rgba(0,0,0,0.27)",
      // zIndex: 98,
    },
    tip: {
      position: "absolute",
      left: left,
      top: top,
      right: right,
      bottom: bottom,
      backgroundColor: colors.background,
      borderRadius: 8,
      borderColor: colors.border,
      borderWidth: 1,
      padding: 10,
      zIndex: 99,
      maxWidth: maxWidth,
      maxHeight: lines * 45,
      shadowColor: "#000",
      shadowOpacity: 0.18,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 2 },
      elevation: 10,
    },
    arrow: {
      position: "absolute",
      width: 12,
      height: 12,
      backgroundColor: colors.background,
      top:
        arrowPosition === "start" &&
        (position === "left" || position === "right")
          ? "25%"
          : arrowPosition === "center" &&
              (position === "left" || position === "right")
            ? "50%"
            : arrowPosition === "end" &&
                (position === "left" || position === "right")
              ? "80%"
              : position === "bottom"
                ? -5
                : undefined,
      bottom: position === "top" ? -6 : undefined,
      right: position === "left" ? -6 : undefined,
      left:
        arrowPosition === "start" &&
        (position === "top" || position === "bottom")
          ? "20%"
          : arrowPosition === "center" &&
              (position === "top" || position === "bottom")
            ? "50%"
            : arrowPosition === "end" &&
                (position === "top" || position === "bottom")
              ? "80%"
              : position === "right"
                ? -5
                : undefined,
      transform: [{ rotate: "45deg" }],
    },
  });
