import React, { useEffect, useState } from "react";
import {
  Modal,
  View,
  TouchableWithoutFeedback,
  StyleSheet,
  Pressable,
  Dimensions,
  ScrollView,
  Keyboard,
} from "react-native";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";
import { ColorTheme } from "@/types";

type ModalPortalProps = {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  maxHeight?: boolean;
};

export default function ModalPortal({
  visible,
  onClose,
  children,
  maxHeight = false,
}: ModalPortalProps) {
  const { height: SCREEN_HEIGHT } = Dimensions.get("window");
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [contentHeight, setContentHeight] = useState(0);
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const styles = React.useMemo(() => getStyles(colors), [colors]);

  useEffect(() => {
    const showSub = Keyboard.addListener("keyboardDidShow", (e) => {
      setKeyboardHeight(e.endCoordinates.height);
    });
    const hideSub = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardHeight(0);
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  return (
    <Modal
      animationType="fade"
      transparent
      visible={visible}
      onRequestClose={onClose}
      statusBarTranslucent={true}
    >
      <TouchableWithoutFeedback
        onPress={(e) => {
          onClose();
        }}
      >
        <View style={[styles.overlay]}>
          <View
            style={[
              styles.modalView,
              {
                maxHeight:
                  keyboardHeight === 0 && contentHeight > SCREEN_HEIGHT * 0.9
                    ? SCREEN_HEIGHT * 0.9
                    : keyboardHeight > 0 &&
                        contentHeight > SCREEN_HEIGHT * 0.9 - keyboardHeight
                      ? SCREEN_HEIGHT * 0.9 - keyboardHeight
                      : contentHeight + 78,
              },
            ]}
          >
            <ScrollView showsVerticalScrollIndicator={false}>
              <Pressable
                onPress={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                }}
                onLayout={(e) => {
                  const h = e.nativeEvent.layout.height;
                  setContentHeight(h);
                }}
              >
                {children}
              </Pressable>
            </ScrollView>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const getStyles = (colors: ColorTheme) =>
  StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.27)",
      justifyContent: "center",
      alignItems: "center",
    },
    centeredView: {
      flex: 1,
      height: "100%",
      width: "100%",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0,0,0,0.27)",
    },
    modalView: {
      margin: 20,
      backgroundColor: colors.modalBackground,
      borderRadius: 20,
      padding: 25,
      // alignItems: "center",
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
      width: "80%",
    },
  });
