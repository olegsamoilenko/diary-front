import React, { useEffect, useRef, useState } from "react";
import { Animated, View, Text, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";

const dots = ["", ".", "..", "..."];

export const AILoader = () => {
  const colorScheme = useColorScheme();
  const [step, setStep] = useState(0);
  const interval = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    interval.current = setInterval(() => {
      setStep((prev) => (prev + 1) % dots.length);
    }, 500);

    return () => {
      if (interval.current) clearInterval(interval.current);
    };
  }, []);

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: Colors[colorScheme].aiCommentBackground },
      ]}
    >
      <MaterialCommunityIcons
        name="robot"
        size={22}
        color={Colors[colorScheme].primary}
        style={{ marginRight: 8 }}
      />
      <Text style={[styles.text, { color: Colors[colorScheme].text }]}>
        AI думає{dots[step]}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 18,
    paddingLeft: 8,
    paddingVertical: 6,
    marginTop: 8,
    marginBottom: 8,
    elevation: 3,
    minHeight: 40,
    minWidth: 120,
  },
  text: {
    fontSize: 16,
    fontStyle: "italic",
    fontWeight: "500",
    letterSpacing: 0.2,
  },
});
