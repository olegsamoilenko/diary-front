import React from "react";
import { useWindowDimensions } from "react-native";
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
        const sizeNum = parseInt(size);
        // Наприклад, формула (можна налаштувати)
        style.fontSize = 10 + sizeNum * 3;
      }

      return TDefaultRenderer({ ...props, style: [props.style, style], tnode });
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
