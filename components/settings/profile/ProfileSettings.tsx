import BackArrow from "@/components/ui/BackArrow";
import { ThemedText } from "@/components/ThemedText";
import React, { forwardRef, useEffect, useMemo, useState } from "react";
import SideSheet, { SideSheetRef } from "@/components/SideSheet";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";
import { useTranslation } from "react-i18next";
import { ColorTheme, Plan } from "@/types";
import Background from "@/components/Background";
import AuthForm from "@/components/auth/AuthForm";
import ProfileCard from "./ProfileCard";
import ChangeNameModal from "@/components/settings/profile/ChangeNameModal";
import Toast from "react-native-toast-message";
import ChangeEmailModal from "@/components/settings/profile/ChangeEmailModal";
import ChangePasswordModal from "@/components/settings/profile/ChangePasswordModal";
import DeleteAccountModal from "@/components/settings/profile/DeleteAccountModal";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { loadAccessToken } from "@/utils/store/storage";
import { useUIStyles } from "@/hooks/useUIStyles";

const ProfileSettings = forwardRef<SideSheetRef, {}>((props, ref) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const styles = useMemo(() => getStyles(colors), [colors]);
  const { t } = useTranslation();
  const user = useSelector((s: RootState) => s.user.value);
  const [userLogged, setUserLogged] = useState(false);
  const [showAuthForm, setShowAuthForm] = useState(false);
  const [showChangeNameModal, setShowChangeNameModal] = useState(false);
  const [showChangeEmailModal, setShowChangeEmailModal] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [activeTab, setActiveTab] = useState<"login" | "register" | "refresh">(
    "register",
  );
  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);
  const ui = useUIStyles();

  useEffect(() => {
    getUserLogged();
  }, [user]);

  const getUserLogged = async () => {
    const token = await loadAccessToken();

    const logged = !!token && !!user?.isLogged;
    setUserLogged(logged);
  };

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

  const handleRefresh = async () => {
    setActiveTab("refresh");
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

  return (
    <SideSheet ref={ref}>
      <Background background={colors.backgroundImage} paddingTop={10}>
        {showAuthForm ? (
          <AuthForm
            isLogin={activeTab === "login"}
            isRegister={activeTab === "register"}
            isRefresh={activeTab === "refresh"}
            handleBack={() => setShowAuthForm(false)}
            onSuccessSignWithGoogle={() => {
              setShowAuthForm(false);
            }}
            onSuccessSignIn={() => {
              setShowAuthForm(false);
            }}
            onSuccessEmailCode={() => {
              setShowAuthForm(false);
            }}
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
                      : !userLogged && !user?.isRegistered
                        ? "red"
                        : "orange",
                }}
              >
                {userLogged && user?.isRegistered
                  ? t("settings.profile.loggedIn")
                  : !userLogged && !user?.isRegistered
                    ? t("settings.profile.notRegister")
                    : !userLogged && user?.isRegistered
                      ? t("settings.profile.notLoggedIn")
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
                    ui.btnPrimary,
                    {
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

            {userLogged && (
              <View>
                <TouchableOpacity
                  style={[
                    ui.btnPrimary,
                    {
                      marginBottom: 20,
                    },
                  ]}
                  onPress={handleRefresh}
                >
                  <ThemedText
                    style={{
                      color: colors.textInPrimary,
                      textAlign: "center",
                    }}
                  >
                    {t("auth.refreshSession")}
                  </ThemedText>
                </TouchableOpacity>
              </View>
            )}

            {!user?.isRegistered && (
              <View>
                <TouchableOpacity
                  style={[
                    ui.btnPrimary,
                    {
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
                    {t("auth.registration")}
                  </ThemedText>
                </TouchableOpacity>
              </View>
            )}
            {!userLogged && (
              <View>
                <TouchableOpacity
                  style={[
                    ui.btnPrimary,
                    {
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
                    ui.btnOutline,
                    {
                      marginBottom: 20,
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
