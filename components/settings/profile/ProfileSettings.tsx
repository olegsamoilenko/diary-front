import BackArrow from "@/components/ui/BackArrow";
import { ThemedText } from "@/components/ThemedText";
import React, { forwardRef, useEffect, useState } from "react";
import SideSheet, { SideSheetRef } from "@/components/SideSheet";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";
import { useTranslation } from "react-i18next";
import { PLANS } from "@/constants/Plans";
import { ColorTheme, Plan } from "@/types";
import Background from "@/components/Background";
import * as SecureStore from "@/utils/store/secureStore";
import type { User } from "@/types";
import Plans from "@/components/subscription/Plans";
import Payment from "@/components/subscription/Payment";
import AuthForm from "@/components/auth/AuthForm";
import { apiRequest, UserEvents } from "@/utils";
import ProfileCard from "./ProfileCard";
import ModalPortal from "@/components/ui/Modal";
import Emoji from "@/components/diary/Emoji";
import ChangeNameModal from "@/components/settings/profile/ChangeNameModal";
import Toast from "react-native-toast-message";
import ChangeEmailModal from "@/components/settings/profile/ChangeEmailModal";
import ChangePasswordModal from "@/components/settings/profile/ChangePasswordModal";
import DeleteAccountModal from "@/components/settings/profile/DeleteAccountModal";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

const ProfileSettings = forwardRef<SideSheetRef, {}>((props, ref) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const styles = getStyles(colors);
  const { t } = useTranslation();
  const [user, setUser] = useState<User | null>(null);
  const [userLogged, setUserLogged] = useState(false);
  const [showPayment, setShowPayment] = React.useState(false);
  const [successPaymentPlan, setSuccessPaymentPlan] =
    React.useState<Plan | null>(null);
  const [plan, setPlan] = React.useState<Plan | null>(null);
  const [showAuthForm, setShowAuthForm] = useState(false);
  const [showChangeNameModal, setShowChangeNameModal] = useState(false);
  const [showChangeEmailModal, setShowChangeEmailModal] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [activeTab, setActiveTab] = useState<"login" | "register">("register");
  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);

  useEffect(() => {
    getUserLogged();
    getUser();
  }, []);

  const getUser = async () => {
    const storedUser = await SecureStore.getItemAsync("user");
    setUser(storedUser ? JSON.parse(storedUser) : null);
  };

  const getUserLogged = async () => {
    const token = await SecureStore.getItemAsync("token");
    if (token) {
      setUserLogged(true);
    } else {
      setUserLogged(false);
    }
  };

  useEffect(() => {
    const handler = () => getUser();
    UserEvents.on("userChanged", handler);
    return () => UserEvents.off("userChanged", handler);
  }, []);

  useEffect(() => {
    const handler = () => getUser();
    UserEvents.on("userRegistered", handler);
    return () => UserEvents.off("userRegistered", handler);
  }, []);

  useEffect(() => {
    const handler = () => getUserLogged();
    UserEvents.on("userRegistered", handler);
    return () => UserEvents.off("userRegistered", handler);
  }, []);

  useEffect(() => {
    const handler = () => getUserLogged();
    UserEvents.on("userLoggedIn", handler);
    return () => UserEvents.off("userLoggedIn", handler);
  }, []);

  const onSuccessChangeName = () => {
    Toast.show({
      type: "success",
      text1: t("toast.successfullyUpdated"),
      text2: t("toast.youHaveSuccessfullyChangedYourName"),
    });
    setShowChangeNameModal(false);
  };

  const onSuccessChangeEmail = () => {
    Toast.show({
      type: "success",
      text1: t("toast.successfullyUpdated"),
      text2: t("toast.youHaveSuccessfullyChangedYourEmail"),
    });
    setShowChangeEmailModal(false);
  };

  const onSuccessChangePassword = () => {
    Toast.show({
      type: "success",
      text1: t("toast.successfullyUpdated"),
      text2: t("toast.youHaveSuccessfullyChangedYourPassword"),
    });
    setShowChangePasswordModal(false);
  };

  const handleRegister = async () => {
    setActiveTab("register");
    setShowAuthForm(true);
  };

  const handleLogin = async () => {
    setActiveTab("login");
    setShowAuthForm(true);
  };

  const handleChangeNameModal = async () => {
    setShowChangeNameModal(true);
  };

  const handleChangeEmailModal = async () => {
    setShowChangeEmailModal(true);
  };

  const handleChangePasswordModal = async () => {
    setShowChangePasswordModal(true);
  };

  const handleLogout = async () => {
    await SecureStore.deleteItemAsync("token");
    await getUserLogged();
    if (user?.oauthProviderId) {
      try {
        await GoogleSignin.signOut();
      } catch (error) {
        console.error("Error signing out from Google:", error);
      }
    }
    Toast.show({
      type: "success",
      text1: t("toast.successfullyLoggedOut"),
    });
  };

  return (
    <SideSheet ref={ref}>
      <Background background={colors.backgroundImage} paddingTop={10}>
        {showAuthForm ? (
          <AuthForm
            onSuccessSignWithGoogle={() => {
              setShowAuthForm(false);
              getUserLogged();
              getUser();
            }}
            onSuccessSignIn={() => setShowAuthForm(false)}
            onSuccessEmailCode={() => setShowAuthForm(false)}
            activeAuthTab={activeTab}
          />
        ) : (
          <View style={styles.container}>
            <BackArrow ref={ref} />
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 20,
              }}
            >
              <ThemedText type={"subtitleXL"}>
                {t("settings.profile.title")}
              </ThemedText>
              <ThemedText
                style={{
                  color:
                    userLogged && user?.isRegistered
                      ? "green"
                      : userLogged && !user?.isRegistered
                        ? "red"
                        : "orange",
                }}
              >
                {userLogged && user?.isRegistered
                  ? t("settings.profile.loggedIn")
                  : userLogged && !user?.isRegistered
                    ? t("settings.profile.notRegister")
                    : t("settings.profile.loggedOut")}
              </ThemedText>
            </View>
            <ProfileCard
              key={"name"}
              title={t("settings.profile.name")}
              val={user?.name}
              handleAction={handleChangeNameModal}
            ></ProfileCard>
            <ChangeNameModal
              showChangeNameModal={showChangeNameModal}
              setShowChangeNameModal={setShowChangeNameModal}
              onSuccessChangeName={onSuccessChangeName}
            />
            {user?.email && (
              <>
                <ProfileCard
                  key={"email"}
                  title={t("settings.profile.email")}
                  val={user?.email}
                  isActionButton={!user?.oauthProviderId}
                  handleAction={handleChangeEmailModal}
                ></ProfileCard>
                <ChangeEmailModal
                  showChangeEmailModal={showChangeEmailModal}
                  setShowChangeEmailModal={setShowChangeEmailModal}
                  onSuccessChangeEmail={onSuccessChangeEmail}
                />
              </>
            )}

            <ProfileCard
              key={"identifier"}
              title={t("settings.profile.identifier")}
              val={user?.uuid}
              isActionButton={false}
            ></ProfileCard>

            {!user?.oauthProviderId && user?.isRegistered && (
              <>
                <TouchableOpacity
                  style={[
                    styles.btn,
                    {
                      backgroundColor: colors.primary,
                      marginBottom: 20,
                    },
                  ]}
                  onPress={handleChangePasswordModal}
                >
                  <ThemedText
                    style={{
                      color: colors.textInPrimary,
                      textAlign: "center",
                    }}
                  >
                    {t("auth.changePassword")}
                  </ThemedText>
                </TouchableOpacity>
                <ChangePasswordModal
                  showChangePasswordModal={showChangePasswordModal}
                  setShowChangePasswordModal={setShowChangePasswordModal}
                  onSuccessChangePassword={onSuccessChangePassword}
                />
              </>
            )}

            {user?.isRegistered && userLogged && (
              <View>
                <TouchableOpacity
                  style={[
                    styles.btn,
                    {
                      borderWidth: 1,
                      borderColor: colors.border,
                      marginBottom: 20,
                      backgroundColor: colors.background,
                    },
                  ]}
                  onPress={handleLogout}
                >
                  <ThemedText
                    style={{
                      color: colors.text,
                      textAlign: "center",
                    }}
                  >
                    {t("auth.logout")}
                  </ThemedText>
                </TouchableOpacity>
              </View>
            )}

            {!user?.isRegistered && (
              <View>
                <TouchableOpacity
                  style={[
                    styles.btn,
                    {
                      backgroundColor: colors.primary,
                      marginBottom: 20,
                    },
                  ]}
                  onPress={handleRegister}
                >
                  <ThemedText
                    style={{
                      color: colors.textInPrimary,
                      textAlign: "center",
                    }}
                  >
                    {t("auth.register")}
                  </ThemedText>
                </TouchableOpacity>
              </View>
            )}
            {user?.isRegistered && !userLogged && (
              <View>
                <TouchableOpacity
                  style={[
                    styles.btn,
                    {
                      backgroundColor: colors.primary,
                      marginBottom: 20,
                    },
                  ]}
                  onPress={handleLogin}
                >
                  <ThemedText
                    style={{
                      color: colors.textInPrimary,
                      textAlign: "center",
                    }}
                  >
                    {t("auth.login")}
                  </ThemedText>
                </TouchableOpacity>
              </View>
            )}
            {user?.isRegistered && (
              <View>
                <TouchableOpacity
                  style={[
                    styles.btn,
                    {
                      borderWidth: 1,
                      borderColor: colors.border,
                      marginBottom: 20,
                      backgroundColor: colors.background,
                    },
                  ]}
                  onPress={() => setShowDeleteAccountModal(true)}
                >
                  <ThemedText
                    style={{
                      color: colors.text,
                      textAlign: "center",
                    }}
                  >
                    {t("auth.deleteAccount")}
                  </ThemedText>
                </TouchableOpacity>
                <DeleteAccountModal
                  showDeleteAccountModal={showDeleteAccountModal}
                  setShowDeleteAccountModal={setShowDeleteAccountModal}
                  userId={Number(user?.id)}
                />
              </View>
            )}
          </View>
        )}
      </Background>
    </SideSheet>
  );
});

ProfileSettings.displayName = "ProfileSettings";

export default ProfileSettings;

const getStyles = (colors: ColorTheme) =>
  StyleSheet.create({
    container: {
      paddingHorizontal: 20,
      flex: 1,
      marginBottom: -6,
      width: "100%",
    },
    field: {
      flexDirection: "column",
      gap: 10,
    },
    btn: {
      paddingHorizontal: 14,
      paddingVertical: 8,
      borderRadius: 12,
      textAlign: "center",
    },
  });
