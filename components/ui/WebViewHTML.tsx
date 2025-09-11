import React, { useMemo, useState, useCallback } from "react";
import { WebView, WebViewProps } from "react-native-webview";
import { ViewStyle } from "react-native";

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

type Props = WebViewProps & {
  content: string;
  minHeight?: number;
  onAutoHeight?: (h: number) => void;
};

export default function WebViewHTML({
  content,
  style,
  minHeight = 20,
  onAutoHeight,
  ...rest
}: Props) {
  const [height, setHeight] = useState(minHeight);

  const FONTS_CSS = useMemo(
    () =>
      [
        MarckScriptFontStylesheet,
        NeuchaFontStylesheet,
        CaveatFontStylesheet,
        PacificoFontStylesheet,
        AmaticSCFontStylesheet,
        UbuntuFontStylesheet,
        RobotoFontStylesheet,
        OpenSansFontStylesheet,
        PTMonoFontStylesheet,
        ComforterBrushFontStylesheet,
        BadScriptFontStylesheet,
        YesevaOneFontStylesheet,
      ].join("\n"),
    [],
  );

  const html = useMemo(
    () => `<!doctype html>
<html>
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"/>
<style>
  html, body { margin:0; padding:0; background:transparent; -webkit-font-smoothing:antialiased; }
  * { box-sizing: border-box; }
  ${FONTS_CSS}

  b, strong { font-weight: 700; }
  i, em     { font-style: italic; }
  u         { text-decoration: underline; }
  ul, ol { margin:8px 0 8px 18px; padding:0; } li { margin:6px 0; }
</style>
</head>
<body>
  <div id="wrap" style="display:block">${content}</div>
</body>
</html>`,
    [content, FONTS_CSS],
  );

  const injected = useMemo(
    () => `
(function() {
  function h() {
    var el = document.getElementById('wrap');
    if (!el) return;
    var rect = el.getBoundingClientRect();
    var height = Math.ceil(rect.height);
    window.ReactNativeWebView && window.ReactNativeWebView.postMessage(JSON.stringify({ h: height }));
  }
  function burst() { h(); setTimeout(h,0); setTimeout(h,200); setTimeout(h,800); setTimeout(h,1600); }

  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    burst();
  } else {
    document.addEventListener('DOMContentLoaded', burst);
    window.addEventListener('load', burst);
  }

  // Якщо шрифти докачуються — оновити
  if (document.fonts && document.fonts.ready) { document.fonts.ready.then(burst).catch(function(){}) }

  // Розмір/DOM змінюється — оновити
  if (window.ResizeObserver) { new ResizeObserver(h).observe(document.getElementById('wrap')); }
  if (window.MutationObserver) {
    new MutationObserver(burst).observe(document.getElementById('wrap'), { childList:true, subtree:true, characterData:true });
  }

  // На всякий, якщо контент дуже довгий і перерахунок забарився:
  setTimeout(burst, 3000);
})();
true; // <- потрібно для Android, щоб injectedJavaScript завершився значенням
`,
    [],
  );

  const onMessage = useCallback(
    (e: any) => {
      try {
        const data = JSON.parse(e.nativeEvent.data);
        const h = Number(data?.h);
        if (Number.isFinite(h) && h > 0) setHeight(Math.max(minHeight, h));
        onAutoHeight?.(Math.max(minHeight, h));
      } catch {}
    },
    [minHeight, onAutoHeight],
  );

  return (
    <WebView
      originWhitelist={["*"]}
      source={{ html }}
      javaScriptEnabled={true}
      injectedJavaScript={injected}
      onMessage={onMessage}
      scrollEnabled={false}
      style={[
        {
          width: "100%",
          height,
          backgroundColor: "transparent",
          borderWidth: 1,
          borderColor: "red",
        } as ViewStyle,
        style,
      ]}
      {...rest}
    />
  );
}
