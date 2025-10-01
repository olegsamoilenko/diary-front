import React, { useMemo, useState } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import GoogleSignInButton from "@/components/auth/GoogleSignInButton";
import { ThemedText } from "@/components/ThemedText";
import type { ColorTheme, Rejected } from "@/types";
import { ErrorMessages } from "@/types";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";
import { useTranslation } from "react-i18next";
import { Formik } from "formik";
import * as Yup from "yup";
import { passwordRules } from "@/utils/";
import Toast from "react-native-toast-message";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "@/store";
import { loginUser } from "@/store/thunks/auth/loginUser";
import ThemedTextInput from "@/components/ui/ThemedTextInput";
import { useUIStyles } from "@/hooks/useUIStyles";
import { UserEvents } from "@/utils/events/userEvents";

type LoginFormProps = {
  forPlanSelect?: boolean;
  onSuccessSignWithGoogle: () => void;
  onSuccessSignIn: () => void;
  setShowForgotPasswordForm: (show: boolean) => void;
};
export default function RefreshForm({
  forPlanSelect,
  onSuccessSignWithGoogle,
  onSuccessSignIn,
  setShowForgotPasswordForm,
}: LoginFormProps) {
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const styles = useMemo(() => getStyles(colors), [colors]);
  const [error, setError] = useState<string | null>(null);
  const user = useSelector((s: RootState) => s.user.value);
  const dispatch = useAppDispatch();
  const ui = useUIStyles();

  const loginSchema = Yup.object().shape({
    email: Yup.string()
      .email(t("auth.enterValidEmailAddress"))
      .required(t("auth.emailIsRequired")),
    password: Yup.string()
      .matches(passwordRules, t("auth.thePasswordMustContain"))
      .required(t("auth.passwordRequired")),
  });

  const handleRefresh = async (
    values: { email: string; password: string },
    {
      setSubmitting,
      resetForm,
    }: { setSubmitting: (submitting: boolean) => void; resetForm: () => void },
  ) => {
    setLoading(true);
    setError(null);
    try {
      await dispatch(
        loginUser({
          email: values.email,
          password: values.password,
          uuid: user!.uuid,
        }),
      ).unwrap();

      setLoading(false);
      resetForm();
      setSubmitting(false);
      Toast.show({
        type: "success",
        text1: t("toast.successfullyRefreshed"),
        text2: t("toast.youHaveSuccessfullyRefreshedYourSession"),
      });
      onSuccessSignIn();
      UserEvents.emit("userLoggedIn");
    } catch (err: any) {
      const payload = err as Rejected;
      console.error("handle refresh session error", payload);
      const errorKey =
        ErrorMessages[payload.code as keyof typeof ErrorMessages];
      setError(errorKey ? t(`errors.${errorKey}`) : t("errors.undefined"));
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <GoogleSignInButton
        onSuccessSignWithGoogle={onSuccessSignWithGoogle}
        forPlanSelect={forPlanSelect}
        type="refresh"
      />
      <View style={styles.separator}>
        <View
          style={[
            styles.separatorLine,
            {
              marginRight: 8,
            },
          ]}
        ></View>
        <ThemedText style={styles.or}>{t("common.or")}</ThemedText>
        <View
          style={[
            styles.separatorLine,
            {
              marginLeft: 8,
            },
          ]}
        ></View>
      </View>
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
          {t("auth.refreshWithEmail")}
        </ThemedText>
      </View>

      <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={loginSchema}
        onSubmit={handleRefresh}
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
                value={values.email}
                onChangeText={handleChange("email")}
                onBlur={handleBlur("email")}
                keyboardType="email-address"
                autoCapitalize="none"
                containerStyle={{
                  marginBottom: 12,
                }}
              />
              <ThemedText style={ui.label}>{t("auth.password")}</ThemedText>
              <ThemedTextInput
                name="password"
                touched={touched}
                errors={errors}
                placeholder={t("auth.password")}
                value={values.password}
                onChangeText={handleChange("password")}
                onBlur={handleBlur("password")}
                secureTextEntry
                autoCapitalize="none"
                containerStyle={{
                  marginBottom: 12,
                }}
              />
            </View>
            {error && (
              <ThemedText type={"small"} style={styles.error}>
                {error}
              </ThemedText>
            )}
            <TouchableOpacity
              style={styles.forgotYourPasswordBtn}
              onPress={() => {
                setShowForgotPasswordForm(true);
              }}
            >
              <ThemedText
                type="subtitleLG"
                style={[
                  styles.text,
                  {
                    color: colors.text,
                  },
                ]}
              >
                {t("auth.forgotYourPassword")}
              </ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              style={ui.btnPrimary}
              onPress={() => handleSubmit()}
              disabled={isSubmitting}
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
                  {t("auth.refreshSession")}
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
      marginBottom: 40,
    },
    separator: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
    },
    separatorLine: {
      flex: 1,
      height: 1,
      backgroundColor: colors.border,
    },
    or: {
      textAlign: "center",
      marginVertical: 16,
      color: colors.text,
    },
    error: {
      color: colors.error,
      marginTop: -10,
      marginBottom: 20,
    },
    input: {
      backgroundColor: colors.inputBackground,
      color: colors.text,
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
    forgotYourPasswordBtn: {
      paddingHorizontal: 18,
      paddingVertical: 10,
      borderRadius: 12,
      marginBottom: 16,
    },
    text: {
      textAlign: "center",
    },
  });
