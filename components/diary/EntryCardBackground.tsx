import React, { useEffect, useState } from "react";
import {
  Image,
  View,
  LayoutChangeEvent,
  Dimensions,
  StyleSheet,
} from "react-native";
import { ENTRY_BG } from "@/constants/EntrySettings";
import { BackgroundSettings } from "@/types";

type EntryCardBackgroundProps = {
  children: React.ReactNode;
  background: BackgroundSettings;
};

export default function EntryCardBackground({
  children,
  background,
}: EntryCardBackgroundProps) {
  const [contentHeight, setContentHeight] = useState<number>(0);
  const screenWidth = Dimensions.get("window").width;
  const [ratio, setRatio] = useState<number>(1);

  useEffect(() => {
    if (
      background.type === "image" &&
      background.key &&
      ENTRY_BG[background.key]
    ) {
      if (typeof ENTRY_BG[background.key] === "number") {
        const source = Image.resolveAssetSource(ENTRY_BG[background.key]);
        setRatio(source.height / source.width);
      } else if (ENTRY_BG[background.key].uri) {
        Image.getSize(
          ENTRY_BG[background.key].uri,
          (w, h) => {
            setRatio(h / w);
          },
          () => {},
        );
      }
    }
  }, [background]);

  const repeatCount = Math.ceil(contentHeight / ((screenWidth - 20) * ratio));

  if (
    background.type === "image" &&
    background.key &&
    ENTRY_BG[background.key]
  ) {
    return (
      <View
        style={{
          position: "relative",
          width: "100%",
          borderRadius: 8,
          overflow: "hidden",
          marginBottom: 20,
        }}
      >
        <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
          {Array.from({ length: repeatCount }).map((_, i) => (
            <Image
              key={i}
              source={ENTRY_BG[background.key!]}
              style={{
                width: "100%",
                height: 800,
              }}
              resizeMode="cover"
            />
          ))}
        </View>

        <View
          onLayout={(e: LayoutChangeEvent) =>
            setContentHeight(e.nativeEvent.layout.height)
          }
          style={{
            padding: 12,
          }}
        >
          {children}
        </View>
      </View>
    );
  }

  return (
    <View
      style={{
        backgroundColor: String(background.value) || "#fff",
        borderRadius: 8,
        padding: 12,
        marginBottom: 20,
      }}
    >
      {children}
    </View>
  );
}
