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
import { apiRequest } from "@/utils";

const ProfileSettings = forwardRef<SideSheetRef, {}>((props, ref) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme] ?? Colors.system;
  const styles = getStyles(colors);
  const { t } = useTranslation();
  const [user, setUser] = useState<User | null>(null);
  const [userLogged, setUserLogged] = useState(false);
  const [showPayment, setShowPayment] = React.useState(false);
  const [successPaymentPlan, setSuccessPaymentPlan] =
    React.useState<Plan | null>(null);
  const [plan, setPlan] = React.useState<Plan | null>(null);
  const [showAuthForm, setShowAuthForm] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      const storedUser = await SecureStore.getItemAsync("user");
      setUser(storedUser ? JSON.parse(storedUser) : null);
    };

    const getUserLogged = async () => {
      const token = await SecureStore.getItemAsync("token");
      if (token) {
        setUserLogged(true);
      }
    };

    getUserLogged();
    getUser();
  }, []);

  const handleRegister = async () => {
    console.log("handleRegister called");
  };

  return (
    <SideSheet ref={ref}>
      <Background background={colors.backgroundImage} paddingTop={10}>
        <View style={styles.container}>
          <BackArrow ref={ref} />
          <ThemedText
            type={"subtitleXL"}
            style={{
              marginBottom: 20,
            }}
          >
            {t("settings.profile.title")}
          </ThemedText>
          <View style={styles.field}>
            <ThemedText type={"bold"}>
              {t("settings.profile.identifier")}:
            </ThemedText>
            <View style={{ flexShrink: 1 }}>
              <ThemedText>{user?.uuid}</ThemedText>
            </View>
          </View>
          <View style={[styles.field, { marginBottom: 20 }]}>
            <ThemedText type={"bold"}>{t("settings.profile.name")}:</ThemedText>
            <ThemedText>{user?.name}</ThemedText>
          </View>
          {!user?.isRegistered && (
            <View>
              <TouchableOpacity
                style={styles.btn}
                onPress={() => setShowAuthForm(true)}
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
                style={styles.btn}
                onPress={() => setShowAuthForm(true)}
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
        </View>
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
      flexDirection: "row",
      gap: 10,
    },
    btn: {
      paddingHorizontal: 18,
      paddingVertical: 10,
      backgroundColor: colors.primary,
      borderRadius: 12,
      textAlign: "center",
    },
  });
