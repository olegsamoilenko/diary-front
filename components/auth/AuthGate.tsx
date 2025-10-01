import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import * as LocalAuthentication from "expo-local-authentication";
import { useTranslation } from "react-i18next";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";
import { ColorTheme, EPlatform, User } from "@/types";
import Background from "@/components/Background";
import { ThemedText } from "@/components/ThemedText";
import NemoryLogo from "@/components/ui/logo/NemoryLogo";
import Toast from "react-native-toast-message";
import i18n from "i18next";
import { LocaleConfig } from "react-native-calendars";
import { useBiometry } from "@/context/BiometryContext";
import { RootState, useAppDispatch } from "@/store";
import { useSelector } from "react-redux";
import { loadPin, savePin } from "@/utils/store/storage";
import { updateUser } from "@/store/thunks/auth/updateUser";
import { logStoredUserData } from "@/utils";
import ThemedTextInput from "@/components/ui/ThemedTextInput";
import { useUIStyles } from "@/hooks/useUIStyles";

export default function AuthGate({
  onAuthenticated,
}: {
  onAuthenticated: () => void;
}) {
  const [step, setStep] = useState<
    "loading" | "name" | "setup" | "biometry-ask" | "biometry" | "pin"
  >("loading");
  const [pin, setPin] = useState("");
  const [savedPin, setSavedPin] = useState("");
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const styles = useMemo(() => getStyles(colors), [colors]);
  const [errorPin, setErrorPin] = useState("");
  const dispatch = useAppDispatch();
  const user = useSelector((s: RootState) => s.user.value);
  const settings = useSelector((s: RootState) => s.settings.value);

  const [nameLoading, setNameLoading] = useState(false);
  const [pinLoading, setPinLoading] = useState(false);
  const { setBiometry, biometryEnabled } = useBiometry();
  const ui = useUIStyles();

  const PinSchema = Yup.object().shape({
    pin: Yup.string()
      .required(t("auth.enterPin"))
      .min(4, t("auth.pinMustContainAtLeast4Digits"))
      .max(6, t("auth.pinMustContainAMaximumOf6Digits"))
      .matches(/^\d+$/, t("auth.pinMustContainOnlyDigits")),
    confirmPin: Yup.string()
      .required(t("auth.confirmThePinCode"))
      .oneOf([Yup.ref("pin")], t("auth.pinCodesDoNotMatch")),
  });

  const NameSchema = Yup.object().shape({
    name: Yup.string().required(t("auth.enterName")),
  });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        if (cancelled) return;

        const [pinStr] = await Promise.all([loadPin()]);

        setSavedPin(pinStr ?? "");

        const lang = settings?.lang;
        if (lang) {
          await i18n.changeLanguage(lang);
          LocaleConfig.defaultLocale = lang;
        }

        if (!user?.name) setStep("name");
        else if (!pinStr) setStep("setup");
        else if (biometryEnabled) setStep("biometry");
        else setStep("pin");
      } catch (err: any) {
        console.warn("AuthGate init failed response", err.response);
        setStep("name");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleSetName = useCallback(
    async (
      values: { name: string },
      {
        setSubmitting,
        resetForm,
      }: { setSubmitting: (b: boolean) => void; resetForm: () => void },
    ) => {
      setNameLoading(true);
      try {
        await dispatch(
          updateUser({
            name: values.name,
          }),
        ).unwrap();

        Toast.show({
          type: "success",
          text1: t("toast.successfullySaved"),
          text2: t("toast.youHaveSuccessfullySavedYourName"),
        });
        setStep(!savedPin ? "setup" : biometryEnabled ? "biometry" : "pin");
      } catch (err: any) {
        console.error("Set Name error response", err);
      } finally {
        setNameLoading(false);
        setSubmitting(false);
        resetForm();
      }
    },
    [t],
  );

  const handleSetPin = useCallback(
    async (
      values: { pin: string },
      {
        setSubmitting,
        resetForm,
      }: { setSubmitting: (b: boolean) => void; resetForm: () => void },
    ) => {
      setPinLoading(true);
      try {
        await savePin(values.pin);
        setSavedPin(values.pin);
        setStep("biometry-ask");
      } finally {
        setSubmitting(false);
        resetForm();
        setPinLoading(false);
      }
    },
    [],
  );

  const handleBiometryChoice = useCallback(async (enable: boolean) => {
    await setBiometry(enable);
    setStep(enable ? "biometry" : "pin");
  }, []);

  useEffect(() => {
    if (step !== "biometry") return;
    let cancelled = false;
    (async () => {
      try {
        const hasHw = await LocalAuthentication.hasHardwareAsync();
        const enrolled = hasHw && (await LocalAuthentication.isEnrolledAsync());
        if (!hasHw || !enrolled) {
          setStep("pin");
          return;
        }
        const res = await LocalAuthentication.authenticateAsync({
          promptMessage: t("auth.useBiometricsToLogIn"),
          fallbackLabel: t("auth.enterPin"),
          disableDeviceFallback: false,
        });
        if (!cancelled) {
          if (res.success) onAuthenticated();
          else setStep("pin");
        }
      } catch {
        if (!cancelled) setStep("pin");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [step, t, onAuthenticated]);

  const handleCheckPin = useCallback(async () => {
    const storedPin = await loadPin();
    if (pin && storedPin && pin === storedPin) {
      onAuthenticated();
    } else {
      setErrorPin(t("auth.pinIsIncorrect"));
      setPin("");
    }
  }, [pin, t, onAuthenticated]);

  if (step === "loading") {
    return (
      <Background background={colors.backgroundImage}>
        <View style={styles.logoWrap}>
          <NemoryLogo width={120} height={150} />
        </View>
        <View style={styles.center}>
          <ThemedText>{t("common.loading")}</ThemedText>
        </View>
      </Background>
    );
  }

  if (step === "name") {
    return (
      <Background background={colors.backgroundImage}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === EPlatform.IOS ? "padding" : "height"}
          keyboardVerticalOffset={0}
        >
          <ScrollView
            contentContainerStyle={styles.scrollCenter}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.logoWrap}>
              <NemoryLogo width={120} height={150} />
            </View>
            <View style={styles.center}>
              <Formik
                initialValues={{ name: "" }}
                validationSchema={NameSchema}
                onSubmit={handleSetName}
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
                  <View style={styles.center}>
                    <ThemedText type="subtitleLG" style={ui.label}>
                      {t("auth.name")}
                    </ThemedText>
                    <ThemedTextInput
                      name="name"
                      touched={touched}
                      errors={errors}
                      value={values.name}
                      inputStyle={{
                        textAlign: "center",
                      }}
                      containerStyle={{
                        marginBottom: 16,
                      }}
                      errorStyle={{
                        textAlign: "center",
                      }}
                      onChangeText={handleChange("name")}
                      onBlur={handleBlur("name")}
                      placeholder={t("auth.name")}
                    />
                    <View>
                      <TouchableOpacity
                        style={[ui.btnPrimary]}
                        onPress={() => handleSubmit()}
                        disabled={isSubmitting}
                      >
                        {nameLoading ? (
                          <ActivityIndicator color="#fff" />
                        ) : (
                          <ThemedText style={{ color: colors.textInPrimary }}>
                            {t("common.save")}
                          </ThemedText>
                        )}
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </Formik>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </Background>
    );
  }

  if (step === "setup") {
    return (
      <Background background={colors.backgroundImage}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === EPlatform.IOS ? "padding" : "height"}
          keyboardVerticalOffset={0}
        >
          <ScrollView
            contentContainerStyle={styles.scrollCenter}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.logoWrap}>
              <NemoryLogo width={120} height={150} />
            </View>
            <Formik
              initialValues={{ pin: "", confirmPin: "" }}
              validationSchema={PinSchema}
              onSubmit={handleSetPin}
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
                <View style={styles.center}>
                  <ThemedText style={ui.label}>{t("auth.setPin")}</ThemedText>
                  <ThemedTextInput
                    name="pin"
                    touched={touched}
                    errors={errors}
                    secureTextEntry
                    value={values.pin}
                    onChangeText={handleChange("pin")}
                    onBlur={handleBlur("pin")}
                    keyboardType="number-pad"
                    maxLength={6}
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
                    placeholder="******"
                  />
                  <ThemedText style={ui.label}>
                    {t("auth.confirmPin")}
                  </ThemedText>
                  <ThemedTextInput
                    name="confirmPin"
                    touched={touched}
                    errors={errors}
                    secureTextEntry
                    value={values.confirmPin}
                    onChangeText={handleChange("confirmPin")}
                    onBlur={handleBlur("confirmPin")}
                    keyboardType="number-pad"
                    maxLength={6}
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
                    placeholder="******"
                  />
                  <View>
                    <TouchableOpacity
                      style={[ui.btnPrimary]}
                      onPress={() => handleSubmit()}
                      disabled={isSubmitting}
                    >
                      {pinLoading ? (
                        <ActivityIndicator color="#fff" />
                      ) : (
                        <ThemedText style={{ color: colors.textInPrimary }}>
                          {t("common.save")}
                        </ThemedText>
                      )}
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </Formik>
          </ScrollView>
        </KeyboardAvoidingView>
      </Background>
    );
  }

  if (step === "biometry-ask") {
    return (
      <Background background={colors.backgroundImage}>
        <View style={styles.logoWrap}>
          <NemoryLogo width={120} height={150} />
        </View>
        <View style={styles.center}>
          <ThemedText type="titleLG" style={{ textAlign: "center" }}>
            {t("auth.enableFingerprint")}
          </ThemedText>
          <ThemedText type="small" style={{ textAlign: "center" }}>
            {t("auth.youCanChangeThis")}
          </ThemedText>
          <View style={styles.row}>
            <TouchableOpacity
              style={[ui.btnOutline]}
              onPress={() => handleBiometryChoice(false)}
            >
              <ThemedText style={{ color: colors.text }}>
                {t("common.no")}
              </ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[ui.btnPrimary]}
              onPress={() => handleBiometryChoice(true)}
            >
              <ThemedText style={{ color: colors.textInPrimary }}>
                {t("common.yes")}
              </ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </Background>
    );
  }

  if (step === "biometry") {
    return (
      <Background background={colors.backgroundImage}>
        <View style={styles.logoWrap}>
          <NemoryLogo width={120} height={150} />
        </View>
        <View style={styles.center}>
          <ThemedText style={ui.label}>
            {t("auth.waitingForBiometrics")}
          </ThemedText>
        </View>
      </Background>
    );
  }

  return (
    <Background background={colors.backgroundImage}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === EPlatform.IOS ? "padding" : "height"}
        keyboardVerticalOffset={0}
      >
        <ScrollView
          contentContainerStyle={styles.scrollCenter}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.logoWrap}>
            <NemoryLogo width={120} height={150} />
          </View>
          <View style={styles.center}>
            <ThemedText style={ui.label}>{t("auth.enterPin")}</ThemedText>
            <ThemedTextInput
              name="pin"
              errorMessage={errorPin}
              secureTextEntry
              value={pin}
              onChangeText={setPin}
              keyboardType="number-pad"
              maxLength={6}
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
              placeholder="******"
            />
            <TouchableOpacity
              style={[ui.btnPrimary, { marginBottom: 10 }]}
              onPress={handleCheckPin}
            >
              <ThemedText style={{ color: colors.textInPrimary }}>
                {t("auth.signIn")}
              </ThemedText>
            </TouchableOpacity>
            {biometryEnabled && (
              <TouchableOpacity
                style={[ui.btnPrimary]}
                onPress={() => setStep("biometry")}
              >
                <ThemedText style={{ color: colors.textInPrimary }}>
                  {t("auth.tryBiometricsAgain")}
                </ThemedText>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Background>
  );
}

const getStyles = (colors: ColorTheme) =>
  StyleSheet.create({
    scrollCenter: {
      flexGrow: 1,
      padding: 20,
      alignItems: "center",
      justifyContent: "center",
    },
    center: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      padding: 20,
    },
    logoWrap: {
      alignItems: "center",
      justifyContent: "center",
      marginTop: 50,
      marginBottom: 20,
    },
    row: {
      flexDirection: "row",
      gap: 10,
      marginTop: 16,
    },
  });
