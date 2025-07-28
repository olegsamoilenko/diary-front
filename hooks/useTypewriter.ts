import { useEffect, useState, useRef } from "react";

export function useTypewriter(text: string, speed = 30) {
  const [displayed, setDisplayed] = useState("");
  const iRef = useRef(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    console.time("typewriter");
    setDisplayed("");
    iRef.current = 0;
    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      setDisplayed((prev) => {
        if (iRef.current < text.length) {
          const next = prev + text[iRef.current];
          iRef.current += 1;
          return next;
        } else {
          if (intervalRef.current) clearInterval(intervalRef.current);
          return prev;
        }
      });
    }, speed);

    console.timeEnd("typewriter");

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [text, speed]);

  return displayed;
}
