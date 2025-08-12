import Background from "@/components/Background";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";
import { TouchableOpacity, View } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import NemoryLogo from "@/components/ui/logo/NemoryLogo";
import React from "react";
import { useTranslation } from "react-i18next";

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

  const handleRegistration = () => {
    setShowAuthForm(true);
    onChoice();
  };

  const handleWithoutRegistration = () => {
    setContinueWithoutRegistration(true);
    onChoice();
    setShowAuthForm(false);
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
        <TouchableOpacity
          style={{
            paddingHorizontal: 18,
            paddingVertical: 10,
            backgroundColor: colors.primary,
            borderRadius: 12,
            justifyContent: "center",
            alignItems: "center",
          }}
          onPress={handleRegistration}
        >
          <ThemedText
            style={{
              color: colors.textInPrimary,
            }}
          >
            {t("auth.register")}
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
          style={{
            paddingHorizontal: 18,
            paddingVertical: 10,
            backgroundColor: colors.primary,
            borderRadius: 12,
            justifyContent: "center",
            alignItems: "center",
          }}
          onPress={handleWithoutRegistration}
        >
          <ThemedText
            style={{
              color: colors.textInPrimary,
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
