import "../i18n";
import "@/constants/CalendarLocale";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/useColorScheme";
import { ThemeProviderCustom, useThemeCustom } from "@/context/ThemeContext";
import { AuthProvider } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { apiRequest } from "@/utils";
import uuid from "react-native-uuid";
import i18n from "i18next";
import { LocaleConfig } from "react-native-calendars";
import { store } from "@/store";
import { Provider, useDispatch } from "react-redux";
import HandleSubscription from "@/components/auth/HandleSubscription";
import { Plan, User } from "@/types";
import * as SecureStore from "@/utils/store/secureStore";
import { PortalProvider } from "@gorhom/portal";
import { setFont } from "@/store/slices/settings/fontSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { setTimeFormat } from "@/store/slices/settings/timeFormatSlice";
import AuthGate from "@/components/auth/AuthGate";
import { Colors } from "@/constants/Colors";
import { NavigationThemes } from "@/constants/Theme";
import AuthForm from "@/components/auth/AuthForm";
import Toast from "react-native-toast-message";
import { BiometryProvider } from "@/context/BiometryContext";
import { apiUrl } from "@/constants/env";

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

  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { theme } = useThemeCustom();
  const navTheme = NavigationThemes[theme] || NavigationThemes.light;
  const [showAuthForm, setShowAuthForm] = useState(false);
  const [showDoPayment, setShowDoPayment] = useState(false);

  useEffect(() => {
    // const clearUserFromSecureStore = async () => {
    //   await SecureStore.deleteItemAsync("token");
    //   await SecureStore.deleteItemAsync("user");
    //   await SecureStore.deleteItemAsync("user_pin");
    //   await SecureStore.deleteItemAsync("biometry_enabled");
    //   return;
    // };
    // clearUserFromSecureStore();

    // const clearFontFromStore = async () => {
    //   await AsyncStorage.removeItem("font");
    // };
    // clearFontFromStore();

    // const clearThemeFromStore = async () => {
    //   const storedTheme = await AsyncStorage.getItem("APP_THEME");
    //   console.log("Clearing theme from store:", storedTheme);
    //   await AsyncStorage.removeItem("APP_THEME");
    //   const afterClearTheme = await AsyncStorage.getItem("APP_THEME");
    //   console.log("After clearing theme from store:", afterClearTheme);
    // };
    // clearThemeFromStore();

    const initUser = async () => {
      let storedUser = await SecureStore.getItemAsync("user");
      let userObj: User | null = storedUser ? JSON.parse(storedUser) : null;
      if (!userObj) {
        const newUuid = uuid.v4();

        const res = await apiRequest({
          url: `/users/create-by-uuid`,
          method: "POST",
          data: { uuid: newUuid },
        });

        if (!res || res.status !== 201) {
          console.log("No data returned from server");
          return;
        }

        const data = await res.data;

        userObj = data.user;
        await SecureStore.setItemAsync("token", data.accessToken);
        await SecureStore.setItemAsync("user", JSON.stringify(data.user));
      }

      setUser(userObj);
    };
    initUser();
  }, []);

  useEffect(() => {
    const initLanguage = async () => {
      const lang = await SecureStore.getItemAsync("lang");
      if (lang) {
        i18n.changeLanguage(lang);
        LocaleConfig.defaultLocale = lang;
      }
    };

    initLanguage();
  }, []);

  const onSuccessHandleSubscription = async () => {
    console.log(444);

    const storedUser = await SecureStore.getItemAsync("user");
    const userObj = JSON.parse(storedUser!);

    setUser(userObj);
  };

  if (!loaded) {
    return null;
  }

  if (!isAuthenticated) {
    return (
      <Provider store={store}>
        <ThemeProviderCustom>
          <ThemeProvider value={navTheme}>
            <AuthGate onAuthenticated={() => setIsAuthenticated(true)} />
            <Toast />
          </ThemeProvider>
        </ThemeProviderCustom>
      </Provider>
    );
  }

  return (
    <Provider store={store}>
      <ThemeProviderCustom>
        <AuthProvider>
          <BiometryProvider>
            <PortalProvider>
              {showAuthForm ? (
                <AuthForm
                  forPlanSelect={true}
                  onSuccessSignWithGoogle={() => setShowAuthForm(false)}
                  onSuccessEmailCode={() => setShowAuthForm(false)}
                  // onSuccessPhoneCode={() => setShowAuthForm(false)}
                />
              ) : !user?.plan ? (
                <HandleSubscription
                  setShowAuthForm={setShowAuthForm}
                  onSuccess={onSuccessHandleSubscription}
                />
              ) : (
                <RootLayoutInner />
              )}
            </PortalProvider>
          </BiometryProvider>
        </AuthProvider>
      </ThemeProviderCustom>
      <Toast />
    </Provider>
  );
}

function RootLayoutInner() {
  const colorScheme = useColorScheme();
  const { theme } = useThemeCustom();
  const navTheme = NavigationThemes[theme] || NavigationThemes.light;
  const colors = Colors[colorScheme ?? "light"];

  const dispatch = useDispatch();

  useEffect(() => {
    const loadFont = async () => {
      const savedFont = await AsyncStorage.getItem("font");
      if (savedFont) {
        dispatch(setFont(JSON.parse(savedFont)));
      }
    };
    loadFont();

    const loadTimeFormat = async () => {
      const timeFormat = await SecureStore.getItemAsync("timeFormat");
      if (timeFormat) {
        dispatch(setTimeFormat(JSON.parse(timeFormat)));
      }
    };

    loadTimeFormat();
  }, []);

  return (
    <ThemeProvider value={navTheme}>
      <Stack screenOptions={{ headerShown: false }}></Stack>
      <StatusBar translucent />
    </ThemeProvider>
  );
}
