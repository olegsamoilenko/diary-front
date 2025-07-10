import { Image } from "expo-image";
import {
  Platform,
  StyleSheet,
  Keyboard,
  Dimensions,
  KeyboardAvoidingView,
  View,
  ScrollView,
} from "react-native";

import { Collapsible } from "@/components/Collapsible";
import { ExternalLink } from "@/components/ExternalLink";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import { SafeAreaView } from "react-native-safe-area-context";
import { useColorScheme } from "@/hooks/useColorScheme";
import React, { useEffect, useRef, useState } from "react";
import { AddEntryBackgroundColors } from "@/constants/EntrySettings";

export default function Chat() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const [content, setContent] = React.useState<string>("");
  const handleHead = ({ tintColor }: { tintColor: string }) => (
    <ThemedText>H1</ThemedText>
  );

  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [editorHeight, setEditorHeight] = useState(300); // дефолт
  const richText = useRef(null);

  useEffect(() => {
    const onShow = (e) => {
      setKeyboardHeight(e.endCoordinates.height);
    };
    const onHide = () => {
      setKeyboardHeight(0);
    };
    const showSub = Keyboard.addListener("keyboardDidShow", onShow);
    const hideSub = Keyboard.addListener("keyboardDidHide", onHide);

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  useEffect(() => {
    // Розрахунок динамічної висоти редактора
    const screenHeight = Dimensions.get("window").height;
    // 200 — це приблизна висота тулбара + SafeArea + інше
    const reservedHeight = 50;
    const maxHeight = screenHeight - keyboardHeight - reservedHeight;
    if (keyboardHeight === 0) {
      setEditorHeight(300);
    } else {
      setEditorHeight(maxHeight);
    }
  }, [keyboardHeight]);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <View style={{ width: "100%", zIndex: 10500, position: "relative" }}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            flexDirection: "row",
            alignItems: "center",
            padding: 10,
            gap: 10,
          }}
        >
          {AddEntryBackgroundColors.map((color) => (
            <View
              style={{
                backgroundColor: color.value,
                width: 50,
                height: 50,
                borderRadius: 50,
              }}
              key={color.value}
            />
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: "#808080",
    bottom: -90,
    left: -35,
    position: "absolute",
  },
  titleContainer: {
    flexDirection: "row",
    gap: 8,
  },
});
