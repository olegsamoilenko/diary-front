import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import * as SecureStore from "@/utils/store/secureStore";
import GoogleSignInButton from "@/components/auth/GoogleSignInButton";
import { ThemedText } from "@/components/ThemedText";
import type { ColorTheme, User } from "@/types";
import { ErrorMessages } from "@/types";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";
import { useTranslation } from "react-i18next";
import { Formik } from "formik";
import * as Yup from "yup";
import { passwordRules } from "@/utils/";
import Toast from "react-native-toast-message";
import { apiUrl } from "@/constants/env";
import { UserEvents } from "@/utils/events/userEvents";

type LoginFormProps = {
  forPlanSelect?: boolean;
  onSuccessSignWithGoogle: () => void;
  onSuccessSignIn: () => void;
  setShowForgotPasswordForm: (show: boolean) => void;
};
export default function LoginForm({
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
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const userString = await SecureStore.getItemAsync("user");
      const userObj = userString ? JSON.parse(userString) : null;
      setUser(userObj);
    };
    getUser();
  }, []);

  const loginSchema = Yup.object().shape({
    email: Yup.string()
      .email(t("auth.enterValidEmailAddress"))
      .required(t("auth.emailIsRequired")),
    password: Yup.string()
      .matches(passwordRules, t("auth.thePasswordMustContain"))
      .required(t("auth.passwordRequired")),
  });

  const handleLogin = async (
    values: { email: string; password: string },
    {
      setSubmitting,
      resetForm,
    }: { setSubmitting: (submitting: boolean) => void; resetForm: () => void },
  ) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post(`${apiUrl}/auth/login`, {
        email: values.email,
        password: values.password,
        uuid: user?.uuid,
      });
      const { accessToken, user: userRes } = res.data;

      await SecureStore.setItemAsync("token", accessToken);
      await SecureStore.setItemAsync("user", JSON.stringify(userRes));

      setLoading(false);
      resetForm();
      setSubmitting(false);
      Toast.show({
        type: "success",
        text1: t("toast.successfullyLogged"),
        text2: t("toast.youHaveSuccessfullyLoggedIn"),
      });
      onSuccessSignIn();
      UserEvents.emit("userLoggedIn", userRes);
    } catch (err: any) {
      console.log("err", err);
      console.log("err response", err?.response);
      console.log("err response data", err?.response?.data);
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
          {t("auth.signInWithEmail")}
        </ThemedText>
      </View>

      <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={loginSchema}
        onSubmit={handleLogin}
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
                  {t("auth.login")}
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
