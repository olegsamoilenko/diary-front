import BackArrow from "@/components/ui/BackArrow";
import { ThemedText } from "@/components/ThemedText";
import React, { forwardRef, useEffect, useMemo, useState } from "react";
import SideSheet, { SideSheetRef } from "@/components/SideSheet";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";
import { useTranslation } from "react-i18next";
import { CodeStatus, ColorTheme, EPlatform, SupportCategory } from "@/types";
import Background from "@/components/Background";
import { Formik } from "formik";
import * as Yup from "yup";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import CustomSelect from "@/components/ui/Select";
import { supportOptions } from "@/constants/support";
import TextArea from "@/components/ui/TextArea";
import { useUIStyles } from "@/hooks/useUIStyles";
import ThemedTextInput from "@/components/ui/ThemedTextInput";
import { sendMessageApi } from "@/utils/api/endpoints/support/sendMessageApi";
import Toast from "react-native-toast-message";

const Support = forwardRef<SideSheetRef, {}>((props, ref) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const styles = useMemo(() => getStyles(colors), [colors]);
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const user = useSelector((s: RootState) => s.user.value);
  const ui = useUIStyles();

  type SupportFormValues = {
    email: string;
    category: SupportCategory | null;
    title: string;
    text: string;
  };

  const supportSchema = Yup.object().shape({
    email: Yup.string()
      .email(t("auth.enterValidEmailAddress"))
      .required(t("auth.emailIsRequired")),
    category: Yup.mixed<SupportCategory>()
      .oneOf(Object.values(SupportCategory) as SupportCategory[])
      .required(t("auth.categoryRequired")),
    title: Yup.string().required(t("auth.titleRequired")),
    text: Yup.string().required(t("auth.textRequired")),
  });

  const handleSupport = async (
    values: SupportFormValues,
    {
      setSubmitting,
      resetForm,
    }: { setSubmitting: (submitting: boolean) => void; resetForm: () => void },
  ) => {
    setLoading(true);
    try {
      const res = await sendMessageApi(
        values.email,
        values.category!,
        values.title,
        values.text,
      );

      if (res && res.status === CodeStatus.OK) {
        Toast.show({
          type: "success",
          text1: t("settings.support.messageSent"),
          text2: t("settings.support.thankYouForReachingOut"),
        });
        setSubmitting(false);
      }
    } catch (error: any) {
      console.error("Support request failed:", error);
      console.error("Support request failed response:", error.response);
    } finally {
      setLoading(false);
      resetForm();
    }
  };

  const onSupportClose = () => {};

  return (
    <SideSheet ref={ref}>
      <Background background={colors.backgroundImage} paddingTop={10}>
        <View style={styles.container}>
          <BackArrow onClose={onSupportClose} ref={ref} />
          <ThemedText
            type={"titleLG"}
            style={{
              marginBottom: 20,
            }}
          >
            {t("settings.support.title")}
          </ThemedText>
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === EPlatform.IOS ? "padding" : "height"}
            keyboardVerticalOffset={0}
          >
            <ScrollView showsVerticalScrollIndicator={false}>
              <Formik
                initialValues={{
                  email: "",
                  category: null,
                  text: "",
                  title: "",
                }}
                validationSchema={supportSchema}
                onSubmit={handleSupport}
              >
                {({
                  handleChange,
                  handleBlur,
                  handleSubmit,
                  values,
                  errors,
                  touched,
                  isSubmitting,
                  setFieldValue,
                }) => (
                  <>
                    <ThemedText style={ui.label}>{t("auth.email")}</ThemedText>
                    <ThemedTextInput
                      name="email"
                      touched={touched}
                      errors={errors}
                      placeholder={t("auth.email")}
                      containerStyle={{ marginBottom: 12 }}
                      value={values.email}
                      onChangeText={handleChange("email")}
                      onBlur={handleBlur("email")}
                      keyboardType="email-address"
                      autoCapitalize="none"
                    />

                    <CustomSelect
                      style={{
                        marginBottom: 20,
                      }}
                      error={
                        touched.category && errors.category
                          ? errors.category
                          : ""
                      }
                      label={t("settings.support.selectCategory")}
                      placeholder={t("common.select") + "..."}
                      value={values.category}
                      onChange={(val) => setFieldValue("category", val)}
                      options={supportOptions}
                      searchable={false}
                      clearable
                    />

                    <ThemedText style={ui.label}>
                      {t("common.title")}
                    </ThemedText>
                    <ThemedTextInput
                      name="title"
                      touched={touched}
                      errors={errors}
                      placeholder={t("common.title")}
                      containerStyle={{ marginBottom: 12 }}
                      value={values.title}
                      onChangeText={handleChange("title")}
                      onBlur={handleBlur("title")}
                    />

                    <TextArea
                      containerStyle={{
                        marginBottom: 20,
                      }}
                      label={t("settings.support.describeYourRequest")}
                      placeholder={t("settings.support.addDetails")}
                      value={values.text}
                      onChangeText={handleChange("text")}
                      minLines={5}
                      error={touched.text && errors.text ? errors.text : ""}
                    />

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
                          {t("common.send")}
                        </ThemedText>
                      )}
                    </TouchableOpacity>
                  </>
                )}
              </Formik>
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
      </Background>
    </SideSheet>
  );
});

Support.displayName = "Support";

export default Support;

const getStyles = (colors: ColorTheme) =>
  StyleSheet.create({
    container: {
      paddingHorizontal: 20,
      flex: 1,
      marginBottom: -6,
    },
    btn: {
      paddingHorizontal: 18,
      paddingVertical: 10,
      backgroundColor: colors.primary,
      borderRadius: 12,
      textAlign: "center",
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
