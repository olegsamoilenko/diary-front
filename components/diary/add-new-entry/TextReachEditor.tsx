import { RichEditor } from "react-native-pell-rich-editor";
import { ActivityIndicator, ScrollView, View } from "react-native";
import React, { useEffect, useRef, useState, RefObject } from "react";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";
import MarckScriptFontStylesheet from "@/assets/fonts/entry/MarckScriptFontStylesheet";
import NeuchaFontStylesheet from "@/assets/fonts/entry/NeuchaFontStylesheet";
import CaveatFontStylesheet from "@/assets/fonts/entry/CaveatFontStylesheet";
import AmaticSCFontStylesheet from "@/assets/fonts/entry/AmaticSCFontStylesheet";
import PacificoFontStylesheet from "@/assets/fonts/entry/PacificoFontStylesheet";
import UbuntuFontStylesheet from "@/assets/fonts/entry/UbuntuFontStylesheet";
import RobotoFontStylesheet from "@/assets/fonts/entry/RobotoFontStylesheet";
import OpenSansFontStylesheet from "@/assets/fonts/entry/OpenSansFontStylesheet";
import PTMonoFontStylesheet from "@/assets/fonts/entry/PTMonoFontStylesheet";
import ComforterBrushFontStylesheet from "@/assets/fonts/entry/ComforterBrushFontStylesheet";
import BadScriptFontStylesheet from "@/assets/fonts/entry/BadScriptFontStylesheet";
import YesevaOneFontStylesheet from "@/assets/fonts/entry/YesevaOneFontStylesheet";
import uuid from "react-native-uuid";

import * as ImagePicker from "expo-image-picker";
import { queueImage, prepareImageForStorage } from "@/utils";
import { useTranslation } from "react-i18next";

type TextReachEditorProps = {
  textReachEditorKey: number;
  content: string;
  setContent: (content: string) => void;
  isKeyboardOpen: boolean;
  isBoldAction: boolean;
  isItalicAction: boolean;
  isUnderlineAction: boolean;
  isBulletedListAction: boolean;
  isOrderedListAction: boolean;
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
  showImageSetting: boolean;
  setShowImageSetting: (show: boolean) => void;
  showPhotoSetting: boolean;
  setShowPhotoSetting: (show: boolean) => void;
  emoji?: string;
  counterTextEmojiRef: RefObject<number>;
};

const sizeMap: Record<number, number> = {
  12: 2,
  16: 3,
  18: 4,
  22: 5,
  28: 6,
};

export default function TextReachEditor({
  textReachEditorKey,
  content,
  setContent,
  isKeyboardOpen,
  isBoldAction,
  isItalicAction,
  isUnderlineAction,
  isBulletedListAction,
  isOrderedListAction,
  colorAction,
  sizeAction,
  handleFocus,
  handleBlur,
  selectedFont,
  setActiveActions,
  showImageSetting,
  setShowImageSetting,
  showPhotoSetting,
  setShowPhotoSetting,
  emoji,
  counterTextEmojiRef,
}: TextReachEditorProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const richText = useRef<RichEditor>(null);
  const scrollRef = useRef<ScrollView>(null);
  const [imageLoading, setImageLoading] = useState(false);
  const { t } = useTranslation();

  const handleEditorMessage = (event: any) => {
    try {
      const msg = event;
      if (msg.type === "isInsertUnorderedList" && msg.value) {
        setActiveActions((prev) => ({
          ...prev,
          [msg.type]: msg.value,
          isInsertOrderedList: false,
        }));
      } else if (msg.type === "isInsertOrderedList" && msg.value) {
        setActiveActions((prev) => ({
          ...prev,
          [msg.type]: msg.value,
          isInsertUnorderedList: false,
        }));
      } else {
        setActiveActions((prev) => ({ ...prev, [msg.type]: msg.value }));
      }
    } catch {}
  };

  useEffect(() => {
    if (isKeyboardOpen) {
      richText.current?.commandDOM(
        'document.getElementsByClassName("content")[0].focus()',
      );
      richText.current?.commandDOM("document.execCommand('bold', false, '')");
      richText.current?.commandDOM(`
    (function() {
      var result = document.queryCommandState('bold');
      window.ReactNativeWebView.postMessage(JSON.stringify({ type: "isBold", value: result }));
    })()
  `);
    }
  }, [isBoldAction]);

  useEffect(() => {
    richText.current?.insertText(emoji as string);
  }, [emoji, counterTextEmojiRef.current]);

  useEffect(() => {
    if (isKeyboardOpen) {
      richText.current?.commandDOM("document.execCommand('italic', false, '')");
      richText.current?.commandDOM(`
    (function() {
      var result = document.queryCommandState('italic');
      window.ReactNativeWebView.postMessage(JSON.stringify({ type: "isItalic", value: result }));
    })()
  `);
    }
  }, [isItalicAction]);

  useEffect(() => {
    if (isKeyboardOpen) {
      richText.current?.commandDOM(
        "document.execCommand('underline', false, '')",
      );
      richText.current?.commandDOM(`
    (function() {
      var result = document.queryCommandState('underline');
      window.ReactNativeWebView.postMessage(JSON.stringify({ type: "isUnderline", value: result }));
    })()
  `);
    }
  }, [isUnderlineAction]);

  useEffect(() => {
    if (isKeyboardOpen) {
      richText.current?.commandDOM(
        "document.execCommand('insertUnorderedList', false, '')",
      );
      richText.current?.commandDOM(`
    (function() {
      var result = document.queryCommandState('insertUnorderedList');
      window.ReactNativeWebView.postMessage(JSON.stringify({ type: "isInsertUnorderedList", value: result }));
    })()
  `);
    }
  }, [isBulletedListAction]);

  useEffect(() => {
    if (isKeyboardOpen) {
      richText.current?.commandDOM(
        "document.execCommand('insertOrderedList', false, '')",
      );
      richText.current?.commandDOM(`
    (function() {
      var result = document.queryCommandState('insertOrderedList');
      window.ReactNativeWebView.postMessage(JSON.stringify({ type: "isInsertOrderedList", value: result }));
    })()
  `);
    }
  }, [isOrderedListAction]);

  useEffect(() => {
    richText.current?.setForeColor(colorAction);
  }, [colorAction]);

  useEffect(() => {
    richText.current?.commandDOM(
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
    richText.current?.commandDOM(`
    document.execCommand("fontName", false, "${selectedFont.name}");
  `);
  }, [selectedFont]);

  const onFocus = () => {
    handleFocus();
    richText.current?.commandDOM(`
        document.execCommand("fontName", false, "${selectedFont.name}");
      `);
    setTimeout(() => {
      if (richText.current) {
        richText.current.commandDOM(
          `document.execCommand('foreColor', false, '${colorAction}')`,
        );
        richText.current?.commandDOM(
          `document.execCommand('fontSize', false, '${sizeMap[sizeAction]}');
      var fontElements = document.getElementsByTagName("font");
      for (var i = 0; i < fontElements.length; ++i) {
        if (fontElements[i].size == "7") {
          fontElements[i].removeAttribute("size");
          fontElements[i].style.fontSize = "${sizeAction}px";
        }
      }`,
        );
      }
    }, 100);
  };

  useEffect(() => {
    if (showPhotoSetting) {
      const onPressAddPhoto = async () => {
        try {
          const permissionResult =
            await ImagePicker.requestCameraPermissionsAsync();
          if (!permissionResult.granted) {
            alert("Дозвольте доступ до камери!");
            return;
          }

          let result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: false,
            quality: 1,
            base64: true,
          });

          if (!result.canceled) {
            handleImageAndPhoto(result.assets[0]);
          }

          setTimeout(() => {
            scrollRef.current?.scrollToEnd({ animated: true });
          }, 0);

          setShowPhotoSetting(false);
        } catch (error: any) {
          // TODO: Показати користувачу тоаст з помилкою.
          richText.current?.commandDOM(
            "document.execCommand('undo', false, null)",
          );
          setTimeout(() => {
            scrollRef.current?.scrollToEnd({ animated: true });
          }, 0);
          console.error("Error picking photo:", error);
          console.error("Error picking photo response:", error.response);
          console.error(
            "Error picking photo response data:",
            error.response.data,
          );
        }
        setShowPhotoSetting(false);
      };

      onPressAddPhoto();
    }
  }, [showPhotoSetting]);

  useEffect(() => {
    if (showImageSetting) {
      const onPressAddImage = async () => {
        try {
          let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: false,
            aspect: [4, 3],
            quality: 1,
            base64: true,
          });

          if (!result.canceled) {
            handleImageAndPhoto(result.assets[0]);
          }

          setTimeout(() => {
            scrollRef.current?.scrollToEnd({ animated: true });
          }, 0);

          setShowImageSetting(false);
        } catch (error: any) {
          // TODO: Показати користувачу тоаст з помилкою
          richText.current?.commandDOM(
            "document.execCommand('undo', false, null)",
          );
          setTimeout(() => {
            scrollRef.current?.scrollToEnd({ animated: true });
          }, 0);
          console.error("Error picking image:", error);
          console.error("Error picking image response:", error.response);
          console.error(
            "Error picking image response data:",
            error.response.data,
          );
          setShowImageSetting(false);
        }
      };

      onPressAddImage();
    }
  }, [showImageSetting]);

  const handleImageAndPhoto = async (result: any) => {
    setImageLoading(true);

    const picked = result.assets ? result.assets[0] : result;
    const localUri = picked.uri;
    const newUuid = uuid.v4();
    const imageId = `img-${newUuid}`;
    const anchorId = `cursor-anchor-${imageId}`;

    if (picked.base64) {
      richText.current?.insertHTML(
        `<img id="${imageId}" src="data:image/jpeg;base64,${picked.base64}" 
            style="max-width:70%;height:auto;border-radius:12px;margin:10px auto;display:block;"
             />
        <span id="${anchorId}"><br></span>`,
      );
    }

    const smallUri = await prepareImageForStorage(localUri);
    queueImage(smallUri, imageId, {
      width: picked.width,
      height: picked.height,
    });

    setImageLoading(false);

    setTimeout(() => {
      richText.current?.commandDOM(`
          (function() {
            var el = document.getElementById('${anchorId}');
            if (el) {
              var range = document.createRange();
              var sel = window.getSelection();
              range.setStart(el, 0);
              range.collapse(true);
              sel.removeAllRanges();
              sel.addRange(range);
            }
          })();
        `);

      scrollEditorToAnchor(anchorId);

      richText.current?.commandDOM(`
                (function() {
                  document.execCommand('fontName', false, "${selectedFont.name}");
                })()
              `);
      if (sizeAction) {
        richText.current?.commandDOM(
          `document.execCommand('fontSize', false, "${sizeMap[sizeAction]}");`,
        );
      }
      if (colorAction) {
        richText.current?.commandDOM(
          `document.execCommand('foreColor', false, "${colorAction}");`,
        );
      }
      if (isBoldAction) {
        richText.current?.commandDOM("document.execCommand('bold', false, '')");
      }

      if (isItalicAction) {
        richText.current?.commandDOM(
          `document.execCommand('italic', false, null);`,
        );
      }

      if (isUnderlineAction) {
        richText.current?.commandDOM(
          `document.execCommand('underline', false, null);`,
        );
      }
    }, 10);
  };

  const scrollEditorToAnchor = (anchorId: string) => {
    richText.current?.commandDOM(`
    (function(){
      var c = document.getElementsByClassName('content')[0];
      var a = document.getElementById('${anchorId}');
      if (!c || !a) return;

      var y = 0, el = a;
      while (el && el !== c) { y += el.offsetTop; el = el.offsetParent; }
      var target = Math.max(0, y - c.clientHeight + a.offsetHeight + 16); // 16px запасу
      c.scrollTo(0, target);
    })();
  `);
  };

  useEffect(() => {
    if (!isKeyboardOpen) {
      setShowImageSetting(false);
      setShowPhotoSetting(false);
    }
  }, [isKeyboardOpen]);

  return (
    <>
      <View
        style={{
          flex: 1,
          position: "relative",
        }}
      >
        <RichEditor
          key={textReachEditorKey}
          ref={richText}
          initialContentHTML={content}
          onChange={setContent}
          style={{
            flex: 1,
          }}
          onFocus={onFocus}
          onBlur={handleBlur}
          autoCapitalize="sentences"
          editorInitializedCallback={() => {}}
          placeholder={t("diary.addEntryText")}
          editorStyle={{
            backgroundColor: "transparent",
            color: "#6c6b6b",
            placeholderColor: colors.inputPlaceholder,
            initialCSSText: `
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
            div:empty { min-height: 1em; }
            div:last-child { padding-bottom: 0 !important; }
            html, body { margin:0; padding:0; height:100%; overflow:hidden; }
          `,
            contentCSSText: `font-family: '${selectedFont.name}', sans-serif; position: absolute; display: flex; 
            flex-direction: column; 
            overflow-y:auto;
            -webkit-overflow-scrolling: touch;
            min-height: 60px; top: 0; right: 0; bottom: 0 !important; left: 0;  padding-bottom: 0 !important`,
          }}
          // useContainer={true}
          onCursorPosition={(scrollY) => {
            // @ts-ignore
            scrollRef.current?.scrollTo({ y: scrollY - 30, animated: true });
          }}
          onMessage={handleEditorMessage}
        />
        {imageLoading && (
          <View
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        )}
      </View>
    </>
  );
}
