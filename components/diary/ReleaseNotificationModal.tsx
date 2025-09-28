import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";
import { ColorTheme, EPlatform } from "@/types";
import type { ReleaseNotification } from "@/types";
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Platform,
  Linking,
} from "react-native";
import ModalPortal from "@/components/ui/Modal";
import { ThemedText } from "@/components/ThemedText";
import Checkbox from "@/components/ui/Checkbox";
import * as Application from "expo-application";
import { apiRequest } from "@/utils";
import i18n from "i18next";
import HtmlViewer from "@/components/ui/HtmlViewer";

const APP_STORE_ID = "1234567890";
const ANDROID_PACKAGE = Application.applicationId;

export default function ReleaseNotificationModal() {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [checked, setChecked] = useState(false);
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const styles = useMemo(() => getStyles(colors), [colors]);
  const platform = Platform.OS;
  const build = Number(Application.nativeBuildVersion) || 0;
  const [notification, setNotification] = useState<ReleaseNotification | null>(
    null,
  );
  const lang = i18n.language || "en";

  useEffect(() => {
    (async () => {
      await fetchNotification();
    })();
  }, []);

  const fetchNotification = async () => {
    try {
      const res = await apiRequest({
        url: `/release-notifications/latest`,
        method: "POST",
        data: {
          platform,
          build,
        },
      });

      if (res.status !== 200 && res.status !== 201) {
        console.log("No data returned from server");
        return;
      }

      if (res.data) {
        setNotification(res.data);
        setShowModal(true);
      }
    } catch (err: any) {
      console.error("Error fetching release notifications:", err);
      console.error(
        "Error fetching release notifications response:",
        err.response,
      );
      console.error(
        "Error fetching release notifications response data:",
        err.response.data,
      );
    }
  };

  const htmlContent: string =
    notification?.translations?.find((tr) => tr.locale === lang)?.html ??
    "<div><p>No content available</p></div>";

  const skipThisVersion = async () => {
    try {
      const res = await apiRequest({
        url: `/release-notifications/skip-this-version`,
        method: "POST",
        data: {
          platform,
          build: notification?.build,
        },
      });

      if (res.status === 200 || res.status === 201) {
        console.log("Successfully skipped this version");
      } else {
        console.error("Failed to skip this version:", res.status);
      }
    } catch (err: any) {
      console.error("Error skipping this version:", err);
      console.error("Error skipping this version Response:", err?.response);
      console.error(
        "Error skipping this version Response data:",
        err?.response?.data,
      );
    }
  };

  const onToggle = useCallback((value: boolean) => {
    setChecked(value);
  }, []);

  useEffect(() => {
    if (showModal) return;
    if (!checked) return;
    (async () => {
      await skipThisVersion();
    })();
  }, [showModal, checked]);

  async function openStore() {
    const storeUrl = Platform.select({
      ios: `itms-apps://itunes.apple.com/app/id${APP_STORE_ID}`,
      android: `market://details?id=${ANDROID_PACKAGE}`,
    });

    const webFallback = Platform.select({
      ios: `https://apps.apple.com/app/id${APP_STORE_ID}`,
      android: `https://play.google.com/store/apps/details?id=${ANDROID_PACKAGE}`,
    });

    try {
      if (storeUrl && (await Linking.canOpenURL(storeUrl))) {
        await Linking.openURL(storeUrl);
        return;
      }
    } catch {
      // ігноруємо — підемо у фолбек
    }
    if (webFallback) await Linking.openURL(webFallback);
  }
  return (
    <ModalPortal visible={showModal} onClose={() => setShowModal(false)}>
      <View
        style={{
          marginBottom: 20,
        }}
      >
        <HtmlViewer htmlContent={htmlContent} />
      </View>
      <View
        style={{
          marginBottom: 20,
        }}
      >
        <Checkbox
          checked={checked}
          onChange={onToggle}
          label={t("releaseNotify.skipThisVersion")}
        />
      </View>
      <View
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 10,
          width: "95%",
        }}
      >
        <TouchableOpacity style={styles.btn} onPress={() => openStore()}>
          <ThemedText
            style={{
              color: colors.textInPrimary,
              textAlign: "center",
            }}
          >
            {platform === EPlatform.ANDROID
              ? t("releaseNotify.goToPlayMarket")
              : t("releaseNotify.goToAppStore")}
          </ThemedText>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.btn,
            {
              backgroundColor: "transparent",
              borderWidth: 1,
              borderColor: colors.border,
            },
          ]}
          onPress={() => setShowModal(false)}
        >
          <ThemedText
            style={{
              color: colors.text,
              textAlign: "center",
            }}
          >
            {t("common.close")}
          </ThemedText>
        </TouchableOpacity>
      </View>
    </ModalPortal>
  );
}

const getStyles = (colors: ColorTheme) =>
  StyleSheet.create({
    btn: {
      paddingHorizontal: 18,
      paddingVertical: 10,
      backgroundColor: colors.primary,
      borderRadius: 12,
      textAlign: "center",
    },
  });
