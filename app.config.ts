import "dotenv/config";

export default {
  expo: {
    name: "Nemory",
    slug: "nemory",
    scheme: "nemory",
    version: "1.0.1",
    plugins: ["expo-localization", "expo-router"],
    jsEngine: "hermes",
    android: {
      package: "com.soniac12.nemory",
    },
    ios: {
      jsEngine: "jsc",
    },
    extra: {
      API_URL: process.env.API_URL,
      eas: {
        projectId: "be6994c0-5be5-4005-b6e4-1385174eecc3",
      },
    },
  },
};
