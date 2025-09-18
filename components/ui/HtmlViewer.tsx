import React from "react";
import RenderHTML, { type RenderHTMLProps } from "react-native-render-html";
import { useWindowDimensions, Linking } from "react-native";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";

type Props = {
  htmlContent: string;
  horizontalPadding?: number;
} & Omit<RenderHTMLProps, "source" | "contentWidth">;

export default function HtmlViewer({
  htmlContent,
  horizontalPadding = 0,
  renderersProps,
  ...rest
}: Props) {
  const { width } = useWindowDimensions();
  const contentWidth = Math.max(0, width - horizontalPadding);
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];

  const tagsStyles = {
    body: { color: colors.text, fontSize: 14, lineHeight: 20 },
    h1: { fontSize: 20, fontWeight: "700", marginBottom: 2 },
    h2: { fontSize: 18, fontWeight: "700", marginBottom: 2 },
    h3: { fontSize: 16, fontWeight: "600", marginBottom: 2 },
    p: { marginBottom: 2 },
    li: { marginBottom: 2 },
    ul: { marginBottom: 2 },
    ol: { marginBottom: 2 },
    blockquote: { borderLeftWidth: 3, paddingLeft: 10, opacity: 0.9 },
    a: { textDecorationLine: "underline" },
  } as const;

  return (
    <RenderHTML
      source={{ html: htmlContent }}
      contentWidth={contentWidth}
      tagsStyles={tagsStyles}
      renderersProps={{
        img: { enableExperimentalPercentWidth: true },
        a: {
          onPress: (_evt, href) => {
            if (href) Linking.openURL(href);
          },
        },
        ...renderersProps,
      }}
      {...rest}
    />
  );
}
