import React from "react";
import { useWindowDimensions, View, Image } from "react-native";
import RenderHTML, {
  HTMLElementModel,
  HTMLContentModel,
} from "react-native-render-html";

export default function HtmlViewer({ htmlContent }: { htmlContent: string }) {
  const { width } = useWindowDimensions();

  const customHTMLElementModels = {
    font: HTMLElementModel.fromCustomModel({
      tagName: "font",
      contentModel: HTMLContentModel.textual,
    }),
  };

  const getSize = (size: string | undefined): number => {
    switch (size) {
      case "1":
        return 10;
      case "2":
        return 12;
      case "3":
        return 16;
      case "4":
        return 18;
      case "5":
        return 22;
      case "6":
        return 28;
      case "7":
        return 32;
      default:
        return 16;
    }
  };

  const renderers = {
    font: ({ tnode, TDefaultRenderer, ...props }) => {
      if (!tnode || !tnode.domNode || !tnode.domNode.attribs) {
        return null;
      }
      const { color, face, size } = tnode.domNode.attribs || {};

      const style = {};

      if (color) {
        style.color = color;
      }

      if (face) {
        style.fontFamily = face;
      }

      if (size) {
        style.fontSize = getSize(size);
      }

      style.lineHeight = getSize(size) + 4;

      return TDefaultRenderer({ ...props, style: [props.style, style], tnode });
    },
    img: ({ tnode }) => {
      const src = tnode.attributes?.src;
      if (!src) return null;
      return (
        <View
          style={{
            alignSelf: "center",
            borderRadius: 16,
            overflow: "hidden",
            marginVertical: 8,
          }}
        >
          <Image
            source={{ uri: src }}
            style={{
              width: "100%",
              height: undefined,
              aspectRatio: 1.2,
              borderRadius: 16,
            }}
            resizeMode="contain"
          />
        </View>
      );
    },
  };

  return (
    <RenderHTML
      contentWidth={width}
      source={{ html: htmlContent }}
      renderers={renderers}
      customHTMLElementModels={customHTMLElementModels}
      defaultTextProps={{ selectable: true }}
    />
  );
}
