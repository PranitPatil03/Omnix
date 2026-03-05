"use client";

import { useState, useEffect, useRef } from "react";

interface StreamingTextProps {
  content: string;
  speed?: number; // ms per character
  onComplete?: () => void;
  children: (displayedText: string, isStreaming: boolean) => React.ReactNode;
}

export const StreamingText = ({
  content,
  speed = 12,
  onComplete,
  children,
}: StreamingTextProps) => {
  const [displayedLength, setDisplayedLength] = useState(0);
  const [isStreaming, setIsStreaming] = useState(true);
  const prevContentRef = useRef<string | null>(null);

  useEffect(() => {
    // If this is the same content we already streamed, show it fully
    if (prevContentRef.current === content) {
      setDisplayedLength(content.length);
      setIsStreaming(false);
      return;
    }

    prevContentRef.current = content;
    setDisplayedLength(0);
    setIsStreaming(true);

    let i = 0;
    const interval = setInterval(() => {
      // Stream in chunks for natural feel
      const chunkSize = Math.min(3, content.length - i);
      i += chunkSize;
      setDisplayedLength(i);

      if (i >= content.length) {
        clearInterval(interval);
        setIsStreaming(false);
        onComplete?.();
      }
    }, speed);

    return () => clearInterval(interval);
  }, [content, speed, onComplete]);

  return <>{children(content.slice(0, displayedLength), isStreaming)}</>;
};
