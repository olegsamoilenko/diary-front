import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
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

const PIN_KEY = "user_pin";
const BIOMETRY_KEY = "biometry_enabled";

export default function AuthGate({ onAuthenticated }) {
  const [step, setStep] = useState<
    "loading" | "name" | "setup" | "biometry-ask" | "biometry" | "pin"
  >("loading");
  const [pin, setPin] = useState("");
  const [savedPin, setSavedPin] = useState("");
  const [biometryEnabled, setBiometryEnabled] = useState(false);
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const styles = getStyles(colors);
  const [errorPin, setErrorPin] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [nameLoading, setNameLoading] = useState(false);
  const [pinLoading, setPinLoading] = useState(false);

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
    const fetchUser = async () => {
      const userString = await SecureStore.getItemAsync("user");
      const userObj: User | null = userString ? JSON.parse(userString) : null;
      setUser(userObj);
    };

    fetchUser();

    console.log("AuthGate mounted, fetching); user data", user);
  }, []);

  useEffect(() => {
    if (user?.name) {
      init();
    } else {
      setStep("name");
    }
  }, [user]);

  const handleSetName = async (values, { setSubmitting, resetForm }) => {
    setNameLoading(true);
    const userString = await SecureStore.getItemAsync("user");
    const user: User = userString ? JSON.parse(userString) : null;
    try {
      const res = await apiRequest({
        url: `/users/update/${user.id}`,
        method: "POST",
        data: {
          name: values.name,
        },
      });
      if (!res || res.status !== 201) {
        console.log("No data returned from server");
        return;
      }

      await SecureStore.setItemAsync("user", JSON.stringify(res.data));
      setSubmitting(false);
      resetForm();
      setNameLoading(false);
      init();
    } catch (error) {
      setNameLoading(false);
      console.error("Error setting plan:", error);
    }
  };

  const init = async () => {
    const storedPin = await SecureStore.getItemAsync(PIN_KEY);
    const bioFlag = await SecureStore.getItemAsync(BIOMETRY_KEY);
    if (!storedPin) setStep("setup");
    else if (bioFlag === "true") setStep("biometry");
    else setStep("pin");
    setSavedPin(storedPin || "");
    setBiometryEnabled(bioFlag === "true");
  };

  const handleSetPin = async (values, { setSubmitting, resetForm }) => {
    setPinLoading(true);
    await SecureStore.setItemAsync(PIN_KEY, values.pin);
    setSavedPin(pin);
    setSubmitting(false);
    resetForm();
    setPinLoading(false);
    setStep("biometry-ask");
  };

  const handleBiometryChoice = useCallback(async (enable: boolean) => {
    await SecureStore.setItemAsync(BIOMETRY_KEY, enable ? "true" : "false");
    setBiometryEnabled(enable);
    setStep(enable ? "biometry" : "pin");
  }, []);

  useEffect(() => {
    if (step === "biometry") {
      (async () => {
        const res = await LocalAuthentication.authenticateAsync({
          promptMessage: t("auth.useBiometricsToLogIn"),
          fallbackLabel: t("auth.enterPin"),
        });
        if (res.success) {
          onAuthenticated();
        } else {
          setStep("pin");
        }
      })();
    }
  }, [step, onAuthenticated]);

  const handleCheckPin = useCallback(async () => {
    const storedPin = await SecureStore.getItemAsync(PIN_KEY);
    console.log("Checking PIN:", pin, "Saved PIN:", storedPin);
    if (pin === storedPin) {
      onAuthenticated();
    } else {
      setErrorPin(t("auth.pinIsIncorrect"));
      setPin("");
    }
  }, [pin, savedPin, onAuthenticated]);

  if (step === "loading")
    return (
      <Background background={colors.backgroundImage}>
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            marginTop: 50,
            marginBottom: 20,
          }}
        >
          <NemoryLogo width={120} height={150} />
        </View>
        <View style={styles.center}>
          <ThemedText>{t("common.loading")}</ThemedText>
        </View>
      </Background>
    );

  if (step === "name")
    return (
      <Background background={colors.backgroundImage}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
        >
          <ScrollView
            contentContainerStyle={{
              flexGrow: 1,
              padding: 20,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                marginTop: 50,
                marginBottom: 20,
              }}
            >
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
                    <ThemedText style={styles.label}>
                      {t("auth.name")}
                    </ThemedText>
                    <TextInput
                      value={values.name}
                      onChangeText={handleChange("name")}
                      onBlur={handleBlur("name")}
                      style={[styles.input, { minWidth: "100%" }]}
                      placeholder={t("auth.name")}
                    />
                    {touched.name && errors.name && (
                      <ThemedText
                        type={"small"}
                        style={{
                          color: colors.error,
                          marginTop: -10,
                          marginBottom: 20,
                        }}
                      >
                        {errors.name}
                      </ThemedText>
                    )}
                    <View>
                      <TouchableOpacity
                        style={{
                          paddingHorizontal: 18,
                          paddingVertical: 10,
                          backgroundColor: colors.primary,
                          borderRadius: 12,
                        }}
                        onPress={() => handleSubmit()}
                        disabled={isSubmitting}
                      >
                        {nameLoading ? (
                          <ActivityIndicator color="#fff" />
                        ) : (
                          <ThemedText
                            style={{
                              color: colors.textInPrimary,
                            }}
                          >
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

  if (step === "setup")
    return (
      <Background background={colors.backgroundImage}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
        >
          <ScrollView
            contentContainerStyle={{
              flexGrow: 1,
              padding: 20,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                marginTop: 50,
                marginBottom: 20,
              }}
            >
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
                  />
                  {touched.pin && errors.pin && (
                    <ThemedText
                      type={"small"}
                      style={{
                        color: colors.error,
                        marginTop: -10,
                        marginBottom: 20,
                      }}
                    >
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
                  />
                  {touched.confirmPin && errors.confirmPin && (
                    <ThemedText
                      style={{
                        color: colors.error,
                        marginTop: -10,
                        marginBottom: 20,
                      }}
                    >
                      {errors.confirmPin}
                    </ThemedText>
                  )}
                  <View>
                    <TouchableOpacity
                      style={{
                        paddingHorizontal: 18,
                        paddingVertical: 10,
                        backgroundColor: colors.primary,
                        borderRadius: 12,
                      }}
                      onPress={() => handleSubmit()}
                      disabled={isSubmitting}
                    >
                      {pinLoading ? (
                        <ActivityIndicator color="#fff" />
                      ) : (
                        <ThemedText
                          style={{
                            color: colors.textInPrimary,
                          }}
                        >
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

  if (step === "biometry-ask")
    return (
      <Background background={colors.backgroundImage}>
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            marginTop: 50,
            marginBottom: 20,
          }}
        >
          <NemoryLogo width={120} height={150} />
        </View>
        <View style={styles.center}>
          <ThemedText
            type={"titleLG"}
            style={{
              textAlign: "center",
            }}
          >
            {t("auth.enableFingerprint")}
          </ThemedText>
          <ThemedText
            type={"small"}
            style={{
              textAlign: "center",
            }}
          >
            {t("auth.youCanChangeThis")}
          </ThemedText>
          <View style={{ flexDirection: "row", gap: 10, marginTop: 16 }}>
            <TouchableOpacity
              style={{
                paddingHorizontal: 18,
                paddingVertical: 10,
                borderWidth: 1,
                borderColor: colors.primary,
                borderRadius: 12,
              }}
              onPress={() => handleBiometryChoice(false)}
            >
              <ThemedText
                style={{
                  color: colors.text,
                }}
              >
                {t("common.no")}
              </ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                paddingHorizontal: 18,
                paddingVertical: 10,
                backgroundColor: colors.primary,
                borderRadius: 12,
              }}
              onPress={() => handleBiometryChoice(true)}
            >
              <ThemedText
                style={{
                  color: colors.textInPrimary,
                }}
              >
                {t("common.yes")}
              </ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </Background>
    );

  if (step === "biometry")
    return (
      <Background background={colors.backgroundImage}>
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            marginTop: 50,
            marginBottom: 20,
          }}
        >
          <NemoryLogo width={120} height={150} />
        </View>
        <View style={styles.center}>
          <ThemedText style={styles.label}>
            {t("auth.waitingForBiometrics")}
          </ThemedText>
        </View>
      </Background>
    );

  return (
    <Background background={colors.backgroundImage}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            padding: 20,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              marginTop: 50,
              marginBottom: 20,
            }}
          >
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
            />
            {errorPin && (
              <ThemedText
                style={{
                  color: colors.error,
                  marginTop: -10,
                  marginBottom: 20,
                }}
              >
                {errorPin}
              </ThemedText>
            )}
            <TouchableOpacity
              style={{
                paddingHorizontal: 18,
                paddingVertical: 10,
                backgroundColor: colors.primary,
                borderRadius: 12,
                marginBottom: 10,
              }}
              onPress={handleCheckPin}
            >
              <ThemedText
                style={{
                  color: colors.textInPrimary,
                }}
              >
                {t("auth.signIn")}
              </ThemedText>
            </TouchableOpacity>
            {biometryEnabled && (
              <TouchableOpacity
                style={{
                  paddingHorizontal: 18,
                  paddingVertical: 10,
                  backgroundColor: colors.primary,
                  borderRadius: 12,
                }}
                onPress={() => setStep("biometry")}
              >
                <ThemedText
                  style={{
                    color: colors.textInPrimary,
                  }}
                >
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
    },
  });
