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
import { UserEvents } from "@/utils/events/userEvents";
import Toast from "react-native-toast-message";
import { useBiometry } from "@/context/BiometryContext";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import type { ColorTheme } from "@/types";
import { CodeStatus, ErrorMessages } from "@/types";
import { RootState, useAppDispatch } from "@/store";
import { sendVerificationCodeForUserDeleteApi } from "@/utils/api/endpoints/auth/sendVerificationCodeForUserDeleteApi";
import { useSelector } from "react-redux";
import { deleteAccount } from "@/store/thunks/auth/deleteAccount";
import { useUIStyles } from "@/hooks/useUIStyles";
import ThemedTextInput from "@/components/ui/ThemedTextInput";

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
  const ui = useUIStyles();

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
        <View style={{ alignItems: "center" }}>
          <ThemedText style={{ fontSize: 18, fontWeight: "bold" }}>
            {t("auth.weHaveSentYouCodeToDeleteYourAccount")}
          </ThemedText>
          <View style={{ marginTop: 10, marginBottom: 10 }}>
            <ThemedText>
              {t("auth.pleaseEnterThisCodeToConfirmTheDeletionOfYourAccount")}
            </ThemedText>
          </View>
          <ThemedTextInput
            name="code"
            errorMessage={error}
            value={code}
            onChangeText={setCode}
            keyboardType="number-pad"
            maxLength={6}
            inputStyle={{
              letterSpacing: 5,
              textAlign: "center",
              minWidth: 180,
              paddingTop: 10,
              paddingBottom: 8,
            }}
            containerStyle={{
              marginBottom: 16,
            }}
            errorStyle={{
              textAlign: "center",
            }}
            placeholder="******"
          />
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
            style={ui.btnPrimary}
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
        <View>
          <ThemedText style={{ fontSize: 18, fontWeight: "bold" }}>
            {t("auth.wantToDeleteAccount")}
          </ThemedText>
          <ThemedText style={{ marginTop: 10 }}>
            {t("auth.loseAllRecords")}
          </ThemedText>
          <View
            style={{
              marginTop: 20,
            }}
          >
            <TouchableOpacity
              onPress={() => handleSentCode("send")}
              style={[
                ui.btnPrimary,
                { backgroundColor: colors.error, marginBottom: 18 },
              ]}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <ThemedText style={{ color: "white", textAlign: "center" }}>
                  {t("common.delete")}
                </ThemedText>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setShowDeleteAccountModal(false)}
              style={ui.btnOutline}
            >
              <ThemedText style={{ color: colors.text, textAlign: "center" }}>
                {t("common.cancel")}
              </ThemedText>
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
