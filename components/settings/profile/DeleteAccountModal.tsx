import ModalPortal from "@/components/ui/Modal";
import React from "react";
import { TouchableOpacity, View } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { useTranslation } from "react-i18next";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";
import { apiRequest } from "@/utils";
import { UserEvents } from "@/utils/events/userEvents";
import * as SecureStore from "@/utils/store/secureStore";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useBiometry } from "@/context/BiometryContext";

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
  const colors = Colors[colorScheme];
  const { setBiometry } = useBiometry();

  const handleDeleteAccount = async () => {
    try {
      await apiRequest({
        url: `/users/${userId}`,
        method: "DELETE",
      });
      await Promise.allSettled([
        SecureStore.deleteItemAsync("token"),
        SecureStore.deleteItemAsync("user"),
        SecureStore.deleteItemAsync("user_pin"),
        SecureStore.deleteItemAsync("biometry_enabled"),
        AsyncStorage.removeItem("show_welcome"),
      ]);
      await setBiometry(false);
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
          {t("auth.wantToDeleteAccount")}
        </ThemedText>
        <ThemedText style={{ marginTop: 10 }}>
          {t("auth.loseAllRecords")}
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
            <ThemedText style={{ color: colors.text }}>
              {t("common.cancel")}
            </ThemedText>
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
            <ThemedText style={{ color: "white" }}>
              {t("common.delete")}
            </ThemedText>
          </TouchableOpacity>
        </View>
      </View>
    </ModalPortal>
  );
}
