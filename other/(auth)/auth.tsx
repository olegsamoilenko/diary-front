import React, { useMemo, useState } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import RegisterForm from "@/components/auth/RegisterForm";
import LoginForm from "@/components/auth/LoginForm";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";
import { ColorTheme, EPlatform } from "@/types";

type Tab = "register" | "login";

export default function AuthScreen() {
  const [activeTab, setActiveTab] = useState<Tab>("login");
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const styles = useMemo(() => getStyles(colors), [colors]);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === EPlatform.IOS ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.logo}>
          <Text style={styles.logoText}>Nemory</Text>
        </View>
        <View style={styles.tabs}>
          <TouchableOpacity
            style={[styles.tab, activeTab === "login" && styles.tabActive]}
            onPress={() => setActiveTab("login")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "login" && styles.tabTextActive,
              ]}
            >
              Логін
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === "register" && styles.tabActive]}
            onPress={() => setActiveTab("register")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "register" && styles.tabTextActive,
              ]}
            >
              Реєстрація
            </Text>
          </TouchableOpacity>
        </View>

        {/* Forms */}
        {activeTab === "login" ? <LoginForm /> : <RegisterForm />}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const getStyles = (colors: ColorTheme) =>
  StyleSheet.create({
    container: { flexGrow: 1, justifyContent: "center", padding: 20 },
    logo: {
      alignItems: "center",
      marginBottom: 32,
      fontSize: 36,
    },
    logoText: {
      fontSize: 36,
      fontWeight: "bold",
      color: "#344360",
    },
    tabs: {
      flexDirection: "row",
      marginBottom: 32,
      borderRadius: 12,
      overflow: "hidden",
    },
    tab: {
      flex: 1,
      padding: 14,
      alignItems: "center",
      backgroundColor: "#f2f3f7",
    },
    tabActive: { backgroundColor: colors.primary },
    tabText: { fontSize: 16, color: "#666" },
    tabTextActive: { color: "#fff", fontWeight: "600" },
  });
