import ModalPortal from "@/components/ui/Modal";
import React, { useMemo } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
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
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import type { ColorTheme, User } from "@/types";
import { CodeStatus, ErrorMessages } from "@/types";

type DeleteAccountModalProps = {
  showDeleteAccountModal: boolean;
  setShowDeleteAccountModal: (show: boolean) => void;
  user: User;
};
export default function DeleteAccountModal({
  showDeleteAccountModal,
  setShowDeleteAccountModal,
  user,
}: DeleteAccountModalProps) {
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const { setBiometry } = useBiometry();
  const [showEnterCodeForm, setShowEnterCodeForm] = React.useState(false);
  const [code, setCode] = React.useState("");
  const styles = useMemo(() => getStyles(colors), [colors]);
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [resendLoading, setResendLoading] = React.useState(false);
  const [timer, setTimer] = React.useState(0);

  const handleSentCode = async () => {
    setError("");
    setLoading(true);
    try {
      const res = await apiRequest({
        url: `/users/send-verification-code-for-delete`,
        method: "POST",
        data: {
          email: user.email,
        },
      });

      setShowEnterCodeForm(true);
      setLoading(false);
    } catch (error: any) {
      console.error("Error sending code:", error);
      console.error("Error sending code response:", error.response);
      console.error("Error sending code response data:", error.response.data);
      Toast.show({
        type: "error",
        text1: t("toast.errorSendingCode"),
      });
      setLoading(false);
    }
  };

  const resendCode = async () => {
    setError("");
    setResendLoading(true);
    try {
      const res = await apiRequest({
        url: `/users/send-verification-code-for-delete`,
        method: "POST",
        data: {
          email: user.email,
        },
      });
      if (res.data.status === CodeStatus.COOLDOWN) {
        setTimer(res.data.retryAfterSec || 0);
        const intervalId = setInterval(() => {
          setTimer((prev) => {
            if (prev <= 1) {
              clearInterval(intervalId);
              setResendLoading(false);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
        return;
      }

      Toast.show({
        type: "success",
        text1: t("toast.codeResent"),
      });
      setResendLoading(false);
    } catch (error: any) {
      setResendLoading(false);
      console.error("Error resending code:", error);
      console.error("Error resending code response:", error.response);
      console.error("Error resending code response data:", error.response.data);
      Toast.show({
        type: "error",
        text1: t("toast.errorResendingCode"),
      });
    }
  };

  const handleDeleteAccount = async () => {
    setError("");
    setLoading(true);
    try {
      const res = await apiRequest({
        url: `/users/delete-account-by-verification-code`,
        method: "POST",
        data: {
          email: user.email,
          code,
        },
      });

      if (res.data.status === CodeStatus.OK) {
        await Promise.allSettled([
          SecureStore.deleteItemAsync("token"),
          SecureStore.deleteItemAsync("user"),
          SecureStore.deleteItemAsync("user_pin"),
          SecureStore.deleteItemAsync("biometry_enabled"),
          AsyncStorage.removeItem("show_welcome"),
          AsyncStorage.removeItem("register_or_not"),
        ]);
        await GoogleSignin.signOut();
        await setBiometry(false);
        UserEvents.emit("userDeleted");
        setShowDeleteAccountModal(false);
        setLoading(false);
        setCode("");
      }
    } catch (error: any) {
      console.error("Error deleting account:", error);
      console.error("Error deleting account response:", error.response);
      console.error(
        "Error deleting account response data:",
        error.response.data,
      );
      setCode("");
      setError(
        error.response.data.code
          ? t(
              `errors.${ErrorMessages[error.response.data.code as keyof typeof ErrorMessages]}`,
            )
          : t(`errors.errorDeletingAccount`),
      );
      Toast.show({
        type: "error",
        text1: error.response.data.code
          ? t(
              `errors.${ErrorMessages[error.response.data.code as keyof typeof ErrorMessages]}`,
            )
          : t(`errors.errorDeletingAccount`),
      });
      setLoading(false);
    }
  };

  return (
    <ModalPortal
      visible={showDeleteAccountModal}
      onClose={() => {
        setShowDeleteAccountModal(false);
        setShowEnterCodeForm(false);
      }}
    >
      {showEnterCodeForm ? (
        <View style={{ padding: 20, alignItems: "center" }}>
          <ThemedText style={{ fontSize: 18, fontWeight: "bold" }}>
            {t("auth.weHaveSentYouCodeToDeleteYourAccount")}
          </ThemedText>
          <View style={{ marginTop: 10, marginBottom: 10 }}>
            <ThemedText>
              {t("auth.pleaseEnterThisCodeToConfirmTheDeletionOfYourAccount")}
            </ThemedText>
          </View>
          <TextInput
            value={code}
            onChangeText={setCode}
            keyboardType="number-pad"
            maxLength={6}
            style={[styles.input, { letterSpacing: 5 }]}
            placeholder="******"
            placeholderTextColor={colors.inputPlaceholder}
          />
          {error && (
            <ThemedText type={"small"} style={styles.error}>
              {error}
            </ThemedText>
          )}
          {!timer && (
            <TouchableOpacity
              style={styles.resendCodeBtn}
              onPress={resendCode}
              disabled={resendLoading}
            >
              {resendLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <ThemedText
                  type="subtitleLG"
                  style={[
                    styles.text,
                    {
                      color: colors.text,
                    },
                  ]}
                >
                  {t("auth.resendCode")}
                </ThemedText>
              )}
            </TouchableOpacity>
          )}

          {timer > 0 && (
            <ThemedText
              type="small"
              style={{ marginBottom: 10, textAlign: "center" }}
            >
              {t("auth.youCanResendCodeIn")} {timer} {t("common.sec")}
            </ThemedText>
          )}
          <TouchableOpacity
            style={styles.btn}
            onPress={() => handleDeleteAccount()}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <ThemedText
                style={[
                  styles.text,
                  {
                    color: colors.textInPrimary,
                  },
                ]}
              >
                {t("auth.confirm")}
              </ThemedText>
            )}
          </TouchableOpacity>
        </View>
      ) : (
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
              onPress={handleSentCode}
              style={{
                backgroundColor: "red",
                paddingHorizontal: 14,
                paddingVertical: 8,
                borderRadius: 12,
              }}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <ThemedText style={{ color: "white" }}>
                  {t("common.delete")}
                </ThemedText>
              )}
            </TouchableOpacity>
          </View>
        </View>
      )}
    </ModalPortal>
  );
}

const getStyles = (colors: ColorTheme) =>
  StyleSheet.create({
    error: {
      color: colors.error,
      marginTop: -10,
      marginBottom: 20,
    },
    input: {
      borderRadius: 12,
      padding: 12,
      fontSize: 20,
      marginBottom: 16,
      width: 180,
      textAlign: "center",
      backgroundColor: colors.inputBackground,
    },
    btn: {
      paddingHorizontal: 18,
      paddingVertical: 10,
      backgroundColor: colors.primary,
      borderRadius: 12,
      textAlign: "center",
    },
    resendCodeBtn: {
      paddingHorizontal: 18,
      paddingVertical: 10,
      borderRadius: 12,
      marginBottom: 16,
    },
    text: {
      textAlign: "center",
    },
  });
