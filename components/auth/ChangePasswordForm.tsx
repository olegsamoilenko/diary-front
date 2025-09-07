import {
  ActivityIndicator,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { Formik } from "formik";
import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";
import { CodeStatus, ColorTheme, ErrorMessages } from "@/types";
import * as Yup from "yup";
import { passwordRules } from "@/utils";
import axios from "axios";
import Toast from "react-native-toast-message";
import { apiUrl } from "@/constants/env";
import i18n from "i18next";

export default function ChangePasswordForm({
  email,
  onSuccess,
}: {
  email: string;
  onSuccess: () => void;
}) {
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const styles = useMemo(() => getStyles(colors), [colors]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const lang = useState<string | null>(i18n.language)[0];
  const [resendLoading, setResendLoading] = useState(false);
  const [timer, setTimer] = useState(0);

  const passwordSchema = Yup.object().shape({
    code: Yup.string()
      .length(6, t("auth.codeMustBe6Digits"))
      .required(t("auth.codeRequired")),
    password: Yup.string()
      .matches(passwordRules, t("auth.thePasswordMustContain"))
      .required(t("auth.passwordRequired")),
    confirmPassword: Yup.string()
      .required(t("auth.confirmYourPassword"))
      .oneOf([Yup.ref("password")], t("auth.passwordsDoNotMatch")),
  });

  const handleSave = async (
    values: {
      code: string;
      password: string;
      confirmPassword: string;
    },
    {
      setSubmitting,
      resetForm,
    }: { setSubmitting: (submitting: boolean) => void; resetForm: () => void },
  ) => {
    setLoading(true);
    setError(null);
    try {
      await axios.post(`${apiUrl}/auth/change-password`, {
        email,
        code: values.code,
        password: values.password,
      });

      setLoading(false);
      resetForm();
      setSubmitting(false);
      onSuccess();
      Toast.show({
        type: "success",
        text1: t("toast.successfullySend"),
        text2: t("toast.youHaveSuccessfullyChangedYourPassword"),
      });
    } catch (err: any) {
      console.log("Change password error", err);
      console.log("Change password error response", err?.response);
      console.log("Change password error response data", err?.response?.data);
      const code = err?.response?.data?.code as keyof typeof ErrorMessages;
      const errorKey = ErrorMessages[code];
      setError(errorKey ? t(`errors.${errorKey}`) : t("errors.undefined"));
    } finally {
      setLoading(false);
    }
  };

  const resendCode = async () => {
    setResendLoading(true);
    setError(null);
    try {
      const res = await axios.post(`${apiUrl}/auth/reset-password`, {
        email: email,
        lang,
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

      setResendLoading(false);
      Toast.show({
        type: "success",
        text1: t("toast.successfullySend"),
        text2: t("toast.weHaveSuccessfullySentTheCodeToYourEmail"),
      });
    } catch (err: any) {
      console.log("reset password error", err);
      console.log("reset password error response", err?.response);
      console.log("reset password error response data", err?.response?.data);
      const code = err?.response?.data?.code as keyof typeof ErrorMessages;
      const errorKey = ErrorMessages[code];
      setError(errorKey ? t(`errors.${errorKey}`) : t("errors.undefined"));
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View
        style={{
          marginBottom: 20,
        }}
      >
        <ThemedText
          type="subtitleXL"
          style={{
            textAlign: "center",
          }}
        >
          {t("auth.changePassword")}
        </ThemedText>
      </View>

      <Formik
        initialValues={{ code: "", password: "", confirmPassword: "" }}
        validationSchema={passwordSchema}
        onSubmit={handleSave}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
          isSubmitting,
        }) => (
          <>
            <View
              style={{
                marginBottom: 20,
              }}
            >
              <ThemedText style={styles.label}>{t("auth.code")}</ThemedText>
              <TextInput
                value={values.code}
                onChangeText={handleChange("code")}
                onBlur={handleBlur("code")}
                keyboardType="number-pad"
                maxLength={6}
                style={[styles.input, { letterSpacing: 5 }]}
                placeholder="******"
                placeholderTextColor={colors.inputPlaceholder}
              />
              {touched.code && errors.code && (
                <ThemedText type={"small"} style={styles.error}>
                  {errors.code}
                </ThemedText>
              )}
              <ThemedText style={styles.label}>{t("auth.password")}</ThemedText>
              <TextInput
                placeholder={t("auth.password")}
                style={styles.input}
                value={values.password}
                onChangeText={handleChange("password")}
                onBlur={handleBlur("password")}
                secureTextEntry
                autoCapitalize="none"
                placeholderTextColor={colors.inputPlaceholder}
              />
              {touched.password && errors.password && (
                <ThemedText type={"small"} style={styles.error}>
                  {errors.password}
                </ThemedText>
              )}
              <ThemedText style={styles.label}>
                {t("auth.confirmPassword")}
              </ThemedText>
              <TextInput
                placeholder={t("auth.confirmPassword")}
                style={styles.input}
                value={values.confirmPassword}
                onChangeText={handleChange("confirmPassword")}
                onBlur={handleBlur("confirmPassword")}
                secureTextEntry
                autoCapitalize="none"
                placeholderTextColor={colors.inputPlaceholder}
              />
              {touched.confirmPassword && errors.confirmPassword && (
                <ThemedText type={"small"} style={styles.error}>
                  {errors.confirmPassword}
                </ThemedText>
              )}
            </View>
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
              onPress={() => handleSubmit()}
              disabled={isSubmitting}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <ThemedText
                  style={{
                    color: colors.textInPrimary,
                    textAlign: "center",
                  }}
                >
                  {t("common.save")}
                </ThemedText>
              )}
            </TouchableOpacity>
          </>
        )}
      </Formik>
    </View>
  );
}

const getStyles = (colors: ColorTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: 10,
      backgroundColor: "transparent",
    },
    input: {
      backgroundColor: colors.inputBackground,
      padding: 14,
      borderRadius: 8,
      marginBottom: 12,
      fontSize: 16,
      maxWidth: "100%",
    },
    label: {
      marginBottom: 16,
      textAlign: "left",
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
    error: {
      color: colors.error,
      marginTop: -10,
      marginBottom: 20,
    },
  });
