import { AiComment } from "./ai";
import { ImageSourcePropType } from "react-native";
import type { Dialog } from "@/types/dialog";

export type Entry = {
  id: number;
  title: string;
  content: string;
  previewContent?: string;
  aiComment: AiComment;
  mood: string;
  embedding: number[];
  dialogs: Dialog[];
  settings?: {
    background: {
      id: number;
      type: "color" | "image";
      value?: string;
      url?: ImageSourcePropType | undefined;
    };
  };
  createdAt: Date;
  updatedAt: Date;
};
