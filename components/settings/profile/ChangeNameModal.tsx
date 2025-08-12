import Emoji from "@/components/diary/Emoji";
import ModalPortal from "@/components/ui/Modal";
import React, { useState } from "react";
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
import { ColorTheme, ErrorMessages } from "@/types";
import * as Yup from "yup";
import { passwordRules, UserEvents } from "@/utils";
import axios from "axios";
import { apiUrl } from "@/constants/env";
import * as SecureStore from "expo-secure-store";

type ChangeNameModalProps = {
  showChangeNameModal: boolean;
  setShowChangeNameModal: (show: boolean) => void;
  onSuccessChangeName: () => void;
};
export default function ChangeNameModal({
  showChangeNameModal,
  setShowChangeNameModal,
  onSuccessChangeName,
}: ChangeNameModalProps) {
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const styles = getStyles(colors);

  const [error, setError] = useState<string | null>(null);

  const changeNameSchema = Yup.object().shape({
    email: Yup.string()
      .email(t("auth.enterValidEmailAddress"))
      .required(t("auth.emailIsRequired")),
    password: Yup.string()
      .matches(passwordRules, t("auth.thePasswordMustContain"))
      .required(t("auth.passwordRequired")),
    newName: Yup.string().required(t("settings.profile.nameIsRequired")),
  });

  const handleChangeName = async (
    values: { email: string; password: string; newName: string },
    {
      setSubmitting,
      resetForm,
    }: { setSubmitting: (submitting: boolean) => void; resetForm: () => void },
  ) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post(`${apiUrl}/users/change`, {
        email: values.email,
        password: values.password,
        newName: values.newName,
      });

      await SecureStore.setItemAsync("user", JSON.stringify(res.data));

      UserEvents.emit("userChanged");

      onSuccessChangeName();
    } catch (err: any) {
      console.log(err?.response?.data);
      const code = err?.response?.data?.code as keyof typeof ErrorMessages;
      const errorKey = ErrorMessages[code];
      setError(t(`errors.${errorKey}`));
      setLoading(false);
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  return (
    <ModalPortal
      visible={showChangeNameModal}
      onClose={() => setShowChangeNameModal(false)}
    >
      <ThemedText
        type="subtitleXL"
        style={{
          marginBottom: 20,
        }}
      >
        {t("settings.profile.changeName")}
      </ThemedText>
      <Formik
        initialValues={{ email: "", password: "", newName: "" }}
        validationSchema={changeNameSchema}
        onSubmit={handleChangeName}
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
                {t("settings.profile.newName")}
              </ThemedText>
              <TextInput
                placeholder={t("settings.profile.newName")}
                placeholderTextColor={colors.inputPlaceholder}
                style={styles.input}
                value={values.newName}
                onChangeText={handleChange("newName")}
                onBlur={handleBlur("newName")}
              />
              {touched.newName && errors.newName && (
                <ThemedText
                  type={"small"}
                  style={{
                    color: colors.error,
                    marginTop: -10,
                    marginBottom: 20,
                  }}
                >
                  {errors.newName}
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
            <TouchableOpacity
              style={styles.btn}
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

const getStyles = (colors: ColorTheme) =>
  StyleSheet.create({
    input: {
      backgroundColor: colors.inputBackground,
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
