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
import { passwordRules } from "@/utils";
import i18n from "i18next";
import { changeUserAuthData } from "@/store/thunks/auth/changeUserAuthData";
import { useAppDispatch } from "@/store";
import { loadAccessToken } from "@/utils/store/storage";
import { useUIStyles } from "@/hooks/useUIStyles";
import ThemedTextInput from "@/components/ui/ThemedTextInput";

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
  const ui = useUIStyles();

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
      console.error("handle handleChangePassword error", payload);
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
              <ThemedText style={ui.label}>{t("auth.email")}</ThemedText>
              <ThemedTextInput
                name="email"
                touched={touched}
                errors={errors}
                placeholder={t("auth.email")}
                containerStyle={{
                  marginBottom: 16,
                }}
                value={values.email}
                onChangeText={handleChange("email")}
                onBlur={handleBlur("email")}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <ThemedText style={ui.label}>{t("auth.password")}</ThemedText>
              <ThemedTextInput
                name="password"
                touched={touched}
                errors={errors}
                placeholder={t("auth.password")}
                containerStyle={{
                  marginBottom: 16,
                }}
                value={values.password}
                onChangeText={handleChange("password")}
                onBlur={handleBlur("password")}
                secureTextEntry
                autoCapitalize="none"
              />
              <ThemedText style={ui.label}>
                {t("settings.profile.newPassword")}
              </ThemedText>
              <ThemedTextInput
                name="newPassword"
                touched={touched}
                errors={errors}
                placeholder={t("settings.profile.newPassword")}
                containerStyle={{
                  marginBottom: 16,
                }}
                value={values.newPassword}
                onChangeText={handleChange("newPassword")}
                onBlur={handleBlur("newPassword")}
                secureTextEntry
                autoCapitalize="none"
              />
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
              style={ui.btnPrimary}
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

const getStyles = (colors: ColorTheme) => StyleSheet.create({});
