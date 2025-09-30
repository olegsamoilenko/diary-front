import {
  ActivityIndicator,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { ThemedText } from "@/components/ThemedText";
import React, { useMemo, useState } from "react";
import { ColorTheme, ErrorMessages, CodeStatus, type Rejected } from "@/types";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";
import { useTranslation } from "react-i18next";
import Toast from "react-native-toast-message";
import { UserEvents } from "@/utils/events/userEvents";
import i18n from "i18next";
import { RootState, useAppDispatch } from "@/store";
import { verifyUserEmail } from "@/store/thunks/auth/verifyUserEmail";
import { useSelector } from "react-redux";
import { resendEmailVerificationCodeApi } from "@/utils/api/endpoints/auth/resendEmailVerificationCodeApi";
import ThemedTextInput from "@/components/ui/ThemedTextInput";
import { useUIStyles } from "@/hooks/useUIStyles";

type EmailVerificationCodeFormProps = {
  forPlanSelect: boolean;
  onSuccessEmailCode: () => void;
};
export default function EmailVerificationCodeForm({
  forPlanSelect,
  onSuccessEmailCode,
}: EmailVerificationCodeFormProps) {
  const [code, setCode] = useState("");
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const styles = useMemo(() => getStyles(colors), [colors]);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const { t } = useTranslation();
  const [error, setError] = useState<string | null>(null);
  const lang = useState<string>(i18n.language)[0];
  const [timer, setTimer] = useState(0);
  const dispatch = useAppDispatch();
  const user = useSelector((s: RootState) => s.user.value);
  const ui = useUIStyles();

  const handleSubmit = async () => {
    if (code.length !== 6) {
      setError(t("auth.codeMustBe6Digits"));
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await dispatch(
        verifyUserEmail({
          email: user!.email as string,
          code,
        }),
      ).unwrap();

      setCode("");

      Toast.show({
        type: "success",
        text1: t("toast.emailConfirmed"),
        text2: t("toast.youHaveSuccessfullyVerifiedYourEmail"),
      });

      onSuccessEmailCode();
      UserEvents.emit("userRegistered");
    } catch (err: any) {
      const payload = err as Rejected;
      console.log("handle verify email error", payload);
      const errorKey =
        ErrorMessages[payload.code as keyof typeof ErrorMessages];
      setError(errorKey ? t(`errors.${errorKey}`) : t("errors.undefined"));
      setCode("");
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const resendCode = async () => {
    setCode("");
    setResendLoading(true);
    setError(null);
    try {
      const res = await resendEmailVerificationCodeApi(
        user?.email as string,
        lang,
        "register",
      );

      if (!res) throw new Error("No response from server");

      if (res.status === CodeStatus.COOLDOWN) {
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
        text2: t("toast.weHaveSentYouCodeByEmail"),
      });
    } catch (err: any) {
      console.log("resend code error response", err?.response);
      const code = err?.response?.data?.code as keyof typeof ErrorMessages;
      const errorKey = ErrorMessages[code];
      setError(errorKey ? t(`errors.${errorKey}`) : t("errors.undefined"));
      setCode("");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <View style={styles.center}>
      <ThemedText style={styles.label}>
        {t("auth.weHaveSentYouCodeByEmail")}
      </ThemedText>
      <ThemedTextInput
        name="code"
        value={code}
        onChangeText={setCode}
        keyboardType="number-pad"
        maxLength={6}
        placeholder="******"
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
        errorMessage={error}
      />

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
        style={ui.btnPrimary}
        onPress={() => handleSubmit()}
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
  );
}

const getStyles = (colors: ColorTheme) =>
  StyleSheet.create({
    center: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      padding: 20,
    },
    label: {
      fontSize: 16,
      marginBottom: 16,
      textAlign: "center",
      fontWeight: "500",
    },
    error: {
      color: colors.error,
      marginTop: -10,
      marginBottom: 20,
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
