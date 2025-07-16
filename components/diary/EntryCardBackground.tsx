import React, { useEffect, useState } from "react";
import {
  Image,
  ImageBackground,
  ScrollView,
  View,
  LayoutChangeEvent,
} from "react-native";

export default function EntryCardBackground({ children, background }) {
  const [imageHeight, setImageHeight] = useState<number | null>(null);
  const [contentHeight, setContentHeight] = useState<number>(0);

  // 1. Дізнаємося висоту картинки
  useEffect(() => {
    if (background.type === "image" && background.url) {
      if (typeof background.url === "number") {
        // local require
        const source = Image.resolveAssetSource(background.url);
        setImageHeight(source.height);
      } else if (background.url.uri) {
        // remote
        Image.getSize(
          background.url.uri,
          (w, h) => setImageHeight(h),
          () => {},
        );
      }
    }
  }, [background]);

  // 2. Якщо картинка, обгортаємо
  if (background.type === "image" && background.url && imageHeight) {
    return (
      <ImageBackground
        source={background.url}
        style={{
          width: "100%",
          minHeight: 100,
          overflow: "hidden",
          marginBottom: 20,
          borderRadius: 8,
        }}
        resizeMode="cover"
      >
        <View
          style={{
            width: "100%",
            flex: 1,
          }}
        >
          <View
            onLayout={(e: LayoutChangeEvent) =>
              setContentHeight(e.nativeEvent.layout.height)
            }
          >
            {children}
          </View>
        </View>
      </ImageBackground>
    );
  }

  return (
    <View
      style={{
        // flex: 1,
        backgroundColor: String(background.value) || "#fff",
        marginBottom: 20,
        borderRadius: 8,
      }}
    >
      {children}
    </View>
  );
}
