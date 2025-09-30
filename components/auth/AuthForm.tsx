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
import RefreshForm from "./RefreshForm";
import React, { useMemo, useState } from "react";
import { ThemedText } from "@/components/ThemedText";
import { useTranslation } from "react-i18next";
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";
import ChangePasswordForm from "@/components/auth/ChangePasswordForm";
import EmailVerificationCodeForm from "@/components/auth/EmailVerificationCodeForm";
import BackArrow from "@/components/ui/BackArrow";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { EPlatform } from "@/types";

export default function AuthForm({
  forPlanSelect = false,
  onSuccessSignWithGoogle,
  onSuccessEmailCode,
  onSuccessSignIn,
  activeAuthTab = "register",
  handleBack,
  isLogin = false,
  isRegister = false,
  isRefresh = false,
}: {
  forPlanSelect?: boolean;
  onSuccessSignWithGoogle: () => void;
  onSuccessEmailCode: () => void;
  onSuccessSignIn: () => void;
  activeAuthTab?: "login" | "register" | "refresh";
  handleBack?: () => void;
  isLogin?: boolean;
  isRegister?: boolean;
  isRefresh?: boolean;
}) {
  const [activeTab, setActiveTab] = useState<"login" | "register" | "refresh">(
    activeAuthTab,
  );
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const styles = useMemo(() => getStyles(colors), [colors]);
  const [showEmailVerificationCodeForm, setShowEmailVerificationCodeForm] =
    useState(false);
  const { t } = useTranslation();
  const [showForgotPasswordForm, setShowForgotPasswordForm] = useState(false);
  const [showChangePasswordForm, setShowChangePasswordForm] = useState(false);
  const [emailForPasswordReset, setEmailForPasswordReset] = useState("");

  const onSuccessResetPassword = (email: string) => {
    setEmailForPasswordReset(email);
    setShowForgotPasswordForm(false);
    setShowChangePasswordForm(true);
  };

  const onSuccessChangePassword = () => {
    setShowChangePasswordForm(false);
    setActiveTab("login");
  };

  const closeSheet = () => {
    if (showChangePasswordForm) {
      setShowChangePasswordForm(false);
      setActiveTab("login");
    } else if (showForgotPasswordForm) {
      setShowForgotPasswordForm(false);
    } else if (showEmailVerificationCodeForm) {
      setShowEmailVerificationCodeForm(false);
      setActiveTab("register");
    } else {
      handleBack();
    }
  };

  return (
    <Background background={colors.backgroundImage}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === EPlatform.IOS ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === EPlatform.IOS ? 0 : 0}
      >
        <TouchableOpacity
          onPress={closeSheet}
          style={[
            {
              paddingTop: 40,
              paddingBottom: 10,
              paddingLeft: 20,
              width: 40,
            },
          ]}
        >
          <MaterialCommunityIcons
            name="arrow-left"
            size={28}
            color={colors.primary}
          />
        </TouchableOpacity>
        <ScrollView
          contentContainerStyle={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
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
            <ChangePasswordForm
              email={emailForPasswordReset}
              onSuccess={onSuccessChangePassword}
            />
          ) : (
            <View style={styles.container}>
              {/* Tabs */}
              <View style={styles.tabsContainer}>
                {isLogin && (
                  <TouchableOpacity
                    style={[
                      styles.tab,
                      activeTab === "login" && isLogin && styles.activeTab,
                    ]}
                    onPress={() => setActiveTab("login")}
                  >
                    <ThemedText
                      type="titleLG"
                      style={[
                        { color: colors.textDisabled },
                        activeTab === "login" &&
                          isLogin &&
                          styles.activeTabText,
                      ]}
                    >
                      {t("auth.login")}
                    </ThemedText>
                  </TouchableOpacity>
                )}
                {isRefresh && (
                  <TouchableOpacity
                    style={[
                      styles.tab,
                      activeTab === "refresh" && isRefresh && styles.activeTab,
                    ]}
                    onPress={() => setActiveTab("refresh")}
                  >
                    <ThemedText
                      type="titleLG"
                      style={[
                        { color: colors.textDisabled },
                        activeTab === "refresh" &&
                          isRefresh &&
                          styles.activeTabText,
                      ]}
                    >
                      {t("auth.refreshSession")}
                    </ThemedText>
                  </TouchableOpacity>
                )}
                {isRegister && (
                  <TouchableOpacity
                    style={[
                      styles.tab,
                      activeTab === "register" &&
                        isRegister &&
                        styles.activeTab,
                    ]}
                    onPress={() => setActiveTab("register")}
                  >
                    <ThemedText
                      type="titleLG"
                      style={[
                        { color: colors.textDisabled },
                        activeTab === "register" &&
                          isRegister &&
                          styles.activeTabText,
                      ]}
                    >
                      {t("auth.registration")}
                    </ThemedText>
                  </TouchableOpacity>
                )}
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
                ) : activeTab === "refresh" ? (
                  <RefreshForm
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
    activeTabText: {
      color: colors.primary,
    },
    tabContent: {
      flex: 1,
      paddingHorizontal: 24,
      justifyContent: "flex-start",
    },
  });
