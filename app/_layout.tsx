import React, { useEffect, useMemo, useState, lazy, Suspense } from "react";
import "../i18n";
import "@/constants/CalendarLocale";
import { ThemeProvider as NavThemeProvider } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import { Provider, useDispatch } from "react-redux";
import { store } from "@/store";
import { ThemeProviderCustom, useThemeCustom } from "@/context/ThemeContext";
import { AuthProvider } from "@/context/AuthContext";
import { BiometryProvider } from "@/context/BiometryContext";
import { PortalProvider } from "@gorhom/portal";
import CustomToast from "@/components/ui/CustomToast";

import { Colors } from "@/constants/Colors";
import { NavigationThemes } from "@/constants/Theme";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";

import * as SecureStore from "@/utils/store/secureStore";
import i18n from "i18next";
import { LocaleConfig } from "react-native-calendars";
import uuid from "react-native-uuid";
import { apiRequest } from "@/utils";
import { UserEvents } from "@/utils/events/userEvents";
import type { User } from "@/types";
import { Lang } from "@/types";

import { resetFont } from "@/store/slices/settings/fontSlice";
import { resetTimeFormat } from "@/store/slices/settings/timeFormatSlice";
import { resetAiModel } from "@/store/slices/settings/aiModelSlice";
import { useHydrateSettings } from "@/hooks/useHydrateSettings";
import { unstable_batchedUpdates, AppState } from "react-native";
import * as Localization from "expo-localization";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AuthGate = lazy(() => import("@/components/auth/AuthGate"));
const AuthForm = lazy(() => import("@/components/auth/AuthForm"));
const HandleSubscription = lazy(
  () => import("@/components/auth/HandleSubscription"),
);
const RegisterOrNot = lazy(() => import("@/components/auth/RegisterOrNot"));

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
    Caveat: require("@/assets/fonts/entry/Caveat-VariableFont_wght.ttf"),
    "Amatic SC": require("@/assets/fonts/entry/AmaticSC-Regular.ttf"),
    "PT Mono": require("@/assets/fonts/entry/PTMono.ttf"),
    "Comforter Brush": require("@/assets/fonts/entry/ComforterBrush-Regular.ttf"),
    "Bad Script": require("@/assets/fonts/entry/BadScript-Regular.ttf"),
    "Yeseva One": require("@/assets/fonts/entry/YesevaOne-Regular.ttf"),
  });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      // await Promise.allSettled([
      //   SecureStore.deleteItemAsync("token"),
      //   SecureStore.deleteItemAsync("user"),
      //   SecureStore.deleteItemAsync("user_pin"),
      //   SecureStore.deleteItemAsync("biometry_enabled"),
      //   AsyncStorage.removeItem("show_welcome"),
      //   AsyncStorage.removeItem("register_or_not"),
      // ]);
      const token = await SecureStore.getItemAsync("token");
      console.log("token", token);
      const storedUser = await SecureStore.getItemAsync("user");
      console.log("storedUser", JSON.parse(storedUser));
      const userPin = await SecureStore.getItemAsync("user_pin");
      console.log("userPin", userPin);
      const biometryEnabled =
        await SecureStore.getItemAsync("biometry_enabled");
      console.log("biometryEnabled", biometryEnabled);
      const showWelcome = await AsyncStorage.getItem("show_welcome");
      console.log("showWelcome", showWelcome);
      const registerOrNot = await AsyncStorage.getItem("register_or_not");
      console.log("registerOrNot", registerOrNot);

      if (!cancelled) {
        const stored = await SecureStore.getItemAsync("user");
        let u: User | null = stored ? JSON.parse(stored) : null;
        if (!u) {
          u = await createAnonymousUser();
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (!loaded) return null;

  return (
    <Provider store={store}>
      <ThemeProviderCustom>
        <NavigationThemeWrapper>
          <AuthProvider>
            <BiometryProvider>
              <PortalProvider>
                <Suspense fallback={null}>
                  <AppContent />
                </Suspense>
                <CustomToast />
              </PortalProvider>
            </BiometryProvider>
          </AuthProvider>
        </NavigationThemeWrapper>
      </ThemeProviderCustom>
    </Provider>
  );
}

async function createAnonymousUser(): Promise<User | null> {
  try {
    const newUuid = uuid.v4();
    const res = await apiRequest({
      url: `/users/create-by-uuid`,
      method: "POST",
      data: { uuid: newUuid },
    });
    if (res?.status === 201) {
      const data = await res.data;
      await SecureStore.setItemAsync("token", data.accessToken);
      await SecureStore.setItemAsync("user", JSON.stringify(data.user));
      return data.user as User;
    }
  } catch (e) {
    console.warn("Failed to create anonymous user", e);
  }
  return null;
}

function AppContent() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const { resetToSystem } = useThemeCustom();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const dispatch = useDispatch();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const stored = await SecureStore.getItemAsync("user");
        const u: User | null = stored ? JSON.parse(stored) : null;

        if (cancelled) return;

        setUser(u);

        const lang = u?.settings?.lang;
        if (lang) {
          await i18n.changeLanguage(lang);
          LocaleConfig.defaultLocale = lang;
        }
        console.log("Init complete, user:", u);
      } catch (e) {
        console.warn("Failed to init user/lang", e);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useHydrateSettings(user);

  useUpdateLastActive(user);

  useEffect(() => {
    let cancelled = false;
    const onUserDeleted = async () => {
      const fresh = await createAnonymousUser();

      if (cancelled) return;
      setUser(fresh);
      unstable_batchedUpdates(() => {
        dispatch(resetFont());
        dispatch(resetAiModel());
        dispatch(resetTimeFormat());
      });
      resetToSystem();
      setIsAuthenticated(false);

      const locales = Localization.getLocales();
      const deviceLanguage: string = locales[0]?.languageCode ?? Lang.EN;

      await i18n.changeLanguage(deviceLanguage);
      LocaleConfig.defaultLocale = deviceLanguage;
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
      <MainAfterAuth user={user} setUser={setUser} />
      <StatusBar translucent style={colors.barStyle} />
    </>
  );
}

function MainAfterAuth({
  user,
  setUser,
}: {
  user: User | null;
  setUser: (u: User | null) => void;
}) {
  const [showAuthForm, setShowAuthForm] = useState(false);
  const [showRegisterOrNot, setShowRegisterOrNot] = useState<boolean | null>(
    false,
  );
  const [continueWithoutRegistration, setContinueWithoutRegistration] =
    useState(false);

  useEffect(() => {
    const getRegisterOrNot = async () => {
      const stored = await AsyncStorage.getItem("register_or_not");
      const value = stored === null ? true : stored === "true";
      setShowRegisterOrNot(value);
    };
    getRegisterOrNot();
  }, []);

  const onSuccessHandleSubscription = async () => {
    const storedUser = await SecureStore.getItemAsync("user");
    setUser(storedUser ? JSON.parse(storedUser) : null);
  };

  if (showRegisterOrNot) {
    return (
      <RegisterOrNot
        setContinueWithoutRegistration={setContinueWithoutRegistration}
        setShowAuthForm={setShowAuthForm}
        onChoice={() => setShowRegisterOrNot(false)}
      />
    );
  }

  if (showAuthForm) {
    return (
      <AuthForm
        forPlanSelect
        onSuccessSignWithGoogle={() => setShowAuthForm(false)}
        onSuccessEmailCode={() => setShowAuthForm(false)}
        onSuccessSignIn={() => setShowAuthForm(false)}
      />
    );
  }

  if (!user?.plan) {
    return (
      <HandleSubscription
        setShowRegisterOrNot={setShowRegisterOrNot}
        onSuccess={onSuccessHandleSubscription}
        continueWithoutRegistration={continueWithoutRegistration}
      />
    );
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
function useUpdateLastActive(user: User | null) {
  useEffect(() => {
    if (!user?.id) return;

    let last = 0;
    const send = async () => {
      const now = Date.now();
      if (now - last < 15_000) return;
      last = now;
      try {
        await apiRequest({
          url: `/users/update`,
          method: "POST",
          data: { lastActiveAt: new Date().toISOString() },
        });
      } catch {}
    };

    // const sub = AppState.addEventListener("change", (s) => {
    //   if (s === "active") send();
    // });
    send();

    // return () => sub.remove();
  }, [user?.id]);
}
