import React, {
  forwardRef,
  ReactNode,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Animated,
  Easing,
  Pressable,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
  useWindowDimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";
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
  mountContentAfterOpen?: boolean;
  keepMounted?: boolean;
  widthPct?: number;
  durationOpen?: number;
  durationClose?: number;
  backdropOpacity?: number;
  closeOnBackdrop?: boolean;
}

const SideSheet = forwardRef<SideSheetRef, SideSheetProps>(
  (
    {
      children,
      style,
      onOpenChange,
      mountContentAfterOpen = true,
      keepMounted = false,
      widthPct = 1,
      durationOpen = 120,
      durationClose = 220,
      backdropOpacity = 0.35,
      closeOnBackdrop = true,
    },
    ref,
  ) => {
    const { width } = useWindowDimensions();
    const sheetWidth = Math.round(width * Math.min(Math.max(widthPct, 0.5), 1));
    const insets = useSafeAreaInsets();
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? "light"];

    const translateX = useRef(new Animated.Value(sheetWidth)).current;
    const [visible, setVisible] = useState<boolean>(false);
    const [renderBody, setRenderBody] = useState<boolean>(
      !mountContentAfterOpen,
    );

    useEffect(() => {
      if (!visible) translateX.setValue(sheetWidth);
    }, [sheetWidth, visible, translateX]);

    const openSideScreen = () => {
      translateX.setValue(sheetWidth);
      setVisible(true);

      if (!renderBody && !mountContentAfterOpen) setRenderBody(true);

      Animated.timing(translateX, {
        toValue: 0,
        duration: durationOpen,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (finished) {
          if (mountContentAfterOpen && !renderBody) setRenderBody(true);
          onOpenChange?.(true);
        }
      });
    };

    const closeSideScreen = () => {
      Animated.timing(translateX, {
        toValue: sheetWidth,
        duration: durationClose,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (finished) {
          onOpenChange?.(false);
          if (!keepMounted) {
            setRenderBody(false);
            setVisible(false);
          } else {
            setVisible(true);
          }
        }
      });
    };

    useImperativeHandle(
      ref,
      () => ({
        open: openSideScreen,
        close: closeSideScreen,
        isOpen: visible,
      }),
      [visible, sheetWidth],
    );

    const backdropStyle = useMemo(() => {
      const opacity = translateX.interpolate({
        inputRange: [0, sheetWidth],
        outputRange: [backdropOpacity, 0],
        extrapolate: "clamp",
      });
      return { opacity };
    }, [translateX, sheetWidth, backdropOpacity]);

    if (!visible && !keepMounted) return null;

    return (
      <View style={styles.root} pointerEvents="box-none">
        <Animated.View
          pointerEvents={visible ? "auto" : "none"}
          style={[styles.backdrop, backdropStyle]}
        >
          {closeOnBackdrop && (
            <Pressable
              style={StyleSheet.absoluteFill}
              onPress={closeSideScreen}
            />
          )}
        </Animated.View>

        <Animated.View
          style={[
            styles.sideScreen,
            {
              width: sheetWidth,
              transform: [{ translateX }],
              paddingBottom: insets.bottom,
              paddingLeft: insets.left,
              paddingRight: insets.right,
            },
            style,
          ]}
          renderToHardwareTextureAndroid
          shouldRasterizeIOS
        >
          <Background>
            <View style={styles.content}>{renderBody ? children : null}</View>
          </Background>
        </Animated.View>
      </View>
    );
  },
);

SideSheet.displayName = "SideSheet";

export default SideSheet;

const styles = StyleSheet.create({
  root: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#000",
  },
  sideScreen: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "transparent",
    // elevation: 10,
  },
  content: {
    flex: 1,
  },
});
