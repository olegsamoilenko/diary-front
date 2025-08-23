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
import * as SecureStore from "@/utils/store/secureStore";
import { useTranslation } from "react-i18next";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";
import { ColorTheme, User } from "@/types";
import Background from "@/components/Background";
import { ThemedText } from "@/components/ThemedText";
import NemoryLogo from "@/components/ui/logo/NemoryLogo";
import { apiRequest } from "@/utils";
import Toast from "react-native-toast-message";
import i18n from "i18next";
import { LocaleConfig } from "react-native-calendars";
import { useBiometry } from "@/context/BiometryContext";

const PIN_KEY = "user_pin";
const BIOMETRY_KEY = "biometry_enabled";

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
  const [biometryEnabled, setBiometryEnabled] = useState(false);
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const styles = useMemo(() => getStyles(colors), [colors]);
  const [errorPin, setErrorPin] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [nameLoading, setNameLoading] = useState(false);
  const [pinLoading, setPinLoading] = useState(false);
  const { setBiometry } = useBiometry();

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
        const [userStr, pinStr, bioFlag] = await Promise.all([
          SecureStore.getItemAsync("user"),
          SecureStore.getItemAsync(PIN_KEY),
          SecureStore.getItemAsync(BIOMETRY_KEY),
        ]);
        if (cancelled) return;

        const u: User | null = userStr ? JSON.parse(userStr) : null;
        setUser(u);
        const bio = bioFlag === "true";
        setBiometryEnabled(bio);
        setSavedPin(pinStr ?? "");

        const lang = u?.settings?.lang;
        if (lang) {
          await i18n.changeLanguage(lang);
          LocaleConfig.defaultLocale = lang;
        }

        if (!u?.name) setStep("name");
        else if (!pinStr) setStep("setup");
        else if (bio) setStep("biometry");
        else setStep("pin");
      } catch (e) {
        console.warn("AuthGate init failed", e);
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
        const userString = await SecureStore.getItemAsync("user");
        const u: User | null = userString ? JSON.parse(userString) : null;
        if (!u?.id) throw new Error("User not found");

        const res = await apiRequest({
          url: `/users/update`,
          method: "POST",
          data: { name: values.name },
        });

        if (!res || (res.status !== 200 && res.status !== 201)) {
          console.log("No data returned from server");
          return;
        }

        const updated = res.data?.user ?? res.data;
        await SecureStore.setItemAsync("user", JSON.stringify(updated));
        setUser(updated);

        Toast.show({
          type: "success",
          text1: t("toast.successfullySaved"),
          text2: t("toast.youHaveSuccessfullySavedYourName"),
        });

        const [pinStr, bioFlag] = await Promise.all([
          SecureStore.getItemAsync(PIN_KEY),
          SecureStore.getItemAsync(BIOMETRY_KEY),
        ]);
        setSavedPin(pinStr ?? "");
        const bio = bioFlag === "true";
        setBiometryEnabled(bio);
        setStep(!pinStr ? "setup" : bio ? "biometry" : "pin");
      } catch (err: any) {
        console.log(err?.response?.data ?? err);
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
        await SecureStore.setItemAsync(PIN_KEY, values.pin);
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
    await SecureStore.setItemAsync(BIOMETRY_KEY, enable ? "true" : "false");
    await setBiometry(enable);
    setBiometryEnabled(enable);
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
    const storedPin = await SecureStore.getItemAsync(PIN_KEY);
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
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={0}
        >
          <ScrollView contentContainerStyle={styles.scrollCenter}>
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
                    <ThemedText type="subtitleLG" style={styles.label}>
                      {t("auth.name")}
                    </ThemedText>
                    <TextInput
                      value={values.name}
                      onChangeText={handleChange("name")}
                      onBlur={handleBlur("name")}
                      style={[styles.input, { minWidth: "100%" }]}
                      placeholder={t("auth.name")}
                      placeholderTextColor={colors.inputPlaceholder}
                    />
                    {touched.name && errors.name && (
                      <ThemedText type="small" style={styles.errorText}>
                        {errors.name}
                      </ThemedText>
                    )}
                    <View>
                      <TouchableOpacity
                        style={[
                          styles.btn,
                          { backgroundColor: colors.primary },
                        ]}
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
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={0}
        >
          <ScrollView contentContainerStyle={styles.scrollCenter}>
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
                  <ThemedText style={styles.label}>
                    {t("auth.setPin")}
                  </ThemedText>
                  <TextInput
                    secureTextEntry
                    value={values.pin}
                    onChangeText={handleChange("pin")}
                    onBlur={handleBlur("pin")}
                    keyboardType="number-pad"
                    maxLength={6}
                    style={[styles.input, { letterSpacing: 5 }]}
                    placeholder="******"
                    placeholderTextColor={colors.inputPlaceholder}
                  />
                  {touched.pin && errors.pin && (
                    <ThemedText type="small" style={styles.errorText}>
                      {errors.pin}
                    </ThemedText>
                  )}
                  <ThemedText style={styles.label}>
                    {t("auth.confirmPin")}
                  </ThemedText>
                  <TextInput
                    secureTextEntry
                    value={values.confirmPin}
                    onChangeText={handleChange("confirmPin")}
                    onBlur={handleBlur("confirmPin")}
                    keyboardType="number-pad"
                    maxLength={6}
                    style={[styles.input, { letterSpacing: 5 }]}
                    placeholder="******"
                    placeholderTextColor={colors.inputPlaceholder}
                  />
                  {touched.confirmPin && errors.confirmPin && (
                    <ThemedText style={styles.errorText}>
                      {errors.confirmPin}
                    </ThemedText>
                  )}
                  <View>
                    <TouchableOpacity
                      style={[styles.btn, { backgroundColor: colors.primary }]}
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
              style={[styles.btnOutline, { borderColor: colors.primary }]}
              onPress={() => handleBiometryChoice(false)}
            >
              <ThemedText style={{ color: colors.text }}>
                {t("common.no")}
              </ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.btn, { backgroundColor: colors.primary }]}
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
          <ThemedText style={styles.label}>
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
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={0}
      >
        <ScrollView contentContainerStyle={styles.scrollCenter}>
          <View style={styles.logoWrap}>
            <NemoryLogo width={120} height={150} />
          </View>
          <View style={styles.center}>
            <ThemedText style={styles.label}>{t("auth.enterPin")}</ThemedText>
            <TextInput
              secureTextEntry
              value={pin}
              onChangeText={setPin}
              keyboardType="number-pad"
              maxLength={6}
              style={[styles.input, { letterSpacing: 5 }]}
              placeholder="******"
              placeholderTextColor={colors.inputPlaceholder}
            />
            {!!errorPin && (
              <ThemedText style={styles.errorText}>{errorPin}</ThemedText>
            )}
            <TouchableOpacity
              style={[
                styles.btn,
                { backgroundColor: colors.primary, marginBottom: 10 },
              ]}
              onPress={handleCheckPin}
            >
              <ThemedText style={{ color: colors.textInPrimary }}>
                {t("auth.signIn")}
              </ThemedText>
            </TouchableOpacity>
            {biometryEnabled && (
              <TouchableOpacity
                style={[styles.btn, { backgroundColor: colors.primary }]}
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
    label: {
      fontSize: 18,
      marginBottom: 16,
      textAlign: "center",
      fontWeight: "500",
    },
    input: {
      borderRadius: 12,
      padding: 12,
      fontSize: 20,
      marginBottom: 16,
      width: 180,
      textAlign: "center",
      backgroundColor: colors.inputBackground,
      borderColor: colors.border,
      borderWidth: 1,
    },
    errorText: {
      color: colors.error,
      marginTop: -10,
      marginBottom: 20,
    },
    btn: {
      paddingHorizontal: 18,
      paddingVertical: 10,
      borderRadius: 12,
    },
    btnOutline: {
      paddingHorizontal: 18,
      paddingVertical: 10,
      borderRadius: 12,
      borderWidth: 1,
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
