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
    // Lower frequency to 30ms to prevent React/Markdown render freezing
    const actualSpeed = Math.max(30, speed);
    // Dynamically calculate chunk size so the whole message finishes in about 600ms max
    const totalSteps = Math.min(20, Math.ceil(content.length / 5));
    const dynamicChunkSize = Math.max(1, Math.ceil(content.length / totalSteps));

    const interval = setInterval(() => {
      i += dynamicChunkSize;
      setDisplayedLength(Math.min(content.length, i));

      if (i >= content.length) {
        clearInterval(interval);
        setIsStreaming(false);
        onComplete?.();
      }
    }, actualSpeed);

    return () => clearInterval(interval);
  }, [content, speed, onComplete]);

  return <>{children(content.slice(0, displayedLength), isStreaming)}</>;
};
