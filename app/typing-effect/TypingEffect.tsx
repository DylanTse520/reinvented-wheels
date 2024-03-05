"use client";

import { useEffect, useMemo, useState } from "react";

export default function TypingEffect({ sentence }: { sentence: string }) {
  const message = useMemo(() => sentence.match(/\S+\s?/g) || [], [sentence]);

  const [showCursor, setShowCursor] = useState<boolean>(true);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [currWordIndex, setCurrWordIndex] = useState(0);
  const [currCharIndex, setCurrCharIndex] = useState(-1);

  useEffect(() => {
    const interval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 500);

    return () => clearInterval(interval);
  }, [showCursor]);

  useEffect(() => {
    if (isTyping) {
      if (message[currWordIndex].length === currCharIndex + 1) {
        if (message.length !== currWordIndex + 1) {
          setIsTyping(false);
          setCurrWordIndex((prev) => prev + 1);
          setCurrCharIndex(-1);
        }
      } else {
        const timeout = setTimeout(
          () => setCurrCharIndex((prev) => prev + 1),
          Math.random() * 300 + 100
        );

        return () => clearTimeout(timeout);
      }
    } else {
      if (
        message[currWordIndex].length !== currCharIndex + 1 ||
        message.length !== currWordIndex + 1
      ) {
        const timeout = setTimeout(
          () => {
            setIsTyping(true);
          },
          Math.random() * 500 + 50
        );

        return () => clearTimeout(timeout);
      }
    }
  }, [currCharIndex, currWordIndex, isTyping, message]);

  return (
    <div className="relative flex h-6 items-center">
      <span className="whitespace-pre text-base">
        {[
          ...message.slice(0, currWordIndex),
          message[currWordIndex].slice(0, currCharIndex + 1),
        ].join("")}
      </span>
      {showCursor && (
        <div className="absolute -right-0.5 h-5 w-0.5 bg-white dark:bg-white" />
      )}
    </div>
  );
}
