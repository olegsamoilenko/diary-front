export enum Mood {
  AWFUL = 1,
  BAD = 2,
  MEH = 3,
  GOOD = 4,
  GREAT = 5,
}

export const MoodEmoji = [
  { label: "😀", value: "joyful" },
  { label: "😁", value: "very happy" },
  { label: "😂", value: "laughing" },
  { label: "🤣", value: "hilarious" },
  { label: "😊", value: "happy" },
  { label: "😇", value: "blessed" },
  { label: "🙂", value: "calm" },
  { label: "🙃", value: "playful" },
  { label: "😉", value: "winking" },
  { label: "😌", value: "relaxed" },
  { label: "😍", value: "in love" },
  { label: "🥰", value: "adoring" },
  { label: "😘", value: "kissing" },
  { label: "😋", value: "satisfied" },
  { label: "😎", value: "cool" },
  { label: "🤩", value: "excited" },
  { label: "🤗", value: "hugging" },
  { label: "🤔", value: "thinking" },
  { label: "😏", value: "smirking" },
  { label: "😜", value: "goofy" },
  { label: "😝", value: "playful2" },
  { label: "🤑", value: "money-minded" },
  { label: "🤠", value: "adventurous" },
  { label: "😴", value: "sleepy" },
  { label: "😪", value: "tired" },
  { label: "😒", value: "unimpressed" },
  { label: "😔", value: "disappointed" },
  { label: "😢", value: "sad" },
  { label: "😭", value: "crying" },
  { label: "😞", value: "down" },
  { label: "😟", value: "worried" },
  { label: "😕", value: "confused" },
  { label: "🙁", value: "frowning" },
  { label: "😣", value: "frustrated" },
  { label: "😖", value: "distressed" },
  { label: "😫", value: "exhausted" },
  { label: "😩", value: "overwhelmed" },
  { label: "🥺", value: "pleading" },
  { label: "😤", value: "annoyed" },
  { label: "😠", value: "angry" },
  { label: "😡", value: "furious" },
  { label: "🤬", value: "outraged" },
  { label: "😨", value: "anxious" },
  { label: "😰", value: "nervous" },
  { label: "😱", value: "shocked" },
  { label: "😳", value: "embarrassed" },
  { label: "🥶", value: "cold" },
  { label: "🥵", value: "hot" },
  { label: "🤒", value: "sick" },
  { label: "🤕", value: "hurt" },
  { label: "🤢", value: "disgusted" },
  { label: "🥳", value: "celebrating" },
];

export function getEmojiByMood(mood: string): string {
  switch (mood) {
    case "joyful":
      return "😀";
    case "very happy":
      return "😁";
    case "laughing":
      return "😂";
    case "hilarious":
      return "🤣";
    case "happy":
      return "😊";
    case "blessed":
      return "😇";
    case "calm":
      return "🙂";
    case "playful":
      return "🙃";
    case "winking":
      return "😉";
    case "relaxed":
      return "😌";
    case "in love":
      return "😍";
    case "adoring":
      return "🥰";
    case "kissing":
      return "😘";
    case "satisfied":
      return "😋";
    case "cool":
      return "😎";
    case "excited":
      return "🤩";
    case "hugging":
      return "🤗";
    case "thinking":
      return "🤔";
    case "smirking":
      return "😏";
    case "goofy":
      return "😜";
    case "playful2":
      return "😝";
    case "money-minded":
      return "🤑";
    case "adventurous":
      return "🤠";
    case "sleepy":
      return "😴";
    case "tired":
      return "😪";
    case "unimpressed":
      return "😒";
    case "disappointed":
      return "😔";
    case "sad":
      return "😢";
    case "crying":
      return "😭";
    case "down":
      return "😞";
    case "worried":
      return "😟";
    case "confused":
      return "😕";
    case "frowning":
      return "🙁";
    case "frustrated":
      return "😣";
    case "distressed":
      return "😖";
    case "exhausted":
      return "😫";
    case "overwhelmed":
      return "😩";
    case "pleading":
      return "🥺";
    case "annoyed":
      return "😤";
    case "angry":
      return "😠";
    case "furious":
      return "😡";
    case "outraged":
      return "🤬";
    case "anxious":
      return "😨";
    case "nervous":
      return "😰";
    case "shocked":
      return "😱";
    case "embarrassed":
      return "😳";
    case "cold":
      return "🥶";
    case "hot":
      return "🥵";
    case "sick":
      return "🤒";
    case "hurt":
      return "🤕";
    case "disgusted":
      return "🤢";
    case "celebrating":
      return "🥳";
    default:
      return "😊";
  }
}
