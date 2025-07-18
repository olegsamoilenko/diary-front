import React, { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import NemoryIcon from "@/components/ui/logo/NemoryIcon";

const dots = ["", ".", "..", "..."];

type AILoaderProps = {
  width?: number;
  height?: number;
  dotFontSize?: number;
};

export const AILoader = ({
  width = 25,
  height = 30,
  dotFontSize = 16,
}: AILoaderProps) => {
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
        { backgroundColor: "transparent", width: width * 1.2 },
      ]}
    >
      <NemoryIcon width={width} height={height} />
      <View
        style={{
          marginLeft: 2,
          alignItems: "flex-end",
          marginBottom: -7,
        }}
      >
        <Text
          style={[
            styles.text,
            { color: Colors[colorScheme].primary, fontSize: dotFontSize },
          ]}
        >
          {dots[step]}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "flex-end",
    borderRadius: 18,
  },
  text: {
    fontStyle: "italic",
    fontWeight: "500",
    letterSpacing: 0.2,
  },
});
