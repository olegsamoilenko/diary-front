import { useTypewriter } from "@/hooks/useTypewriter";
import { ThemedText } from "@/components/ThemedText";
import React, { useEffect } from "react";

type TypewriterAIResponseProps = {
  response: string;
  style?: object;
  speed?: number;
  setIdx?: React.Dispatch<React.SetStateAction<number>>;
};
export default function TypewriterAIResponse({
  response,
  style,
  speed = 30,
  setIdx = () => {},
}: TypewriterAIResponseProps) {
  const animatedText = useTypewriter(response, speed);

  useEffect(() => {
    setIdx((prev) => prev + 1);
  }, [animatedText]);

  return <ThemedText style={style}>{animatedText}</ThemedText>;
}
