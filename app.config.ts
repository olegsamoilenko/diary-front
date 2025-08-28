import "dotenv/config";

console.log("CONFIG ENV API_URL:", process.env.EXPO_PUBLIC_API_URL);
console.log("CONFIG ENV BASE_URL:", process.env.EXPO_PUBLIC_URL);
export default ({ config }: { config: any }) => ({
  expo: {
    ...config,
    name: "Nemory",
    slug: "nemory",
    owner: "soniac12",
    version: "1.1.2",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "nemory",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    splash: {
      image: "./assets/images/icon_light.png",
      backgroundColor: "#FFFFFF",
      resizeMode: "contain",
      dark: {
        image: "./assets/images/icon_dark.png",
        backgroundColor: "#000000",
      },
    },
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
        "expo-build-properties",
        {
          android: {
            enableProguardInReleaseBuilds: false,
            enableShrinkResourcesInReleaseBuilds: false,
            enablePngCrunchInReleaseBuilds: false,
            extraProguardRules:
              "-keep class com.swmansion.reanimated.** { *; }\n-dontwarn com.facebook.react.**",
          },
        },
      ],
      // [
      //   "expo-splash-screen",
      // {
      //   image: "./assets/images/icon.png",
      //   imageWidth: 200,
      //   resizeMode: "contain",
      //   backgroundColor: "#ffffff",
      // },
      // ],
      "expo-secure-store",
    ],
    experiments: {
      typedRoutes: true,
    },
    runtimeVersion: "1.1.2",
    jsEngine: "hermes",
    ios: {
      supportsTablet: true,
      jsEngine: "jsc",
      buildNumber: "1.1.2",
    },
    android: {
      package: "com.soniac12.nemory",
      package_name: "com.soniac12.nemory",
      versionCode: 8,
      adaptiveIcon: {
        foregroundImage: "./assets/images/icon.png",
        backgroundColor: "#ffffff",
      },
      edgeToEdgeEnabled: true,
      enableProguardInReleaseBuilds: false,
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/favicon.png",
    },
    extra: {
      ...config.extra,
      API_URL: "https://nemoryai.com/api",
      URL: "https://nemoryai.com",
      // API_URL: "http://192.168.0.102:3001",
      // GOOGLE_CLIENT_WEB_ID:
      //   "203981333495-fjift3o1qr4q35tv5hscsuutbouspfir.apps.googleusercontent.com",
      // GOOGLE_CLIENT_ANDROID_ID:
      //   "203981333495-8n59u2q1abopsh3nrnpbal3kn0olcf56.apps.googleusercontent.com",
      // GOOGLE_CLIENT_IOS_ID:
      //   "203981333495-55s91bj0jmma2dl1mrnkku56s8i34ckg.apps.googleusercontent.com",
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
