import React, { useEffect, useState } from "react";
import {
  Modal,
  View,
  TouchableWithoutFeedback,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
  Pressable,
  Dimensions,
  ScrollView,
  Keyboard,
} from "react-native";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";

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

  const computedMaxHeight = maxHeight
    ? SCREEN_HEIGHT * 0.8
    : SCREEN_HEIGHT - keyboardHeight - 40;
  return (
    <Modal
      animationType="fade"
      transparent
      visible={visible}
      onRequestClose={onClose}
      statusBarTranslucent={true}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={[styles.overlay]}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            style={[
              styles.centeredView,
              {
                maxHeight:
                  keyboardHeight === 0 && !maxHeight
                    ? contentHeight + 48
                    : computedMaxHeight,
              },
            ]}
          >
            <Pressable
              onPress={(e) => e.stopPropagation()}
              style={[
                styles.modalView,
                {
                  maxHeight:
                    keyboardHeight === 0 && !maxHeight
                      ? contentHeight + 48
                      : computedMaxHeight,
                  backgroundColor: colors.background,
                },
              ]}
            >
              <ScrollView
                contentContainerStyle={{
                  flexGrow: keyboardHeight === 0 ? 0 : 1,
                }}
                showsVerticalScrollIndicator={false}
                bounces={false}
              >
                <View
                  onLayout={(e) => {
                    const h = e.nativeEvent.layout.height;
                    setContentHeight(h);
                  }}
                >
                  {children}
                </View>
              </ScrollView>
            </Pressable>
          </KeyboardAvoidingView>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    height: "100%",
    width: "100%",
    backgroundColor: "rgba(0,0,0,0.27)",
    justifyContent: "center",
    alignItems: "center",
  },
  centeredView: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  modalView: {
    minWidth: 280,
    maxWidth: "85%",
    padding: 24,
    backgroundColor: "#fff",
    borderRadius: 18,
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 14,
  },
});
