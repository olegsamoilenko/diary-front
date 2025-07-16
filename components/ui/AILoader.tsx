import React, { useEffect, useRef, useState } from "react";
import { Animated, View, Text, StyleSheet, Image } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import NemoryIcon from "@/components/ui/logo/NemoryIcon";

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
    <View style={[styles.container, { backgroundColor: "transparent" }]}>
      <NemoryIcon width={25} height={30} />
      <Text style={[styles.text, { color: Colors[colorScheme].primary }]}>
        {dots[step]}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "flex-end",
    borderRadius: 18,
    paddingLeft: 30,
    paddingVertical: 6,
    marginTop: 8,
  },
  text: {
    fontSize: 16,
    fontStyle: "italic",
    fontWeight: "500",
    letterSpacing: 0.2,
  },
});
