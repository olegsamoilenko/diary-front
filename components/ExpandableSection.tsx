import React, { useEffect, useRef, useState } from "react";
import { Animated, ViewStyle, View } from "react-native";

type Props = {
  expanded: boolean;
  children: React.ReactNode;
  collapsedHeight?: number;
  duration?: number;
  style?: ViewStyle | ViewStyle[];
};

export function ExpandableSection({
  expanded,
  children,
  collapsedHeight = 0,
  duration = 250,
  style,
}: Props) {
  const [measured, setMeasured] = useState<number | null>(null);
  const [ready, setReady] = useState(false);
  const anim = useRef(new Animated.Value(collapsedHeight)).current;

  const onLayout = (e: any) => {
    const h = e.nativeEvent.layout.height;
    if (!ready && h > 0) {
      setMeasured(h);
      setReady(true);
      anim.setValue(expanded ? h : collapsedHeight);
    } else if (ready && expanded && h !== measured) {
      setMeasured(h);
      anim.setValue(h);
    }
  };

  useEffect(() => {
    if (!ready || measured == null) return;
    Animated.timing(anim, {
      toValue: expanded ? measured : collapsedHeight,
      duration,
      useNativeDriver: false,
    }).start();
  }, [expanded, measured, ready, collapsedHeight, duration, anim]);

  const clipStyle = ready ? { height: anim, overflow: "hidden" as const } : {};

  return (
    <Animated.View style={[clipStyle, style]}>
      <View onLayout={onLayout}>{children}</View>
    </Animated.View>
  );
}
