import ModalPortal from "@/components/ui/Modal";
import React, { useMemo } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  unstable_batchedUpdates,
  View,
} from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { useTranslation } from "react-i18next";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";
import { apiRequest } from "@/utils";
import { UserEvents } from "@/utils/events/userEvents";
import * as SecureStore from "expo-secure-store";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useBiometry } from "@/context/BiometryContext";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import type { ColorTheme, User } from "@/types";
import { CodeStatus, ErrorMessages } from "@/types";
import { RootState, store, useAppDispatch } from "@/store";
import { resetUser } from "@/store/slices/userSlice";
import { resetSettings } from "@/store/slices/settingsSlice";
import { resetPlan } from "@/store/slices/planSlice";
import { sendVerificationCodeForUserDeleteApi } from "@/utils/api/endpoints/auth/sendVerificationCodeForUserDeleteApi";
import { useSelector } from "react-redux";
import { deleteAccount } from "@/store/thunks/auth/deleteAccount";

type DeleteAccountModalProps = {
  showDeleteAccountModal: boolean;
  setShowDeleteAccountModal: (show: boolean) => void;
};
export default function DeleteAccountModal({
  showDeleteAccountModal,
  setShowDeleteAccountModal,
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
  const user = useSelector((s: RootState) => s.user.value);
  const dispatch = useAppDispatch();

  const handleSentCode = async (type: "send" | "resend") => {
    setError("");
    if (type === "send") {
      setLoading(true);
    } else {
      setResendLoading(true);
    }

    try {
      const res = await sendVerificationCodeForUserDeleteApi(
        user!.email as string,
        type,
      );

      if (type === "send") {
        setShowEnterCodeForm(true);
        setLoading(false);
      } else {
        if (res && res.status === CodeStatus.COOLDOWN) {
          setTimer(res.retryAfterSec || 0);
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
      }
    } catch (error: any) {
      console.error("Error sending code:", error);
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setError("");
    setLoading(true);
    try {
      const res = await dispatch(
        deleteAccount({ email: user!.email as string, code }),
      ).unwrap();

      if (res.status === CodeStatus.OK) {
        await GoogleSignin.signOut();
        await setBiometry(false);
        UserEvents.emit("userDeleted");
        setShowDeleteAccountModal(false);
        setLoading(false);
        setCode("");
      }
    } catch (error: any) {
      console.error("Error deleting account:", error);
      setCode("");
      setError(
        error.code
          ? t(
              `errors.${ErrorMessages[error.code as keyof typeof ErrorMessages]}`,
            )
          : t(`errors.errorDeletingAccount`),
      );
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
              onPress={() => handleSentCode("resend")}
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
              onPress={() => handleSentCode("send")}
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
      color: colors.text,
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
