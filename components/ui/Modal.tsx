import React from "react";
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
} from "react-native";

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
            style={styles.centeredView}
          >
            {maxHeight ? (
              <Pressable
                onPress={(e) => e.stopPropagation()}
                style={[styles.modalView, { maxHeight: SCREEN_HEIGHT * 0.8 }]}
              >
                <ScrollView
                  contentContainerStyle={{ flexGrow: 1 }}
                  showsVerticalScrollIndicator={false}
                  bounces={false}
                >
                  {children}
                </ScrollView>
              </Pressable>
            ) : (
              <Pressable
                onPress={(e) => e.stopPropagation()}
                style={styles.modalView}
              >
                {children}
              </Pressable>
            )}
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
    flex: 1,
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
