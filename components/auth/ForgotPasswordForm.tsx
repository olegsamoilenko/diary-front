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
import { CodeStatus, ColorTheme, ErrorMessages } from "@/types";
import { useTranslation } from "react-i18next";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";
import * as Yup from "yup";
import axios from "axios";
import i18n from "i18next";
import Toast from "react-native-toast-message";
import { apiUrl } from "@/constants/env";

export default function ForgotPasswordForm({
  onSuccess,
}: {
  onSuccess: (email: string) => void;
}) {
  const { t } = useTranslation();
  const lang = useState<string | null>(i18n.language)[0];
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const styles = useMemo(() => getStyles(colors), [colors]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const forgotPasswordSchema = Yup.object().shape({
    email: Yup.string()
      .email(t("auth.enterValidEmailAddress"))
      .required(t("auth.emailIsRequired")),
  });

  const handleForgotPassword = async (
    values: { email: string },
    {
      setSubmitting,
      resetForm,
    }: { setSubmitting: (submitting: boolean) => void; resetForm: () => void },
  ) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post(`${apiUrl}/auth/reset-password`, {
        email: values.email,
        lang,
      });

      if (res.data.status === CodeStatus.COOLDOWN) {
        setError(
          t("auth.youCanResendCodeIn") +
            " " +
            res.data.retryAfterSec +
            " " +
            t("common.sec"),
        );
        return;
      }

      setLoading(false);
      resetForm();
      setSubmitting(false);
      onSuccess(values.email);
      Toast.show({
        type: "success",
        text1: t("toast.successfullySend"),
        text2: t("toast.weHaveSuccessfullySentTheCodeToYourEmail"),
      });
    } catch (err: any) {
      console.log("forgot password error", err);
      console.log("forgot password error response", err?.response);
      console.log("forgot password error response data", err?.response?.data);
      const code = err?.response?.data?.code as keyof typeof ErrorMessages;
      const errorKey = ErrorMessages[code];
      setError(errorKey ? t(`errors.${errorKey}`) : t("errors.undefined"));
    } finally {
      setLoading(false);
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
          {t("auth.sendPasswordResetCodeToYourEmail")}
        </ThemedText>
      </View>

      <Formik
        initialValues={{ email: "" }}
        validationSchema={forgotPasswordSchema}
        onSubmit={handleForgotPassword}
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
              <ThemedText style={styles.label}>{t("auth.email")}</ThemedText>
              <TextInput
                placeholder={t("auth.email")}
                style={styles.input}
                value={values.email}
                onChangeText={handleChange("email")}
                onBlur={handleBlur("email")}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholderTextColor={colors.inputPlaceholder}
              />
              {touched.email && errors.email && (
                <ThemedText type={"small"} style={styles.error}>
                  {errors.email}
                </ThemedText>
              )}
            </View>
            {error && (
              <ThemedText type={"small"} style={styles.error}>
                {error}
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
                  {t("common.send")}
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
    error: {
      color: colors.error,
      marginTop: -10,
      marginBottom: 20,
    },
  });
