import { RichEditor } from "react-native-pell-rich-editor";
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

export default function ViewReachEditor({ content }: { content: string }) {
  return (
    <RichEditor
      disabled={true}
      initialContentHTML={content}
      editorStyle={{
        backgroundColor: "transparent",
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
      }}
    />
  );
}
