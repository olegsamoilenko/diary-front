import React, { useEffect, useState, useRef } from "react";
import { ThemedText } from "@/components/ThemedText";

type TypewriterTextProps = {
  text: string;
  speed?: number;
  style?: any;
  onChange?: (current: string) => void;
};

export default function TypewriterText({
  text,
  speed = 30,
  style,
  onChange,
}: TypewriterTextProps) {
  const [displayed, setDisplayed] = useState("");
  const iRef = useRef(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    setDisplayed("");
    iRef.current = 0;
    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      setDisplayed((prev) => {
        if (iRef.current < text.length) {
          const next = prev + text[iRef.current];
          iRef.current += 1;
          if (onChange) onChange(next);
          return next;
        } else {
          if (intervalRef.current) clearInterval(intervalRef.current);
          return prev;
        }
      });
    }, speed);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [text, speed]);

  return <ThemedText style={style}>{displayed}</ThemedText>;
}
