export type AiComment = {
  aiModel: AiModel;
  content: string;
};

export enum AiModel {
  GPT_5 = "gpt-5",
  GPT_4_1 = "gpt-4.1",
  GPT_4_O = "gpt-4o",
  GPT_4_TURBO = "gpt-4-turbo",
}
