import ModalPortal from "@/components/ui/Modal";
import React, { useState, useMemo } from "react";
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
import { CodeStatus, ColorTheme, ErrorMessages, type Rejected } from "@/types";
import * as Yup from "yup";
import { passwordRules } from "@/utils";
import Toast from "react-native-toast-message";
import i18n from "i18next";
import { changeUserAuthData } from "@/store/thunks/auth/changeUserAuthData";
import { useAppDispatch } from "@/store";
import { verifyUserEmail } from "@/store/thunks/auth/verifyUserEmail";
import { resendEmailVerificationCodeApi } from "@/utils/api/endpoints/auth/resendEmailVerificationCodeApi";

type ChangeEmailModalProps = {
  showChangeEmailModal: boolean;
  setShowChangeEmailModal: (show: boolean) => void;
  onSuccessChangeEmail: () => void;
};
export default function ChangeEmailModal({
  showChangeEmailModal,
  setShowChangeEmailModal,
  onSuccessChangeEmail,
}: ChangeEmailModalProps) {
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const styles = useMemo(() => getStyles(colors), [colors]);

  const [error, setError] = useState<string | null>(null);
  const [showChangeEmailForm, setShowChangeEmailForm] = useState(true);
  const [code, setCode] = useState("");
  const [resendLoading, setResendLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [timer, setTimer] = useState(0);
  const [resendTimer, setResendTimer] = useState(0);
  const dispatch = useAppDispatch();
  const lang = useState<string>(i18n.language)[0];

  const changeEmailSchema = Yup.object().shape({
    email: Yup.string()
      .email(t("auth.enterValidEmailAddress"))
      .required(t("auth.emailIsRequired")),
    password: Yup.string()
      .matches(passwordRules, t("auth.thePasswordMustContain"))
      .required(t("auth.passwordRequired")),
    newEmail: Yup.string()
      .email(t("auth.enterValidEmailAddress"))
      .required(t("auth.emailIsRequired")),
  });

  const handleChangeEmail = async (
    values: { email: string; password: string; newEmail: string },
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
      newEmail: values.newEmail,
      lang: i18n.language,
    };
    try {
      const res = await dispatch(changeUserAuthData(data)).unwrap();

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
      setEmail(values.email);
      setNewEmail(values.newEmail);

      setShowChangeEmailForm(false);
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
        console.log("handle handleChangeEmail error", payload);
        const errorKey =
          ErrorMessages[payload.code as keyof typeof ErrorMessages];
        setError(errorKey ? t(`errors.${errorKey}`) : t("errors.undefined"));
        setLoading(false);
      }
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  const resendCode = async () => {
    setError(null);
    setCode("");
    setResendLoading(true);
    try {
      const res = await resendEmailVerificationCodeApi(
        newEmail,
        lang,
        "newEmail",
      );

      if (!res) throw new Error("No response from server");

      if (res.status === CodeStatus.COOLDOWN) {
        setResendTimer(res.retryAfterSec || 0);
        const intervalId = setInterval(() => {
          setResendTimer((prev) => {
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
          email,
          code,
          type: "email_change",
        }),
      ).unwrap();

      setCode("");

      Toast.show({
        type: "success",
        text1: t("toast.emailConfirmed"),
        text2: t("toast.youHaveSuccessfullyVerifiedYourEmail"),
      });

      setShowChangeEmailForm(true);
      setError(null);

      onSuccessChangeEmail();
    } catch (err: any) {
      const payload = err as Rejected;
      console.log("handle verify new email error", payload);
      const errorKey =
        ErrorMessages[payload.code as keyof typeof ErrorMessages];
      setError(errorKey ? t(`errors.${errorKey}`) : t("errors.undefined"));
      setCode("");
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalPortal
      visible={showChangeEmailModal}
      onClose={() => {
        setShowChangeEmailModal(false);
        setShowChangeEmailForm(true);
        setError(null);
      }}
    >
      <ThemedText
        type="subtitleXL"
        style={{
          marginBottom: 20,
          textAlign: "center",
        }}
      >
        {t("settings.profile.changeEmail")}
      </ThemedText>
      {showChangeEmailForm ? (
        <Formik
          initialValues={{ email: "", password: "", newEmail: "" }}
          validationSchema={changeEmailSchema}
          onSubmit={handleChangeEmail}
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
                <ThemedText style={styles.label}>
                  {t("auth.password")}
                </ThemedText>
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
                  {t("settings.profile.newEmail")}
                </ThemedText>
                <TextInput
                  placeholder={t("settings.profile.newEmail")}
                  style={styles.input}
                  value={values.newEmail}
                  onChangeText={handleChange("newEmail")}
                  onBlur={handleBlur("newEmail")}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  placeholderTextColor={colors.inputPlaceholder}
                />
                {touched.newEmail && errors.newEmail && (
                  <ThemedText
                    type={"small"}
                    style={{
                      color: colors.error,
                      marginTop: -10,
                      marginBottom: 20,
                    }}
                  >
                    {errors.newEmail}
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
                onPress={() => {
                  setError(null);
                  handleSubmit();
                }}
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
      ) : (
        <View style={styles.center}>
          <ThemedText style={styles.label}>
            {t("auth.weHaveSentYouCodeByEmail")}
          </ThemedText>
          <TextInput
            value={code}
            onChangeText={setCode}
            keyboardType="number-pad"
            maxLength={6}
            style={[
              styles.input,
              { letterSpacing: 5, width: 180, textAlign: "center" },
            ]}
            placeholder="******"
            placeholderTextColor={colors.inputPlaceholder}
          />
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
          {!resendTimer && (
            <TouchableOpacity
              style={{
                paddingHorizontal: 18,
                paddingVertical: 10,
                borderRadius: 12,
                marginBottom: 16,
              }}
              onPress={resendCode}
              disabled={resendLoading}
            >
              {resendLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <ThemedText
                  type="subtitleLG"
                  style={{
                    color: colors.text,
                    textAlign: "center",
                  }}
                >
                  {t("auth.resendCode")}
                </ThemedText>
              )}
            </TouchableOpacity>
          )}

          {resendTimer > 0 && (
            <ThemedText
              type="small"
              style={{ marginBottom: 10, textAlign: "center" }}
            >
              {t("auth.youCanResendCodeIn")} {resendTimer} {t("common.sec")}
            </ThemedText>
          )}
          <TouchableOpacity
            style={styles.btn}
            onPress={() => handleSubmit()}
            disabled={loading}
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
                {t("auth.confirm")}
              </ThemedText>
            )}
          </TouchableOpacity>
        </View>
      )}
    </ModalPortal>
  );
}

const getStyles = (colors: ColorTheme) =>
  StyleSheet.create({
    center: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
    },
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
