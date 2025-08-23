import React, {
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useImperativeHandle,
} from "react";
import { RichEditor } from "react-native-pell-rich-editor";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";
import { useTranslation } from "react-i18next";

import MarckScriptFontStylesheet from "@/assets/fonts/entry/MarckScriptFontStylesheet";
import NeuchaFontStylesheet from "@/assets/fonts/entry/NeuchaFontStylesheet";
import CaveatFontStylesheet from "@/assets/fonts/entry/CaveatFontStylesheet";
import PacificoFontStylesheet from "@/assets/fonts/entry/PacificoFontStylesheet";
import AmaticSCFontStylesheet from "@/assets/fonts/entry/AmaticSCFontStylesheet";
import UbuntuFontStylesheet from "@/assets/fonts/entry/UbuntuFontStylesheet";
import RobotoFontStylesheet from "@/assets/fonts/entry/RobotoFontStylesheet";
import OpenSansFontStylesheet from "@/assets/fonts/entry/OpenSansFontStylesheet";
import PTMonoFontStylesheet from "@/assets/fonts/entry/PTMonoFontStylesheet";
import ComforterBrushFontStylesheet from "@/assets/fonts/entry/ComforterBrushFontStylesheet";
import BadScriptFontStylesheet from "@/assets/fonts/entry/BadScriptFontStylesheet";
import YesevaOneFontStylesheet from "@/assets/fonts/entry/YesevaOneFontStylesheet";

type FontOption = {
  name: string;
  label: string;
  css: string;
};

export type TitleReachEditorRef = {
  reset: (opts?: {
    title?: string;
    color?: string;
    size?: number;
    fontName?: string;
  }) => void;
  insertEmoji: (emoji: string) => void;
  focus: () => void;
};

type Props = {
  disabledTitleReachEditor?: boolean;
  title: string;
  titleReachEditorKey: number;
  setTitle: (title: string) => void;
  isKeyboardOpen: boolean;
  isBoldAction: boolean;
  isItalicAction: boolean;
  colorAction: string;
  sizeAction: number;
  handleFocus: () => void;
  handleBlur: () => void;
  selectedFont: FontOption;
  setActiveActions: React.Dispatch<
    React.SetStateAction<Record<string, boolean>>
  >;
  /** залишив для зворотної сумісності; можна не передавати */
  titleEmoji?: string;
};

const sizeMap: Record<number, number> = { 12: 2, 16: 3, 18: 4, 22: 5, 28: 6 };

const TitleReachEditor = forwardRef<TitleReachEditorRef, Props>(
  function TitleReachEditor(
    {
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
      titleReachEditorKey,
      titleEmoji, // опційно, але краще користуйся ref.insertEmoji
    },
    ref,
  ) {
    const editorRef = useRef<RichEditor>(null);
    const [editorReady, setEditorReady] = useState(false);
    const [editorHeight, setEditorHeight] = useState(40);
    const [hasFocus, setHasFocus] = useState(false);

    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? "light"];
    const { t } = useTranslation();

    const initialCSS = useMemo(
      () => `
      ${MarckScriptFontStylesheet}
      ${NeuchaFontStylesheet}
      ${CaveatFontStylesheet}
      ${PacificoFontStylesheet}
      ${AmaticSCFontStylesheet}
      ${UbuntuFontStylesheet}
      ${RobotoFontStylesheet}
      ${OpenSansFontStylesheet}
      ${PTMonoFontStylesheet}
      ${ComforterBrushFontStylesheet}
      ${BadScriptFontStylesheet}
      ${YesevaOneFontStylesheet}
    `,
      [],
    );

    // ---- helpers ----
    const runJS = useCallback((code: string) => {
      // @ts-expect-error pell api
      editorRef.current?.commandDOM?.(code);
    }, []);

    const reportCommandState = useCallback(
      (cmd: "bold" | "italic") => {
        runJS(`
      (function () {
        var result = document.queryCommandState('${cmd}');
        window.ReactNativeWebView && window.ReactNativeWebView.postMessage(
          JSON.stringify({ type: "is${cmd[0].toUpperCase() + cmd.slice(1)}", value: result })
        );
      })();
    `);
      },
      [runJS],
    );

    const toggleCommand = useCallback(
      (cmd: "bold" | "italic") => {
        runJS(`document.execCommand('${cmd}', false, '');`);
        reportCommandState(cmd);
      },
      [reportCommandState, runJS],
    );

    const applyColor = useCallback(
      (color: string) => {
        runJS(`document.execCommand('foreColor', false, '${color}');`);
      },
      [runJS],
    );

    const applyFontSize = useCallback(
      (px: number) => {
        const htmlSize = sizeMap[px] ?? 3;
        runJS(`
      (function(){
        document.execCommand('fontSize', false, '${htmlSize}');
        var fontElements = document.getElementsByTagName('font');
        for (var i = 0; i < fontElements.length; ++i) {
          if (fontElements[i].size == "7") {
            fontElements[i].removeAttribute('size');
            fontElements[i].style.fontSize = "${px}px";
          }
        }
      })();
    `);
      },
      [runJS],
    );

    const applyFontFamily = useCallback(
      (fontName: string) => {
        runJS(`document.execCommand('fontName', false, "${fontName}");`);
      },
      [runJS],
    );

    const primeStyle = useCallback(
      (opts?: { color?: string; size?: number; fontName?: string }) => {
        if (!editorReady) return;
        applyFontFamily(opts?.fontName ?? selectedFont.name);
        applyColor(opts?.color ?? colorAction);
        applyFontSize(opts?.size ?? sizeAction);
      },
      [
        applyColor,
        applyFontFamily,
        applyFontSize,
        colorAction,
        editorReady,
        selectedFont.name,
        sizeAction,
      ],
    );

    // ---- imperative API ----
    useImperativeHandle(
      ref,
      () => ({
        reset: (opts) => {
          setEditorHeight(40);
          setHasFocus(false);
          // @ts-expect-error pell api
          editorRef.current?.setContentHTML?.(opts?.title ?? "");
          // скидаємо інлайнові стилі у виділеному/вмісті
          runJS(
            `document.execCommand('selectAll', false, null); document.execCommand('removeFormat', false, null);`,
          );
          // знімаємо виділення до кінця
          runJS(
            `window.getSelection && window.getSelection().collapseToEnd && window.getSelection().collapseToEnd();`,
          );
          // застосовуємо дефолт
          primeStyle({
            color: opts?.color,
            size: opts?.size,
            fontName: opts?.fontName,
          });
          // скидаємо активні стани тулбара
          setActiveActions({});
        },
        insertEmoji: (emoji: string) => {
          if (!emoji) return;
          // @ts-expect-error pell api
          editorRef.current?.focusContentEditor?.();
          // @ts-expect-error pell api
          editorRef.current?.insertText?.(emoji);
        },
        focus: () => {
          // @ts-expect-error pell api
          editorRef.current?.focusContentEditor?.();
        },
      }),
      [primeStyle, runJS, setActiveActions],
    );

    // ---- effects ----
    // bold/italic тригери
    useEffect(() => {
      if (editorReady && hasFocus && isKeyboardOpen && isBoldAction)
        toggleCommand("bold");
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isBoldAction]);

    useEffect(() => {
      if (editorReady && hasFocus && isKeyboardOpen && isItalicAction)
        toggleCommand("italic");
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isItalicAction]);

    // стилі
    useEffect(() => {
      if (editorReady && hasFocus) applyColor(colorAction);
    }, [applyColor, colorAction, editorReady, hasFocus]);
    useEffect(() => {
      if (editorReady && hasFocus) applyFontSize(sizeAction);
    }, [applyFontSize, editorReady, hasFocus, sizeAction]);
    useEffect(() => {
      if (editorReady && hasFocus) applyFontFamily(selectedFont.name);
    }, [applyFontFamily, editorReady, hasFocus, selectedFont.name]);

    // legacy: якщо все ж передаєш titleEmoji як проп — вставимо його
    useEffect(() => {
      if (!titleEmoji) return;
      // @ts-expect-error pell api
      editorRef.current?.focusContentEditor?.();
      // @ts-expect-error pell api
      editorRef.current?.insertText?.(titleEmoji);
    }, [titleEmoji]);

    const onFocus = useCallback(() => {
      setHasFocus(true);
      handleFocus();
      primeStyle();
      reportCommandState("bold");
      reportCommandState("italic");
    }, [handleFocus, primeStyle, reportCommandState]);

    const onBlur = useCallback(() => {
      setHasFocus(false);
      handleBlur();
    }, [handleBlur]);

    const onMessage = useCallback(
      (event: any) => {
        try {
          const raw =
            typeof event === "string" ? event : (event?.data ?? event);
          const msg = typeof raw === "string" ? JSON.parse(raw) : raw;
          if (msg && typeof msg === "object" && "type" in msg) {
            setActiveActions((prev) => ({
              ...prev,
              [msg.type as string]: !!msg.value,
            }));
          }
        } catch {}
      },
      [setActiveActions],
    );

    return (
      <RichEditor
        key={titleReachEditorKey}
        ref={editorRef}
        disabled={disabledTitleReachEditor}
        initialContentHTML={title}
        onChange={setTitle}
        editorInitializedCallback={() => {
          setEditorReady(true);
          primeStyle(); // застосувати одразу
        }}
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
        onBlur={onBlur}
        onHeightChange={(h) => setEditorHeight(Math.max(h ?? 40, 40))}
        placeholder={t("diary.addEntryTitle")}
        editorStyle={{
          backgroundColor: "transparent",
          placeholderColor: colors.textAdditional ?? colors.text,
          color: colors.text,
          initialCSSText: initialCSS,
          contentCSSText: `font-family: '${selectedFont.name}', sans-serif;`,
        }}
        onMessage={onMessage}
      />
    );
  },
);

export default TitleReachEditor;
