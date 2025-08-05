import { RichEditor } from "react-native-pell-rich-editor";
import { ActivityIndicator, ScrollView, View } from "react-native";
import React, { useEffect, useRef, useState } from "react";
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
import { uploadImageToServer } from "@/utils";

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
}: TextReachEditorProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme] ?? Colors.system;
  const richText = useRef(null);
  const scrollRef = useRef(null);
  const [imageLoading, setImageLoading] = useState(false);

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
      // @ts-ignore
      richText.current?.commandDOM(
        'document.getElementsByClassName("content")[0].focus()',
      );
      // @ts-ignore
      richText.current?.commandDOM("document.execCommand('bold', false, '')");
      // @ts-ignore
      richText.current?.commandDOM(`
    (function() {
      var result = document.queryCommandState('bold');
      window.ReactNativeWebView.postMessage(JSON.stringify({ type: "isBold", value: result }));
    })()
  `);
    }
  }, [isBoldAction]);

  useEffect(() => {
    // @ts-ignore
    richText.current?.insertText(emoji);
  }, [emoji]);

  useEffect(() => {
    if (isKeyboardOpen) {
      // @ts-ignore
      richText.current?.commandDOM("document.execCommand('italic', false, '')");
      // @ts-ignore
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
      // @ts-ignore
      richText.current?.commandDOM(
        "document.execCommand('underline', false, '')",
      );
      // @ts-ignore
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
      // @ts-ignore
      richText.current?.commandDOM(
        "document.execCommand('insertUnorderedList', false, '')",
      );
      // @ts-ignore
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
      // @ts-ignore
      richText.current?.commandDOM(
        "document.execCommand('insertOrderedList', false, '')",
      );
      // @ts-ignore
      richText.current?.commandDOM(`
    (function() {
      var result = document.queryCommandState('insertOrderedList');
      window.ReactNativeWebView.postMessage(JSON.stringify({ type: "isInsertOrderedList", value: result }));
    })()
  `);
    }
  }, [isOrderedListAction]);

  useEffect(() => {
    // @ts-ignore
    richText.current?.setForeColor(colorAction);
  }, [colorAction]);

  useEffect(() => {
    // @ts-ignore
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
    // @ts-ignore
    richText.current?.commandDOM(`
    document.execCommand("fontName", false, "${selectedFont.name}");
  `);
  }, [selectedFont]);

  const onFocus = () => {
    handleFocus();
    // @ts-ignore
    richText.current?.commandDOM(`
        document.execCommand("fontName", false, "${selectedFont.name}");
      `);
    setTimeout(() => {
      if (richText.current) {
        // @ts-ignore
        richText.current.commandDOM(
          `document.execCommand('foreColor', false, '${colorAction}')`,
        );
        // @ts-ignore
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
          if (permissionResult.granted === false) {
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
            // @ts-ignore
            scrollRef.current?.scrollToEnd({ animated: true });
          }, 0);

          setShowPhotoSetting(false);
        } catch (error) {
          // TODO: Показати користувачу тоаст з помилкою.
          // @ts-ignore
          richText.current?.commandDOM(
            "document.execCommand('undo', false, null)",
          );
          setTimeout(() => {
            // @ts-ignore
            scrollRef.current?.scrollToEnd({ animated: true });
          }, 0);
          console.error("Error picking image:", error);
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
            // @ts-ignore
            scrollRef.current?.scrollToEnd({ animated: true });
          }, 0);

          setShowImageSetting(false);
        } catch (error) {
          // TODO: Показати користувачу тоаст з помилкою.
          // @ts-ignore
          richText.current?.commandDOM(
            "document.execCommand('undo', false, null)",
          );
          setTimeout(() => {
            // @ts-ignore
            scrollRef.current?.scrollToEnd({ animated: true });
          }, 0);
          console.error("Error picking image:", error);
          setShowImageSetting(false);
        }
      };

      onPressAddImage();
    }
  }, [showImageSetting]);

  async function replaceImageSrcById(id: string, newUrl: string) {
    if (!richText.current) return;

    const currentHtml = await richText.current.getContentHtml();

    const regex = new RegExp(
      `(<img[^>]*id=["']${id}["'][^>]*src=["'])[^\"]*(["'][^>]*>)`,
      "g",
    );

    const newHtml = currentHtml.replace(regex, `$1${newUrl}$2`);

    await richText.current.setContentHTML(newHtml);
  }

  const handleImageAndPhoto = async (result: any) => {
    setImageLoading(true);
    const picked = result;
    const localUri = picked.uri;
    const newUuid = uuid.v4();
    const imageId = `img-${newUuid}`;
    if (picked.base64) {
      // @ts-ignore
      richText.current?.insertHTML(
        `<img id="${imageId}" src="data:image/jpeg;base64,${picked.base64}" style="visibility:hidden;max-width:70%;height:auto;border-radius:12px;margin:10px auto;display:block;" />`,
      );
    }

    const uploaded = await uploadImageToServer(localUri);

    console.log("Uploaded image:", uploaded);

    if (uploaded && uploaded.url) {
      // @ts-ignore
      await replaceImageSrcById(imageId, uploaded.url);
      richText.current?.commandDOM(`
        (function() {
          var img = document.getElementById("${imageId}");
          if(img) img.style.visibility = "visible";
        })()
      `);
      setImageLoading(false);
      // richText.current?.insertHTML(
      //   `<img src="${uploaded.url}" style="max-width:70%;height: auto;object-fit:contain;border-radius:12px;margin:10px auto;display:block;" />`,
      // );
      setTimeout(() => {
        // @ts-ignore
        richText.current?.commandDOM(`
                (function() {
                  document.execCommand('fontName', false, "${selectedFont.name}");
                })()
              `);
        if (sizeAction) {
          // @ts-ignore
          richText.current?.commandDOM(
            `document.execCommand('fontSize', false, "${sizeMap[sizeAction]}");`,
          );
        }
        if (colorAction) {
          // @ts-ignore
          richText.current?.commandDOM(
            `document.execCommand('foreColor', false, "${colorAction}");`,
          );
        }
        if (isBoldAction) {
          // @ts-ignore
          richText.current?.commandDOM(
            "document.execCommand('bold', false, '')",
          );
        }

        if (isItalicAction) {
          // @ts-ignore
          richText.current?.commandDOM(
            `document.execCommand('italic', false, null);`,
          );
        }

        if (isUnderlineAction) {
          // @ts-ignore
          richText.current?.commandDOM(
            `document.execCommand('underline', false, null);`,
          );
        }
      }, 10);
    }
  };

  useEffect(() => {
    if (!isKeyboardOpen) {
      setShowImageSetting(false);
      setShowPhotoSetting(false);
    }
  }, [isKeyboardOpen]);

  return (
    <View
      style={{
        flex: 1,
        position: "relative",
      }}
    >
      <ScrollView ref={scrollRef} style={{ flex: 1 }}>
        <RichEditor
          key={textReachEditorKey}
          ref={richText}
          initialContentHTML={content}
          onChange={setContent}
          style={{ flex: 1, minHeight: 300 }}
          onFocus={onFocus}
          onBlur={handleBlur}
          editorInitializedCallback={() => {}}
          editorStyle={{
            backgroundColor: "transparent",
            color: "#6c6b6b",
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
          `,
            contentCSSText: `font-family: '${selectedFont.name}', sans-serif; position: absolute; display: flex; 
            flex-direction: column; 
            min-height: 200px; top: 0; right: 0; bottom: 0; left: 0;`,
          }}
          // useContainer={true}
          onCursorPosition={(scrollY) => {
            // @ts-ignore
            scrollRef.current?.scrollTo({ y: scrollY - 30, animated: true });
          }}
          onMessage={handleEditorMessage}
        />
      </ScrollView>
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
  );
}
