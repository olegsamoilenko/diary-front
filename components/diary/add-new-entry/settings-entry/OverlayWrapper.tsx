import React from "react";
import { Pressable, View, Dimensions } from "react-native";

export default function OverlayWrapper({
  children,
  onOverlayPress,
  overlayColor = "rgba(0,0,0,0.08)",
}) {
  return (
    <Pressable
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: Dimensions.get("window").width,
        height: Dimensions.get("window").height,
        zIndex: 9999,
        backgroundColor: overlayColor,
        justifyContent: "center",
        alignItems: "center",
      }}
      onPress={onOverlayPress}
    >
      {/* Не даємо "бульблити" клік через дочірній блок */}
      <Pressable
        onPress={(e) => e.stopPropagation()}
        style={
          {
            /* можеш додати стилі для свого вікна */
          }
        }
      >
        {children}
      </Pressable>
    </Pressable>
  );
}
