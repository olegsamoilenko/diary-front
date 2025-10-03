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
  maxLines?: number;
  minHeight?: number;
  onAutoHeight?: (h: number) => void;
  onReady?: (h: number) => void;
};

export default function WebViewHTML({
  content,
  maxLines,
  style,
  minHeight = 20,
  onAutoHeight,
  onReady,
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
  
  #outer {
  min-height: 100vh;
  display: flex;
  align-items: center;
  box-sizing: border-box;
}
  
  ${
    typeof maxLines === "number"
      ? `
  #wrap {
    display: -webkit-box;
    -webkit-line-clamp: ${maxLines};
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  `
      : ""
  }
</style>
</head>
<body>
  <div id="outer">
    <div id="wrap">${content}</div>
  </div>
</body>
</html>`,
    [content, FONTS_CSS, maxLines],
  );

  const injected = useMemo(
    () => `
(function() {
  function whenImagesReady() {
    var imgs = Array.prototype.slice.call(document.images || []);
    if (imgs.length === 0) return Promise.resolve();
    return Promise.all(imgs.map(function(img){
      return img.complete ? Promise.resolve() :
        new Promise(function(res){ img.addEventListener('load', res, {once:true}); img.addEventListener('error', res, {once:true}); });
    }));
  }
  function getH() {
    var el = document.getElementById('wrap');
    if (!el) return 0;
    return Math.ceil(el.getBoundingClientRect().height);
  }
  function post(obj) {
    try { window.ReactNativeWebView.postMessage(JSON.stringify(obj)); } catch(e){}
  }
  function measureStable() {
    return new Promise(function(resolve){
      var last=-1, same=0;
      (function tick(){
        var h=getH();
        post({ phase:'measure', h:h });
        if (h===last) same++; else same=0;
        last=h;
        if (same>=3) resolve(h); else setTimeout(tick, 100);
      })();
    });
  }

  (async function boot(){
    if (document.readyState==='loading') {
      await new Promise(function(res){ document.addEventListener('DOMContentLoaded', res, {once:true}); });
    }
    if (document.fonts && document.fonts.ready) { try { await document.fonts.ready; } catch(e){} }
    try { await whenImagesReady(); } catch(e){}

    // burst промірів, щоб батько зарезервував місце
    post({ phase:'measure', h:getH() });

    // чекаємо стабілізації розмітки
    var stableH = await measureStable();

    // показуємо контент і шлемо готовність
    document.body.style.visibility='visible';
    requestAnimationFrame(function(){
      post({ phase:'ready', h:stableH });
    });
  })();
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
        if (data?.phase === "ready") {
          onReady?.(Math.max(minHeight, h));
        }
      } catch {}
    },
    [minHeight, onAutoHeight, onReady],
  );

  return (
    <WebView
      key={String(maxLines ?? "full")}
      originWhitelist={["*"]}
      source={{ html }}
      allowFileAccess
      allowFileAccessFromFileURLs
      allowUniversalAccessFromFileURLs
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
