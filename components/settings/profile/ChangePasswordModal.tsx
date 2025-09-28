import Emoji from "@/components/diary/Emoji";
import ModalPortal from "@/components/ui/Modal";
import React, { useMemo, useState } from "react";
import { ThemedText } from "@/components/ThemedText";
import {
  ActivityIndicator,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Formik } from "formik";
import { useTranslation } from "react-i18next";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";
import { ColorTheme, ErrorMessages, type Rejected } from "@/types";
import * as Yup from "yup";
import { apiRequest, passwordRules } from "@/utils";
import { UserEvents } from "@/utils/events/userEvents";
import * as SecureStore from "expo-secure-store";
import i18n from "i18next";
import { changeUserAuthData } from "@/store/thunks/auth/changeUserAuthData";
import { useAppDispatch } from "@/store";

type ChangePasswordModalProps = {
  showChangePasswordModal: boolean;
  setShowChangePasswordModal: (show: boolean) => void;
  onSuccessChangePassword: () => void;
};
export default function ChangePasswordModal({
  showChangePasswordModal,
  setShowChangePasswordModal,
  onSuccessChangePassword,
}: ChangePasswordModalProps) {
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const styles = useMemo(() => getStyles(colors), [colors]);
  const dispatch = useAppDispatch();
  const lang = useState<string>(i18n.language)[0];
  const [error, setError] = useState<string | null>(null);

  const changePasswordSchema = Yup.object().shape({
    email: Yup.string()
      .email(t("auth.enterValidEmailAddress"))
      .required(t("auth.emailIsRequired")),
    password: Yup.string()
      .matches(passwordRules, t("auth.thePasswordMustContain"))
      .required(t("auth.passwordRequired")),
    newPassword: Yup.string()
      .matches(passwordRules, t("auth.thePasswordMustContain"))
      .required(t("auth.passwordRequired")),
  });

  const handleChangePassword = async (
    values: { email: string; password: string; newPassword: string },
    {
      setSubmitting,
      resetForm,
    }: { setSubmitting: (submitting: boolean) => void; resetForm: () => void },
  ) => {
    setLoading(true);
    setError(null);
    const data = {
      email: values.email,
      password: values.password,
      newPassword: values.newPassword,
      lang,
    };
    try {
      await dispatch(changeUserAuthData(data)).unwrap();

      onSuccessChangePassword();
    } catch (err: any) {
      const payload = err as Rejected;
      console.log("handle handleChangePassword error", payload);
      const errorKey =
        ErrorMessages[payload.code as keyof typeof ErrorMessages];
      setError(errorKey ? t(`errors.${errorKey}`) : t("errors.undefined"));
      setLoading(false);
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  return (
    <ModalPortal
      visible={showChangePasswordModal}
      onClose={() => setShowChangePasswordModal(false)}
    >
      <ThemedText
        type="subtitleXL"
        style={{
          marginBottom: 20,
        }}
      >
        {t("settings.profile.changePassword")}
      </ThemedText>
      <Formik
        initialValues={{ email: "", password: "", newPassword: "" }}
        validationSchema={changePasswordSchema}
        onSubmit={handleChangePassword}
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
                <ThemedText
                  type={"small"}
                  style={{
                    color: colors.error,
                    marginTop: -10,
                    marginBottom: 20,
                  }}
                >
                  {errors.email}
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
                <ThemedText
                  type={"small"}
                  style={{
                    color: colors.error,
                    marginTop: -10,
                    marginBottom: 20,
                  }}
                >
                  {errors.password}
                </ThemedText>
              )}
              <ThemedText style={styles.label}>
                {t("settings.profile.newPassword")}
              </ThemedText>
              <TextInput
                placeholder={t("settings.profile.newPassword")}
                style={styles.input}
                value={values.newPassword}
                onChangeText={handleChange("newPassword")}
                onBlur={handleBlur("newPassword")}
                secureTextEntry
                autoCapitalize="none"
                placeholderTextColor={colors.inputPlaceholder}
              />
              {touched.newPassword && errors.newPassword && (
                <ThemedText
                  type={"small"}
                  style={{
                    color: colors.error,
                    marginTop: -10,
                    marginBottom: 20,
                  }}
                >
                  {errors.newPassword}
                </ThemedText>
              )}
            </View>
            {error && (
              <ThemedText
                type={"small"}
                style={{
                  color: colors.error,
                  marginTop: -10,
                  marginBottom: 20,
                }}
              >
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
                  {t("common.save")}
                </ThemedText>
              )}
            </TouchableOpacity>
          </>
        )}
      </Formik>
    </ModalPortal>
  );
}

const getStyles = (colors: ColorTheme) =>
  StyleSheet.create({
    input: {
      backgroundColor: colors.inputBackground,
      color: colors.text,
      borderWidth: 1,
      borderColor: colors.inputBorder,
      padding: 14,
      borderRadius: 8,
      marginBottom: 12,
      fontSize: 16,
      minWidth: "100%",
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
  });
