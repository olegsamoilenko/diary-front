import type { PropsWithChildren, ReactElement } from "react";
import { StyleSheet, View } from "react-native";
import Animated, { useAnimatedRef } from "react-native-reanimated";

import { ThemedView } from "@/components/ThemedView";
import { useBottomTabOverflow } from "@/components/ui/TabBarBackground";

const HEADER_HEIGHT = 250;

type Props = PropsWithChildren<{
  isPadding?: boolean;
  scrollRef?: any;
  style?: any;
}>;

export default function ParallaxScrollView({
  children,
  isPadding = true,
  scrollRef,
  style = {},
}: Props): ReactElement {
  const localScrollRef = useAnimatedRef<Animated.ScrollView>();
  const refToUse = scrollRef || localScrollRef;
  const bottom = useBottomTabOverflow();

  return (
    <View style={styles.container}>
      <Animated.ScrollView
        ref={refToUse}
        scrollEventThrottle={16}
        scrollIndicatorInsets={{ bottom }}
        contentContainerStyle={[{ paddingBottom: bottom, flexGrow: 1 }]}
        keyboardShouldPersistTaps="always"
      >
        <View style={[styles.content, { padding: isPadding ? 10 : 0 }, style]}>
          {children}
        </View>
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: HEADER_HEIGHT,
    overflow: "hidden",
  },
  content: {
    flex: 1,
    gap: 16,
    overflow: "hidden",
  },
});
