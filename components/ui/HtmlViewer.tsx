import React, { useState } from "react";
import { useWindowDimensions, View, Image, Platform } from "react-native";
import RenderHTML, {
  HTMLElementModel,
  HTMLContentModel,
} from "react-native-render-html";

export default function HtmlViewer({ htmlContent }: { htmlContent: string }) {
  const { width } = useWindowDimensions();
  const [ratio, setRatio] = useState<number>(1);

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
    b: ({ tnode, TDefaultRenderer, ...props }) => {
      console.log("b tag attrs:", props.style);
      return TDefaultRenderer({
        ...props,
        style: [props.style, { fontWeight: "700" }],
        tnode,
      });
    },
    // strong: ({ TDefaultRenderer, ...props }) =>
    //   TDefaultRenderer({
    //     ...props,
    //     style: [
    //       props.style,
    //       Platform.OS === "android"
    //         ? { fontFamily: "MarckScript-Bold" }
    //         : { fontWeight: "700" },
    //     ],
    //   }),
    //
    // // <i>/<em>
    // i: ({ TDefaultRenderer, ...props }) =>
    //   TDefaultRenderer({
    //     ...props,
    //     style: [
    //       props.style,
    //       Platform.OS === "android"
    //         ? { fontFamily: "MarckScript-Italic" } // Потрібен файл Italic
    //         : { fontStyle: "italic" },
    //     ],
    //   }),
    // em: ({ TDefaultRenderer, ...props }) =>
    //   TDefaultRenderer({
    //     ...props,
    //     style: [
    //       props.style,
    //       Platform.OS === "android"
    //         ? { fontFamily: "MarckScript-Italic" }
    //         : { fontStyle: "italic" },
    //     ],
    //   }),
    //
    // // <u>
    // u: ({ TDefaultRenderer, ...props }) =>
    //   TDefaultRenderer({
    //     ...props,
    //     style: [props.style, { textDecorationLine: "underline" }],
    //   }),
    img: ({ tnode }) => {
      const src = tnode.attributes?.src;
      if (src)
        Image.getSize(src, (w, h) => {
          setRatio(w / h);
        });
      if (!src) return null;
      return (
        <View
          style={{
            alignSelf: "center",
            width: "85%",
            borderRadius: 16,
            overflow: "hidden",
            marginVertical: 8,
          }}
        >
          <Image
            source={{ uri: src }}
            style={{
              alignSelf: "center",
              width: "85%",
              height: undefined,
              aspectRatio: ratio || 1,
              borderRadius: 16,
            }}
            resizeMode="cover"
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
