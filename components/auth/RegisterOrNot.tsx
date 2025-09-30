import Background from "@/components/Background";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";
import { TouchableOpacity, View } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import NemoryLogo from "@/components/ui/logo/NemoryLogo";
import React from "react";
import { useTranslation } from "react-i18next";
import { saveRegisterOrNot } from "@/utils/store/storage";
import { useUIStyles } from "@/hooks/useUIStyles";

type RegisterOrNotProps = {
  setShowAuthForm: (show: boolean) => void;
  setContinueWithoutRegistration: (show: boolean) => void;
  onChoice: () => void;
};
export default function RegisterOrNot({
  setShowAuthForm,
  setContinueWithoutRegistration,
  onChoice,
}: RegisterOrNotProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const { t } = useTranslation();
  const ui = useUIStyles();

  const handleRegistration = async () => {
    setShowAuthForm(true);
    onChoice();
    await saveRegisterOrNot(false);
  };

  const handleWithoutRegistration = async () => {
    setContinueWithoutRegistration(true);
    onChoice();
    setShowAuthForm(false);
    await saveRegisterOrNot(false);
  };
  return (
    <Background background={colors.backgroundImage}>
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          marginTop: 50,
          marginBottom: 20,
        }}
      >
        <NemoryLogo width={120} height={150} />
      </View>
      <View
        style={{
          marginHorizontal: 20,
        }}
      >
        <TouchableOpacity style={ui.btnPrimary} onPress={handleRegistration}>
          <ThemedText
            style={{
              color: colors.textInPrimary,
              textAlign: "center",
            }}
          >
            {t("auth.registerOrLogin")}
          </ThemedText>
        </TouchableOpacity>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <View
            style={{
              flex: 1,
              height: 1,
              backgroundColor: colors.border,
              marginRight: 8,
            }}
          ></View>
          <ThemedText
            style={{
              textAlign: "center",
              marginVertical: 16,
              color: colors.text,
            }}
          >
            {t("common.or")}
          </ThemedText>
          <View
            style={{
              flex: 1,
              height: 1,
              backgroundColor: colors.border,
              marginLeft: 8,
            }}
          ></View>
        </View>
        <TouchableOpacity
          style={ui.btnPrimary}
          onPress={handleWithoutRegistration}
        >
          <ThemedText
            style={{
              color: colors.textInPrimary,
              textAlign: "center",
            }}
          >
            {t("auth.continueWithoutRegistration")}
          </ThemedText>
        </TouchableOpacity>
        <ThemedText
          style={{
            color: colors.error,
            marginTop: 20,
          }}
        >
          {t("auth.registerOrNotDescription")}
        </ThemedText>
      </View>
    </Background>
  );
}
