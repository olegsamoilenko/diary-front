import React from "react";
import { ImageBackground, View } from "react-native";

import type { BackgroundSettings } from "@/types";

type EntryCardBackgroundProps = {
  children: React.ReactNode;
  background: BackgroundSettings;
  paddingTop?: number;
};
export default function Background({
  children,
  background,
  paddingTop = 0,
}: EntryCardBackgroundProps) {
  console.log("Background component rendered with background:", background);
  if (background.type === "image" && background.url) {
    return (
      <ImageBackground
        source={background.url}
        style={{
          width: "100%",
          height: "100%",
        }}
        resizeMode="cover"
      >
        <View
          style={{
            width: "100%",
            height: "100%",
            flex: 1,
            paddingTop: paddingTop,
          }}
        >
          {children}
        </View>
      </ImageBackground>
    );
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: String(background.value) || "#fff",
        paddingTop: paddingTop,
      }}
    >
      {children}
    </View>
  );
}
