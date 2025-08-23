import React, { useMemo, useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import i18n from "i18next";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { ThemedText } from "@/components/ThemedText";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";
import { ColorTheme, ErrorMessages, User } from "@/types";
import GoogleSignInButton from "@/components/auth/GoogleSignInButton";
import * as SecureStore from "@/utils/store/secureStore";
import { passwordRules } from "@/utils/";
import Toast from "react-native-toast-message";
import { apiUrl } from "@/constants/env";

interface RegisterFormProps {
  forPlanSelect: boolean;
  onSuccessSignWithGoogle: () => void;
  setShowEmailVerificationCodeForm: (show: boolean) => void;
}

export default function RegisterForm({
  forPlanSelect,
  onSuccessSignWithGoogle,
  setShowEmailVerificationCodeForm,
}: RegisterFormProps) {
  const [loading, setLoading] = useState(false);
  const lang = useState<string | null>(i18n.language)[0];
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const styles = useMemo(() => getStyles(colors), [colors]);
  const [error, setError] = useState<string | null>(null);

  const registerSchema = Yup.object().shape({
    email: Yup.string()
      .email(t("auth.enterValidEmailAddress"))
      .required(t("auth.emailIsRequired")),
    password: Yup.string()
      .matches(passwordRules, t("auth.thePasswordMustContain"))
      .required(t("auth.passwordRequired")),
    confirmPassword: Yup.string()
      .required(t("auth.confirmYourPassword"))
      .oneOf([Yup.ref("password")], t("auth.passwordsDoNotMatch")),
  });

  const handleRegister = async (
    values: { email: string; password: string },
    {
      setSubmitting,
      resetForm,
    }: { setSubmitting: (submitting: boolean) => void; resetForm: () => void },
  ) => {
    const userString = await SecureStore.getItemAsync("user");
    const user: User = userString ? JSON.parse(userString) : null;
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post(`${apiUrl}/auth/registration`, {
        email: values.email,
        password: values.password,
        lang,
        uuid: user.uuid,
      });
      setLoading(false);
      setShowEmailVerificationCodeForm(true);
      resetForm();
      setSubmitting(false);
      await SecureStore.setItemAsync("user", JSON.stringify(res.data.user));
      Toast.show({
        type: "success",
        text1: t("toast.successfullyRegistered"),
        text2: t("toast.youHaveSuccessfullyRegistered"),
      });
    } catch (err: any) {
      console.log(err?.response?.data);
      const code = err?.response?.data?.code as keyof typeof ErrorMessages;
      const errorKey = ErrorMessages[code];
      setError(t(`errors.${errorKey}`));
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <GoogleSignInButton
        onSuccessSignWithGoogle={onSuccessSignWithGoogle}
        forPlanSelect={forPlanSelect}
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
          {t("auth.signUpWithEmail")}
        </ThemedText>
      </View>

      <Formik
        initialValues={{ email: "", password: "", confirmPassword: "" }}
        validationSchema={registerSchema}
        onSubmit={handleRegister}
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
            <TouchableOpacity
              style={styles.btn}
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
                  {t("auth.register")}
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
      marginBottom: 30,
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
    label: {
      marginBottom: 16,
      textAlign: "left",
    },
    input: {
      backgroundColor: colors.inputBackground,
      padding: 14,
      borderRadius: 8,
      marginBottom: 12,
      fontSize: 16,
      minWidth: "100%",
    },
    btn: {
      paddingHorizontal: 18,
      paddingVertical: 10,
      backgroundColor: colors.primary,
      borderRadius: 12,
      textAlign: "center",
    },
    text: {
      textAlign: "center",
    },
  });
