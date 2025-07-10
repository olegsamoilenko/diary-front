import { RichEditor } from "react-native-pell-rich-editor";
import React, { useEffect, useRef, useState } from "react";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";
import { useTranslation } from "react-i18next";
import MarckScriptFontStylesheet from "@/assets/fonts/entry/MarckScriptFontStylesheet";
import NeuchaFontStylesheet from "@/assets/fonts/entry/NeuchaFontStylesheet";
import CaveatFontStylesheet from "@/assets/fonts/entry/CaveatFontStylesheet";
import PacificoFontStylesheet from "@/assets/fonts/entry/PacificoFontStylesheet";
import AmaticSCFontStylesheet from "@/assets/fonts/entry/AmaticSCFontStylesheet";

type TitleReachEditorProps = {
  disabledTitleReachEditor?: boolean;
  title: string;
  setTitle: (title: string) => void;
  isKeyboardOpen: boolean;
  isBoldAction: boolean;
  isItalicAction: boolean;
  colorAction: string;
  sizeAction: number;
  handleFocus: () => void;
  handleBlur: () => void;
  selectedFont: {
    name: string;
    label: string;
    css: string;
  };
  setActiveActions: (actions: (prev: any) => any) => void;
};

const sizeMap: Record<number, number> = {
  12: 2,
  16: 3,
  18: 4,
  22: 5,
  28: 6,
};

export default function TitleReachEditor({
  disabledTitleReachEditor,
  title,
  setTitle,
  isKeyboardOpen,
  isBoldAction,
  isItalicAction,
  colorAction,
  sizeAction,
  handleFocus,
  handleBlur,
  selectedFont,
  setActiveActions,
}: TitleReachEditorProps) {
  const richTitle = useRef(null);
  const [editorHeight, setEditorHeight] = useState(40);
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const { t } = useTranslation();

  const handleEditorMessage = (event: any) => {
    try {
      const msg = event;
      setActiveActions((prev) => ({ ...prev, [msg.type]: msg.value }));
    } catch {}
  };

  useEffect(() => {
    if (isKeyboardOpen) {
      // @ts-ignore
      richTitle.current?.commandDOM(
        'document.getElementsByClassName("content")[0].focus()',
      );
      // @ts-ignore
      richTitle.current?.commandDOM("document.execCommand('bold', false, '')");
      // @ts-ignore
      richTitle.current?.commandDOM(`
    (function() {
      var result = document.queryCommandState('bold');
      window.ReactNativeWebView.postMessage(JSON.stringify({ type: "isBold", value: result }));
    })()
  `);
    }
  }, [isBoldAction]);

  useEffect(() => {
    if (isKeyboardOpen) {
      // @ts-ignore
      richTitle.current?.commandDOM(
        "document.execCommand('italic', false, '')",
      );
      // @ts-ignore
      richTitle.current?.commandDOM(`
    (function() {
      var result = document.queryCommandState('italic');
      window.ReactNativeWebView.postMessage(JSON.stringify({ type: "isItalic", value: result }));
    })()
  `);
    }
  }, [isItalicAction]);

  useEffect(() => {
    // @ts-ignore
    richTitle.current?.setForeColor(colorAction);
  }, [colorAction]);

  useEffect(() => {
    // @ts-ignore
    richTitle.current?.commandDOM(
      `document.execCommand('fontSize', false, '${sizeMap[sizeAction]}');
      var fontElements = document.getElementsByTagName("font");
      for (var i = 0; i < fontElements.length; ++i) {
        if (fontElements[i].size == "7") {
          fontElements[i].removeAttribute("size");
          fontElements[i].style.fontSize = "${sizeAction}px";
        }
      }`,
    );
  }, [sizeAction]);

  useEffect(() => {
    // @ts-ignore
    richTitle.current?.commandDOM(`
    document.execCommand("fontName", false, "${selectedFont.name}");
  `);
  }, [selectedFont]);

  const onFocus = () => {
    handleFocus();
    // @ts-ignore
    richText.current?.commandDOM(`
        document.execCommand("fontName", false, "${selectedFont.name}");
      `);
  };
  return (
    <RichEditor
      disabled={disabledTitleReachEditor}
      ref={richTitle}
      initialContentHTML={title}
      onChange={setTitle}
      style={{
        minHeight: 40,
        height: editorHeight,
        maxHeight: 300,
        width: "80%",
        marginRight: 5,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
      }}
      onFocus={onFocus}
      onBlur={handleBlur}
      onHeightChange={(h) => setEditorHeight(Math.max(h, 40))}
      placeholder={t("diary.addEntryTitle")}
      editorStyle={{
        backgroundColor: "transparent",
        color: colors.text,
        initialCSSText: `
            ${MarckScriptFontStylesheet}
            ${NeuchaFontStylesheet}
            ${CaveatFontStylesheet}
            ${PacificoFontStylesheet}
            ${AmaticSCFontStylesheet}
          `,
        contentCSSText: `font-family: '${selectedFont.name}', sans-serif;`,
      }}
      onMessage={handleEditorMessage}
    />
  );
}
