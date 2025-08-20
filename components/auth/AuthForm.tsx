import Background from "@/components/Background";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import NemoryLogo from "@/components/ui/logo/NemoryLogo";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import React, { useState } from "react";
import { ThemedText } from "@/components/ThemedText";
import { useTranslation } from "react-i18next";
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";
import ChangePasswordForm from "@/components/auth/ChangePasswordForm";
import EmailVerificationCodeForm from "@/components/auth/EmailVerificationCodeForm";

export default function AuthForm({
  forPlanSelect = false,
  onSuccessSignWithGoogle,
  onSuccessEmailCode,
  onSuccessSignIn,
  activeAuthTab = "register",
}: {
  forPlanSelect?: boolean;
  onSuccessSignWithGoogle: () => void;
  onSuccessEmailCode: () => void;
  onSuccessSignIn: () => void;
  activeAuthTab?: "login" | "register";
}) {
  const [activeTab, setActiveTab] = useState<"login" | "register">(
    activeAuthTab,
  );
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const styles = getStyles(colors);
  const [showEmailVerificationCodeForm, setShowEmailVerificationCodeForm] =
    useState(false);
  const { t } = useTranslation();
  const [showForgotPasswordForm, setShowForgotPasswordForm] = useState(false);
  const [showChangePasswordForm, setShowChangePasswordForm] = useState(false);

  const onSuccessResetPassword = () => {
    setShowForgotPasswordForm(false);
    setShowChangePasswordForm(true);
  };

  const onSuccessChangePassword = () => {
    setShowChangePasswordForm(false);
    setActiveTab("login");
  };

  return (
    <Background background={colors.backgroundImage}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
      >
        <ScrollView contentContainerStyle={styles.scrollView}>
          <View style={styles.logo}>
            <NemoryLogo />
          </View>
          {showEmailVerificationCodeForm ? (
            <EmailVerificationCodeForm
              onSuccessEmailCode={onSuccessEmailCode}
              forPlanSelect={forPlanSelect}
            />
          ) : showForgotPasswordForm ? (
            <ForgotPasswordForm onSuccess={onSuccessResetPassword} />
          ) : showChangePasswordForm ? (
            <ChangePasswordForm onSuccess={onSuccessChangePassword} />
          ) : (
            <View style={styles.container}>
              {/* Tabs */}
              <View style={styles.tabsContainer}>
                <TouchableOpacity
                  style={[
                    styles.tab,
                    activeTab === "login" && styles.activeTab,
                  ]}
                  onPress={() => setActiveTab("login")}
                >
                  <ThemedText
                    type="subtitleLG"
                    style={[
                      styles.tabText,
                      activeTab === "login" && styles.activeTabText,
                    ]}
                  >
                    {t("auth.login")}
                  </ThemedText>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.tab,
                    activeTab === "register" && styles.activeTab,
                  ]}
                  onPress={() => setActiveTab("register")}
                >
                  <ThemedText
                    type="subtitleLG"
                    style={[
                      styles.tabText,
                      activeTab === "register" && styles.activeTabText,
                    ]}
                  >
                    {t("auth.registration")}
                  </ThemedText>
                </TouchableOpacity>
              </View>

              {/* Tab Content */}
              <View style={styles.tabContent}>
                {activeTab === "login" ? (
                  <LoginForm
                    forPlanSelect={forPlanSelect}
                    onSuccessSignWithGoogle={onSuccessSignWithGoogle}
                    setShowForgotPasswordForm={setShowForgotPasswordForm}
                    onSuccessSignIn={onSuccessSignIn}
                  />
                ) : (
                  <RegisterForm
                    forPlanSelect={forPlanSelect}
                    onSuccessSignWithGoogle={onSuccessSignWithGoogle}
                    setShowEmailVerificationCodeForm={
                      setShowEmailVerificationCodeForm
                    }
                  />
                )}
              </View>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </Background>
  );
}

const getStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: 10,
      backgroundColor: "transparent",
    },
    scrollView: {
      flexGrow: 1,
      padding: 20,
      alignItems: "center",
      justifyContent: "center",
    },
    logo: {
      justifyContent: "center",
      alignItems: "center",
      marginTop: 50,
      marginBottom: 20,
    },
    tabsContainer: {
      flexDirection: "row",
      justifyContent: "center",
      marginBottom: 16,
    },
    tab: {
      paddingVertical: 10,
      paddingHorizontal: 32,
      borderBottomWidth: 2,
      borderBottomColor: "transparent",
    },
    activeTab: {
      borderBottomColor: colors.primary,
    },
    tabText: {
      fontSize: 16,
      color: colors.text,
      fontWeight: "600",
    },
    activeTabText: {
      color: colors.primary,
    },
    tabContent: {
      flex: 1,
      paddingHorizontal: 24,
      justifyContent: "flex-start",
    },
  });
