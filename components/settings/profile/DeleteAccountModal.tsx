import ModalPortal from "@/components/ui/Modal";
import React from "react";
import { TouchableOpacity, View } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { useTranslation } from "react-i18next";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";
import { apiRequest, UserEvents } from "@/utils";
import * as SecureStore from "@/utils/store/secureStore";
import Toast from "react-native-toast-message";

type DeleteAccountModalProps = {
  showDeleteAccountModal: boolean;
  setShowDeleteAccountModal: (show: boolean) => void;
  userId?: number;
};
export default function DeleteAccountModal({
  showDeleteAccountModal,
  setShowDeleteAccountModal,
  userId,
}: DeleteAccountModalProps) {
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme] ?? Colors.system;

  const handleDeleteAccount = async () => {
    console.log("DeleteAccountModal: handleDeleteAccount called", userId);
    try {
      await apiRequest({
        url: `/users/${userId}`,
        method: "DELETE",
      });
      await SecureStore.deleteItemAsync("token");
      await SecureStore.deleteItemAsync("user");
      await SecureStore.deleteItemAsync("user_pin");
      await SecureStore.deleteItemAsync("user_pin");
      await SecureStore.deleteItemAsync("biometry_enabled");
      UserEvents.emit("userDeleted");
      setShowDeleteAccountModal(false);
    } catch (error) {
      console.error("Error deleting account:", error);
      Toast.show({
        type: "error",
        text1: t("toast.errorDeletingAccount"),
      });
    }
  };
  return (
    <ModalPortal
      visible={showDeleteAccountModal}
      onClose={() => setShowDeleteAccountModal(false)}
    >
      <View style={{ padding: 20 }}>
        <ThemedText style={{ fontSize: 18, fontWeight: "bold" }}>
          Are you sure you want to delete your account?
        </ThemedText>
        <ThemedText style={{ marginTop: 10 }}>
          You will lose all your records. This action cannot be undone.
        </ThemedText>
        <View
          style={{
            flexDirection: "row",
            gap: 10,
            justifyContent: "flex-end",
            marginTop: 20,
          }}
        >
          <TouchableOpacity
            onPress={() => setShowDeleteAccountModal(false)}
            style={{
              paddingHorizontal: 14,
              paddingVertical: 8,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: colors.border,
            }}
          >
            <ThemedText style={{ color: colors.text }}>Cancel</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleDeleteAccount}
            style={{
              backgroundColor: "red",
              paddingHorizontal: 14,
              paddingVertical: 8,
              borderRadius: 12,
            }}
          >
            <ThemedText style={{ color: "white" }}>Delete</ThemedText>
          </TouchableOpacity>
        </View>
      </View>
    </ModalPortal>
  );
}
