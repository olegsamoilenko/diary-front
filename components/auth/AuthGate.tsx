import React, { useEffect, useState, useCallback } from "react";
import { View, Text, TextInput, Button, Alert, StyleSheet } from "react-native";
import * as LocalAuthentication from "expo-local-authentication";
import * as SecureStore from "@/utils/store/secureStore";

const PIN_KEY = "user_pin";
const BIOMETRY_KEY = "biometry_enabled";

export default function AuthGate({ onAuthenticated }) {
  const [step, setStep] = useState<
    "loading" | "setup" | "biometry-ask" | "biometry" | "pin"
  >("loading");
  const [pin, setPin] = useState("");
  const [savedPin, setSavedPin] = useState("");
  const [biometryEnabled, setBiometryEnabled] = useState(false);

  useEffect(() => {
    const init = async () => {
      const storedPin = await SecureStore.getItemAsync(PIN_KEY);
      const bioFlag = await SecureStore.getItemAsync(BIOMETRY_KEY);
      if (!storedPin) setStep("setup");
      else if (bioFlag === "true") setStep("biometry");
      else setStep("pin");
      setSavedPin(storedPin || "");
      setBiometryEnabled(bioFlag === "true");
    };
    init();
  }, []);

  const handleSetPin = useCallback(async () => {
    if (pin.length < 4) {
      Alert.alert("PIN має містити мінімум 4 цифри");
      return;
    }
    await SecureStore.setItemAsync(PIN_KEY, pin);
    setSavedPin(pin);
    setPin("");
    setStep("biometry-ask");
  }, [pin]);

  const handleBiometryChoice = useCallback(async (enable: boolean) => {
    await SecureStore.setItemAsync(BIOMETRY_KEY, enable ? "true" : "false");
    setBiometryEnabled(enable);
    setStep(enable ? "biometry" : "pin");
  }, []);

  useEffect(() => {
    if (step === "biometry") {
      (async () => {
        const res = await LocalAuthentication.authenticateAsync({
          promptMessage: "Використайте біометрію для входу",
          fallbackLabel: "Введіть PIN",
        });
        if (res.success) {
          onAuthenticated();
        } else {
          setStep("pin");
        }
      })();
    }
  }, [step, onAuthenticated]);

  const handleCheckPin = useCallback(() => {
    if (pin === savedPin) {
      onAuthenticated();
    } else {
      Alert.alert("Невірний PIN");
      setPin("");
    }
  }, [pin, savedPin, onAuthenticated]);

  if (step === "loading")
    return (
      <View style={styles.center}>
        <Text>Завантаження...</Text>
      </View>
    );

  if (step === "setup")
    return (
      <View style={styles.center}>
        <Text style={styles.label}>Встановіть PIN-код (мін. 4 цифри):</Text>
        <TextInput
          secureTextEntry
          value={pin}
          onChangeText={setPin}
          keyboardType="number-pad"
          maxLength={6}
          style={styles.input}
        />
        <Button title="Зберегти" onPress={handleSetPin} />
      </View>
    );

  if (step === "biometry-ask")
    return (
      <View style={styles.center}>
        <Text style={styles.label}>Увімкнути вхід по відбитку/FaceID?</Text>
        <View style={{ flexDirection: "row", gap: 10, marginTop: 16 }}>
          <Button title="Так" onPress={() => handleBiometryChoice(true)} />
          <Button title="Ні" onPress={() => handleBiometryChoice(false)} />
        </View>
      </View>
    );

  if (step === "biometry")
    return (
      <View style={styles.center}>
        <Text style={styles.label}>Очікуємо біометрію...</Text>
      </View>
    );

  return (
    <View style={styles.center}>
      <Text style={styles.label}>Введіть PIN:</Text>
      <TextInput
        secureTextEntry
        value={pin}
        onChangeText={setPin}
        keyboardType="number-pad"
        maxLength={6}
        style={styles.input}
      />
      <Button title="Увійти" onPress={handleCheckPin} />
      {biometryEnabled && (
        <Button
          title="Спробувати знову біометрію"
          onPress={() => setStep("biometry")}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
    backgroundColor: "#fff",
  },
  label: {
    fontSize: 18,
    marginBottom: 16,
    textAlign: "center",
    fontWeight: "500",
  },
  input: {
    borderWidth: 1,
    borderColor: "#aaa",
    borderRadius: 12,
    padding: 12,
    fontSize: 20,
    marginBottom: 16,
    width: 180,
    textAlign: "center",
    letterSpacing: 12,
    backgroundColor: "#f7f7f7",
  },
});
