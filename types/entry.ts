import { ImageSourcePropType } from "react-native";
import type { Dialog } from "@/types/dialog";
import type { EntryImage, AiComment } from "@/types";

export type Entry = {
  id: number;
  title: string;
  content: string;
  previewContent?: string;
  aiComment: AiComment;
  mood: string;
  embedding: number[];
  images: EntryImage[];
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
