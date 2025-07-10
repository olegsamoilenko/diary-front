export enum Mood {
  AWFUL = 1,
  BAD = 2,
  MEH = 3,
  GOOD = 4,
  GREAT = 5,
}

export const MoodEmoji = [
  { label: "😊", value: "happy" },
  { label: "😌", value: "proud" },
  { label: "😍", value: "loved" },
  { label: "🤩", value: "fantastic" },
  { label: "😃", value: "great" },
  { label: "🤪", value: "crazy" },
  { label: "😌", value: "relaxed" },
  { label: "😡", value: "angry" },
  { label: "😈", value: "devilish" },
  { label: "😇", value: "blessed" },
  { label: "😁", value: "cheerful" },
];

export function getEmojiByMood(mood: string): string {
  switch (mood) {
    case "happy":
      return "😊";
    case "proud":
      return "😌";
    case "loved":
      return "😍";
    case "fantastic":
      return "🤩";
    case "great":
      return "😃";
    case "crazy":
      return "🤪";
    case "relaxed":
      return "😌";
    case "angry":
      return "😡";
    case "devilish":
      return "😈";
    case "blessed":
      return "😇";
    case "cheerful":
      return "😁";
    default:
      return "😊";
  }
}
