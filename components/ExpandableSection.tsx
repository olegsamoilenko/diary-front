import React, { useEffect, useRef, useState } from "react";
import { Animated, View, StyleSheet } from "react-native";

export function ExpandableSection({
  expanded,
  children,
  collapsedHeight = 0,
  expandedHeight = 180,
  style,
}) {
  const animHeight = useRef(
    new Animated.Value(expanded ? expandedHeight : collapsedHeight),
  ).current;
  const animOpacity = useRef(new Animated.Value(expanded ? 1 : 0)).current;
  const [contentHeight, setContentHeight] = useState(70);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(animHeight, {
        toValue: expanded ? contentHeight : collapsedHeight,
        duration: 250,
        useNativeDriver: false,
      }),
      Animated.timing(animOpacity, {
        toValue: expanded ? 1 : 0,
        duration: 200,
        useNativeDriver: false,
      }),
    ]).start();
  }, [expanded]);

  const onLayout = (e) => {
    const height = e.nativeEvent.layout.height;
    if (height > 0 && height !== contentHeight) setContentHeight(height);
    if (expanded) {
      animHeight.setValue(height);
    }
  };

  useEffect(() => {}, [contentHeight]);

  return (
    <Animated.View
      style={[
        {
          height: animHeight,
          // opacity: animOpacity,
          overflow: "hidden",
        },
        style,
      ]}
    >
      <View onLayout={onLayout}>{children}</View>
    </Animated.View>
  );
}
