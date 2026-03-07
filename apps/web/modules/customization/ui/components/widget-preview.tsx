"use client";

import { SendIcon } from "lucide-react";

interface WidgetPreviewProps {
  companyName: string;
  tagline: string;
  greetMessage: string;
  suggestions: string[];
}

export const WidgetPreview = ({
  companyName,
  tagline,
  greetMessage,
  suggestions,
}: WidgetPreviewProps) => {
  return (
    <div className="flex flex-col overflow-hidden rounded-xl border bg-muted shadow-lg w-[320px] h-[520px]">
      {/* Header - welcome banner */}
      <header className="bg-gradient-to-b from-primary to-[#0b63f3] px-5 py-4 text-primary-foreground">
        <h2 className="text-base font-semibold">
          Hi! Welcome to {companyName || "Your Brand"} 👋
        </h2>
        {tagline && (
          <p className="text-xs opacity-80 mt-0.5">{tagline}</p>
        )}
      </header>

      {/* Chat preview area */}
      <div className="flex flex-1 flex-col bg-background">
        {/* Greeting message bubble */}
        <div className="flex-1 p-3 space-y-2">
          <div className="flex items-center gap-1.5 mb-0.5">
            <span className="text-[10px] font-medium text-muted-foreground">
              Milo
            </span>
          </div>
          <div className="max-w-[85%] rounded-2xl rounded-tl-sm bg-muted px-3 py-2 text-sm">
            {greetMessage || "Hi! How can I help you today?"}
          </div>

          {/* Suggestion pills */}
          {suggestions.filter(Boolean).length > 0 && (
            <div className="flex flex-col items-end gap-1.5 pt-1">
              {suggestions.filter(Boolean).map((suggestion, i) => (
                <div
                  key={i}
                  className="rounded-full border bg-background px-3 py-1.5 text-xs text-muted-foreground"
                >
                  {suggestion}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Input area */}
        <div className="border-t bg-background p-2">
          <div className="flex items-center gap-2">
            <div className="flex-1 rounded-lg bg-muted/50 px-3 py-2 text-xs text-muted-foreground">
              Type your message...
            </div>
            <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <img src="/images/icons/send.png" alt="Send" className="size-3 brightness-0 invert" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
