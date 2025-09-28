import React, { useEffect, useMemo, useState, lazy, Suspense } from "react";
import {
  Appearance,
  unstable_batchedUpdates,
  StyleSheet,
  Platform,
} from "react-native";
import "../i18n";
import "@/constants/CalendarLocale";
import { ThemeProvider as NavThemeProvider } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import { Provider, useSelector } from "react-redux";
import { store, RootState, useAppDispatch } from "@/store";
import { ThemeProviderCustom, useThemeCustom } from "@/context/ThemeContext";
import { AuthProvider } from "@/context/AuthContext";
import { BiometryProvider } from "@/context/BiometryContext";
import { PortalHost, PortalProvider } from "@gorhom/portal";
import CustomToast from "@/components/ui/CustomToast";
import { Colors } from "@/constants/Colors";
import { NavigationThemes } from "@/constants/Theme";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import i18n from "i18next";
import { LocaleConfig } from "react-native-calendars";
import { UserEvents } from "@/utils/events/userEvents";
import type { User, UserSettings } from "@/types";
import { Lang } from "@/types";
import { resetPlan } from "@/store/slices/planSlice";
import { resetSettings } from "@/store/slices/settingsSlice";
import { resetUser, setUser } from "@/store/slices/userSlice";
import * as Localization from "expo-localization";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { IapProvider } from "@/context/IapContext";
import { hydrateAll } from "@/store/hydrate";
import { initAnonymousUser } from "@/store/thunks/auth/initAnonymousUser";
import { loadRegisterOrNot } from "@/utils/store/storage";
import { updateUser } from "@/store/thunks/auth/updateUser";
import { logStoredUserData } from "@/utils/storedUserData";
import { getMe } from "@/store/thunks/auth/getMe";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import AuthGate from "@/components/auth/AuthGate";
import AuthForm from "@/components/auth/AuthForm";
import HandleSubscription from "@/components/auth/HandleSubscription";
import RegisterOrNot from "@/components/auth/RegisterOrNot";

function NavigationThemeWrapper({ children }: { children: React.ReactNode }) {
  const { theme } = useThemeCustom();
  const navTheme = useMemo(
    () => NavigationThemes[theme] || NavigationThemes.light,
    [theme],
  );
  return <NavThemeProvider value={navTheme}>{children}</NavThemeProvider>;
}

export default function RootLayout() {
  const [loaded] = useFonts({
    "AlegreyaSans-Regular": require("@/assets/fonts/AlegreyaSans-Regular.ttf"),
    "AlegreyaSans-Bold": require("@/assets/fonts/AlegreyaSans-Bold.ttf"),
    "Exo2-Regular": require("@/assets/fonts/Exo2-Regular.ttf"),
    "Exo2-Bold": require("@/assets/fonts/Exo2-Bold.ttf"),
    "FiraSans-Regular": require("@/assets/fonts/FiraSans-Regular.ttf"),
    "FiraSans-Bold": require("@/assets/fonts/FiraSans-Bold.ttf"),
    "Inter-Regular": require("@/assets/fonts/Inter-Regular.otf"),
    "Inter-Bold": require("@/assets/fonts/Inter-Bold.otf"),
    "Lato-Regular": require("@/assets/fonts/Lato-Regular.ttf"),
    "Lato-Bold": require("@/assets/fonts/Lato-Bold.ttf"),
    "Montserrat-Regular": require("@/assets/fonts/Montserrat-Regular.ttf"),
    "Montserrat-Bold": require("@/assets/fonts/Montserrat-Bold.ttf"),
    "Nunito-Regular": require("@/assets/fonts/Nunito-Regular.ttf"),
    "Nunito-Bold": require("@/assets/fonts/Nunito-Bold.ttf"),
    "Oswald-Regular": require("@/assets/fonts/Oswald-Regular.ttf"),
    "Oswald-Bold": require("@/assets/fonts/Oswald-Bold.ttf"),
    "OpenSans-Regular": require("@/assets/fonts/OpenSans-Regular.ttf"),
    "OpenSans-Bold": require("@/assets/fonts/OpenSans-Bold.ttf"),
    "SourceCodePro-Regular": require("@/assets/fonts/SourceCodePro-Regular.ttf"),
    "SourceCodePro-Bold": require("@/assets/fonts/SourceCodePro-Bold.ttf"),
    "Roboto-Regular": require("@/assets/fonts/Roboto-Regular.ttf"),
    "Roboto-Bold": require("@/assets/fonts/Roboto-Bold.ttf"),
    "Rubik-Regular": require("@/assets/fonts/Rubik-Regular.ttf"),
    "Rubik-Bold": require("@/assets/fonts/Rubik-Bold.ttf"),
    "Tinos-Regular": require("@/assets/fonts/Tinos-Regular.ttf"),
    "Tinos-Bold": require("@/assets/fonts/Tinos-Bold.ttf"),
    "Ubuntu-Regular": require("@/assets/fonts/Ubuntu-Regular.ttf"),
    "Ubuntu-Bold": require("@/assets/fonts/Ubuntu-Bold.ttf"),
    "Ostrich Black": require("@/assets/fonts/Ostrich-black.ttf"),
    "Marck Script": require("@/assets/fonts/entry/MarckScript-Regular.ttf"),
    Neucha: require("@/assets/fonts/entry/Neucha-Regular.ttf"),
    Pacifico: require("@/assets/fonts/entry/Pacifico-Regular.ttf"),
    Caveat: require("@/assets/fonts/entry/Caveat-Regular.ttf"),
    "Amatic SC": require("@/assets/fonts/entry/AmaticSC-Regular.ttf"),
    "PT Mono": require("@/assets/fonts/entry/PTMono.ttf"),
    "Comforter Brush": require("@/assets/fonts/entry/ComforterBrush-Regular.ttf"),
    "Bad Script": require("@/assets/fonts/entry/BadScript-Regular.ttf"),
    "Yeseva One": require("@/assets/fonts/entry/YesevaOne-Regular.ttf"),
  });

  const [loader, setLoader] = useState(false);

  useEffect(() => {
    setLoader(true);
    if (!loaded) return;
    (async () => {
      // await Promise.allSettled([
      //   SecureStore.deleteItemAsync("access_token"),
      //   SecureStore.deleteItemAsync("refresh_token"),
      //   SecureStore.deleteItemAsync("device_id"),
      //   SecureStore.deleteItemAsync("user"),
      //   SecureStore.deleteItemAsync("user_pin"),
      //   SecureStore.deleteItemAsync("biometry_enabled"),
      //   SecureStore.deleteItemAsync("device_sk_b64"),
      //   SecureStore.deleteItemAsync("device_pk_b64"),
      //   AsyncStorage.removeItem("show_welcome"),
      //   AsyncStorage.removeItem("register_or_not"),
      //   AsyncStorage.removeItem("plan"),
      //   AsyncStorage.removeItem("settings"),
      // ]);
      // unstable_batchedUpdates(() => {
      //   store.dispatch(resetUser());
      //   store.dispatch(resetSettings());
      //   store.dispatch(resetPlan());
      // });
      await logStoredUserData();

      const token = await SecureStore.getItemAsync("access_token");

      if (token) {
        try {
          await store.dispatch(getMe()).unwrap();
        } catch (err) {
          console.error("Get me failed", err);
        }
      } else {
        const state = store.getState() as any;
        if (!state.user.value) {
          await store.dispatch(initAnonymousUser()).unwrap();
        }
      }

      setLoader(false);
    })();
  }, [loaded]);

  if (!loaded) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <ThemeProviderCustom>
          <IapProvider>
            <NavigationThemeWrapper>
              <AuthProvider>
                <BiometryProvider>
                  <PortalProvider>
                    {!loader && (
                      <>
                        <Suspense fallback={null}>
                          <AppContent />
                        </Suspense>
                      </>
                    )}
                    <CustomToast />
                  </PortalProvider>
                </BiometryProvider>
              </AuthProvider>
            </NavigationThemeWrapper>
          </IapProvider>
        </ThemeProviderCustom>
      </Provider>
    </GestureHandlerRootView>
  );
}

function AppContent() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const { resetToSystem } = useThemeCustom();

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const user = useSelector((s: RootState) => s.user.value);
  const settings = useSelector((s: RootState) => s.settings.value);

  useUpdateLastActive(user);

  useEffect(() => {
    let cancelled = false;
    const onUserDeleted = async () => {
      if (cancelled) return;
      resetToSystem();
      setIsAuthenticated(false);

      const locales = Localization.getLocales();
      const deviceLanguage: string = locales[0]?.languageCode ?? Lang.EN;

      await i18n.changeLanguage(deviceLanguage);
      LocaleConfig.defaultLocale = deviceLanguage;

      try {
        await store.dispatch(initAnonymousUser()).unwrap();
      } catch (err) {
        console.log("Failed to init anonymous user after deletion", err);
      }
    };

    UserEvents.on("userDeleted", onUserDeleted);
    return () => {
      cancelled = true;
      UserEvents.off("userDeleted", onUserDeleted);
    };
  }, []);

  if (!isAuthenticated) {
    return (
      <>
        <AuthGate onAuthenticated={() => setIsAuthenticated(true)} />
        <StatusBar translucent style={colors.barStyle} />
      </>
    );
  }

  return (
    <>
      <MainAfterAuth />
      <StatusBar translucent style={colors.barStyle} />
    </>
  );
}

function MainAfterAuth() {
  const [showAuthForm, setShowAuthForm] = useState(false);
  const [showRegisterOrNot, setShowRegisterOrNot] = useState<boolean | null>(
    null,
  );
  const [continueWithoutRegistration, setContinueWithoutRegistration] =
    useState(false);
  const [handleSubscriptionPrevStep, setHandleSubscriptionPrevStep] = useState<
    "RegisterOrNot" | "AuthForm" | null
  >(null);

  const plan = useSelector((s: RootState) => s.plan.value);

  const getRegisterOrNot = async () => {
    const v = await loadRegisterOrNot();
    if (typeof v !== "boolean") {
      console.warn("register_or_not is NOT boolean:", v);
      setShowRegisterOrNot(v === true || v === "true");
      return;
    }
    setShowRegisterOrNot(v);
  };

  useEffect(() => {
    getRegisterOrNot();
  }, []);

  if (showRegisterOrNot) {
    return (
      <RegisterOrNot
        setContinueWithoutRegistration={setContinueWithoutRegistration}
        setShowAuthForm={setShowAuthForm}
        onChoice={() => {
          setShowRegisterOrNot(false);
          setHandleSubscriptionPrevStep("RegisterOrNot");
        }}
      />
    );
  }

  if (showAuthForm) {
    return (
      <AuthForm
        forPlanSelect
        onSuccessSignWithGoogle={() => {
          setShowAuthForm(false);
          setHandleSubscriptionPrevStep("AuthForm");
        }}
        onSuccessEmailCode={() => {
          setShowAuthForm(false);
          setHandleSubscriptionPrevStep("AuthForm");
        }}
        onSuccessSignIn={() => {
          setShowAuthForm(false);
          setHandleSubscriptionPrevStep("AuthForm");
        }}
        handleBack={() => {
          setShowAuthForm(false);
          setShowRegisterOrNot(true);
        }}
      />
    );
  }

  if (!plan) {
    return (
      <HandleSubscription
        setShowRegisterOrNot={setShowRegisterOrNot}
        continueWithoutRegistration={continueWithoutRegistration}
        back={() => {
          if (handleSubscriptionPrevStep === "AuthForm") {
            setShowAuthForm(true);
          } else {
            setShowRegisterOrNot(true);
          }
        }}
      />
    );
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}

function useUpdateLastActive(user: User | null) {
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (!user?.id) return;

    let last = 0;
    const send = async () => {
      const now = Date.now();
      if (now - last < 15_000) return;
      last = now;
      try {
        await dispatch(
          updateUser({
            lastActiveAt: new Date().toISOString(),
          }),
        ).unwrap();
      } catch (err: any) {
        console.log("Set Name error response", err);
      }
    };

    send();
  }, [user?.id]);
}
