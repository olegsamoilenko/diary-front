import Emoji from "@/components/diary/Emoji";
import ModalPortal from "@/components/ui/Modal";
import React, { useMemo, useState } from "react";
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
import { useAppDispatch } from "@/store";
import { updateUser } from "@/store/thunks/auth/updateUser";
import Toast from "react-native-toast-message";
import ThemedTextInput from "@/components/ui/ThemedTextInput";
import { useUIStyles } from "@/hooks/useUIStyles";

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
  const styles = useMemo(() => getStyles(colors), [colors]);

  const [error, setError] = useState<string | null>(null);
  const dispatch = useAppDispatch();
  const ui = useUIStyles();

  const changeNameSchema = Yup.object().shape({
    newName: Yup.string().required(t("settings.profile.nameIsRequired")),
  });

  const handleChangeName = async (
    values: { newName: string },
    {
      setSubmitting,
      resetForm,
    }: { setSubmitting: (submitting: boolean) => void; resetForm: () => void },
  ) => {
    setLoading(true);
    setError(null);
    try {
      await dispatch(
        updateUser({
          name: values.newName,
        }),
      ).unwrap();

      Toast.show({
        type: "success",
        text1: t("toast.successfullyUpdated"),
        text2: t("toast.youHaveSuccessfullyUpdateYourName"),
      });

      resetForm();
      onSuccessChangeName();
    } catch (err: any) {
      console.log("change name error", err);
      console.log("change name error response", err?.response);
      const code = err?.code as keyof typeof ErrorMessages;
      const errorKey = ErrorMessages[code];
      setError(errorKey ? t(`errors.${errorKey}`) : t("errors.undefined"));
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
        initialValues={{ newName: "" }}
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
              <ThemedText style={ui.label}>
                {t("settings.profile.newName")}
              </ThemedText>
              <ThemedTextInput
                name="newName"
                touched={touched}
                errors={errors}
                placeholder={t("settings.profile.newName")}
                containerStyle={{
                  marginBottom: 16,
                }}
                value={values.newName}
                onChangeText={handleChange("newName")}
                onBlur={handleBlur("newName")}
              />
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
              style={ui.btnPrimary}
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
