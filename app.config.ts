import "dotenv/config";

export default () => ({
  expo: {
    name: "Nemory",
    slug: "nemory",
    owner: "soniac12",
    version: "1.0.8",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "nemory",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    plugins: [
      "expo-router",
      "expo-localization",
      [
        "@react-native-google-signin/google-signin",
        {
          iosUrlScheme:
            "com.googleusercontent.apps.com.googleusercontent.apps.328496914085-v457ftd508li5e4g35n1rj9s0b5douvu",
        },
      ],
      [
        "expo-splash-screen",
        {
          image: "./assets/images/icon.png",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#ffffff",
        },
      ],
      "expo-secure-store",
    ],
    experiments: {
      typedRoutes: true,
    },
    runtimeVersion: {
      policy: "appVersion",
    },
    jsEngine: "hermes",
    ios: {
      supportsTablet: true,
      jsEngine: "jsc",
      buildNumber: "1.0.8",
    },
    android: {
      package: "com.soniac12.nemory",
      versionCode: 8,
      adaptiveIcon: {
        foregroundImage: "./assets/images/icon.png",
        backgroundColor: "#ffffff",
      },
      edgeToEdgeEnabled: true,
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/favicon.png",
    },
    extra: {
      API_URL: process.env.API_URL,
      eas: {
        projectId: "be6994c0-5be5-4005-b6e4-1385174eecc3",
        branch: "production",
      },
    },
    updates: {
      url: "https://u.expo.dev/be6994c0-5be5-4005-b6e4-1385174eecc3",
      fallbackToCacheTimeout: 0,
    },
  },
});
