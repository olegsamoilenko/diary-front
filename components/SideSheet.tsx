import React, {
  forwardRef,
  ReactNode,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import {
  Animated,
  Dimensions,
  View,
  StyleSheet,
  StyleProp,
  ViewStyle,
} from "react-native";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Colors } from "@/constants/Colors";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import Background from "@/components/Background";

export interface SideSheetRef {
  open: () => void;
  close: () => void;
  isOpen: boolean;
}

interface SideSheetProps {
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
  onOpenChange?: (isOpen: boolean) => void;
}

const SideSheet = forwardRef<SideSheetRef, SideSheetProps>(
  ({ children, style, onOpenChange }, ref) => {
    const [visible, setVisible] = useState<boolean>(false);
    const translateX = useRef<Animated.Value>(
      new Animated.Value(Dimensions.get("window").width),
    ).current;
    const insets = useSafeAreaInsets();
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme] ?? Colors.system;

    const openSideScreen = () => {
      translateX.setValue(Dimensions.get("window").width);
      setVisible(true);
      Animated.timing(translateX, {
        toValue: 0,
        duration: 320,
        useNativeDriver: true,
      }).start();
      onOpenChange?.(true);
    };

    const closeSideScreen = () => {
      Animated.timing(translateX, {
        toValue: Dimensions.get("window").width,
        duration: 320,
        useNativeDriver: true,
      }).start(() => setVisible(false));
      onOpenChange?.(false);
    };

    useImperativeHandle(
      ref,
      () => ({
        open: openSideScreen,
        close: closeSideScreen,
        isOpen: visible,
      }),
      [visible],
    );

    if (!visible) return null;

    return (
      <Animated.View
        style={[
          styles.sideScreen,
          {
            transform: [{ translateX: translateX }],
            paddingBottom: insets.bottom,
            paddingLeft: insets.left,
            paddingRight: insets.right,
          },
          style,
        ]}
      >
        <Background background={colors.background}>
          <View style={styles.content}>{children}</View>
        </Background>
      </Animated.View>
    );
  },
);

SideSheet.displayName = "SideSheetHandleNote";

export default SideSheet;

const styles = StyleSheet.create({
  sideScreen: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    // zIndex: 70,
    elevation: 10,
  },
  content: {
    flex: 1,
  },
});
