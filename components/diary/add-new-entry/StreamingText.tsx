import React, { useEffect, useRef, useState } from "react";
import { ThemedText } from "@/components/ThemedText";
import aiStreamEmitter from "@/utils/events/eventEmitter";
import { consumeAiChunkBuffer, resetAiChunkBuffer } from "@/utils/";

type StreamingTextProps = {
  speed?: number;
  style?: any;
  onChange?: (current: string) => void;
  id: number | string;
};

export default function StreamingText({
  speed = 30,
  style,
  onChange,
  id,
}: StreamingTextProps) {
  const [displayedText, setDisplayedText] = useState("");
  const bufferRef = useRef<string[]>([]);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const bufferedChunks = consumeAiChunkBuffer(id.toString());
    bufferedChunks.forEach((chunk) => {
      bufferRef.current.push(...chunk.split(""));
    });

    const subscription = aiStreamEmitter.addListener(
      id.toString(),
      (chunk: string) => {
        bufferRef.current.push(...chunk.split(""));
      },
    );

    return () => {
      subscription.remove();
      bufferRef.current = [];
      setDisplayedText("");
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      resetAiChunkBuffer(id.toString());
    };
  }, [id]);

  useEffect(() => {
    if (intervalRef.current) return;

    intervalRef.current = setInterval(() => {
      if (bufferRef.current.length > 0) {
        setDisplayedText((prev) => {
          const next = prev + bufferRef.current.shift();
          if (onChange) onChange(next);
          return next;
        });
      }
    }, speed);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [speed]);

  return <ThemedText style={style}>{displayedText}</ThemedText>;
}
