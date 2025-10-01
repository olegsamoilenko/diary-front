import React, { useMemo, useState } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import i18n from "i18next";
import { useTranslation } from "react-i18next";
import { ThemedText } from "@/components/ThemedText";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";
import { CodeStatus, ColorTheme, ErrorMessages } from "@/types";
import type { Rejected } from "@/types";
import GoogleSignInButton from "@/components/auth/GoogleSignInButton";
import { passwordRules } from "@/utils/";
import Toast from "react-native-toast-message";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "@/store";
import { registerUser } from "@/store/thunks/auth/registerUser";
import ThemedTextInput from "@/components/ui/ThemedTextInput";
import { useUIStyles } from "@/hooks/useUIStyles";
import { UserEvents } from "@/utils/events/userEvents";

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
  const lang = useState<string>(i18n.language)[0];
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const styles = useMemo(() => getStyles(colors), [colors]);
  const [error, setError] = useState<string | null>(null);
  const [timer, setTimer] = useState(0);
  const user = useSelector((s: RootState) => s.user.value);
  const dispatch = useAppDispatch();
  const ui = useUIStyles();

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
    setLoading(true);
    setError(null);
    try {
      await dispatch(
        registerUser({
          email: values.email,
          password: values.password,
          lang,
          uuid: user!.uuid,
        }),
      ).unwrap();

      setLoading(false);
      setShowEmailVerificationCodeForm(true);
      resetForm();
      setSubmitting(false);
      Toast.show({
        type: "success",
        text1: t("toast.successfullyRegistered"),
        text2: t("toast.youHaveSuccessfullyRegistered"),
      });
      UserEvents.emit("userLoggedIn");
    } catch (err: any) {
      const payload = err as Rejected;
      if (payload.code === CodeStatus.COOLDOWN) {
        const intervalId = setInterval(() => {
          setTimer((prev) => {
            if (prev <= 1) {
              clearInterval(intervalId);
              setLoading(false);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      } else {
        console.error("handle registerUser error", payload);
        const errorKey =
          ErrorMessages[payload.code as keyof typeof ErrorMessages];
        setError(errorKey ? t(`errors.${errorKey}`) : t("errors.undefined"));
        setLoading(false);
      }
    }
  };

  return (
    <View style={styles.container}>
      <GoogleSignInButton
        onSuccessSignWithGoogle={onSuccessSignWithGoogle}
        forPlanSelect={forPlanSelect}
        type="register"
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
              <ThemedText style={ui.label}>
                {t("auth.confirmPassword")}
              </ThemedText>
              <ThemedTextInput
                name="confirmPassword"
                touched={touched}
                errors={errors}
                placeholder={t("auth.confirmPassword")}
                value={values.confirmPassword}
                onChangeText={handleChange("confirmPassword")}
                onBlur={handleBlur("confirmPassword")}
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
            {timer > 0 && (
              <ThemedText
                type="small"
                style={[
                  styles.error,
                  { marginBottom: 10, textAlign: "center" },
                ]}
              >
                {t("auth.youCanSendCodeIn")} {timer} {t("common.sec")}
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
                  style={[
                    styles.text,
                    {
                      color: colors.textInPrimary,
                    },
                  ]}
                >
                  {t("auth.registration")}
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
    text: {
      textAlign: "center",
    },
  });
