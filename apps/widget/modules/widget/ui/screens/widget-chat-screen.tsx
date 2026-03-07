"use client";

import { AISuggestion, AISuggestions } from "@workspace/ui/components/ai/suggestion";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { useThreadMessages, toUIMessages } from "@convex-dev/agent/react";
import { WidgetHeader } from "@/modules/widget/ui/components/widget-header";
import { Button } from "@workspace/ui/components/button";
import { useAtomValue, useSetAtom } from "jotai";
import { ArrowLeftIcon, UserIcon, CheckCircleIcon } from "lucide-react";
import { useInfiniteScroll } from "@workspace/ui/hooks/use-infinite-scroll";
import { InfiniteScrollTrigger } from "@workspace/ui/components/infinite-scroll-trigger";
import { contactSessionIdAtomFamily, conversationIdAtom, organizationIdAtom, screenAtom, widgetSettingsAtom } from "../../atoms/widget-atoms";
import { useAction, useMutation, useQuery } from "convex/react";
import { api } from "@workspace/backend/_generated/api";
import { Form, FormField } from "@workspace/ui/components/form";
import {
  AIConversation,
  AIConversationContent,
} from "@workspace/ui/components/ai/conversation";
import {
  AIInputTextarea,
} from "@workspace/ui/components/ai/input";
import {
  AIMessage,
  AIMessageContent,
} from "@workspace/ui/components/ai/message";
import { AIResponse } from "@workspace/ui/components/ai/response";
import { useMemo, useState, useEffect, useRef, useCallback } from "react";

/** Parse [suggestion] lines from AI message content and return { text, suggestions } */
function parseSuggestions(content: string): { text: string; suggestions: string[] } {
  const lines = content.split("\n");
  const suggestions: string[] = [];
  const textLines: string[] = [];

  for (const line of lines) {
    const match = line.match(/^\[suggestion\]\s*(.+)/);
    if (match && match[1]) {
      suggestions.push(match[1].trim());
    } else {
      textLines.push(line);
    }
  }

  return { text: textLines.join("\n").trimEnd(), suggestions };
}

/** Check if a message is a system notification (prefixed with [system]) */
function isSystemMessage(content: string): boolean {
  return content.startsWith("[system]") || content.startsWith("[system:");
}

/** Get the type of system message: 'escalated', 'ended', or 'generic' */
function getSystemType(content: string): "escalated" | "ended" | "generic" {
  if (content.startsWith("[system:escalated]")) return "escalated";
  if (content.startsWith("[system:ended]")) return "ended";
  return "generic";
}

/** Strip the [system] or [system:*] prefix from message content */
function getSystemText(content: string): string {
  return content.replace(/^\[system(?::\w+)?\]\s*/, "");
}

const formSchema = z.object({
  message: z.string().min(1, "Message is required"),
});

export const WidgetChatScreen = () => {
  const setScreen = useSetAtom(screenAtom);
  const setConversationId = useSetAtom(conversationIdAtom);

  const widgetSettings = useAtomValue(widgetSettingsAtom);
  const conversationId = useAtomValue(conversationIdAtom);
  const organizationId = useAtomValue(organizationIdAtom);
  const contactSessionId = useAtomValue(
    contactSessionIdAtomFamily(organizationId || "")
  );

  const onBack = () => {
    setConversationId(null);
    setScreen("selection");
  };

  const suggestions = useMemo(() => {
    if (!widgetSettings) {
      return [];
    }

    return widgetSettings.defaultSuggestions || [];
  }, [widgetSettings]);

  const conversation = useQuery(
    api.public.conversations.getOne,
    conversationId && contactSessionId
      ? {
        conversationId,
        contactSessionId,
      }
      : "skip"
  );

  const messages = useThreadMessages(
    api.public.messages.getMany,
    conversation?.threadId && contactSessionId
      ? {
        threadId: conversation.threadId,
        contactSessionId,
      }
      : "skip",
    { initialNumItems: 10 },
  );

  const { topElementRef, handleLoadMore, canLoadMore, isLoadingMore } = useInfiniteScroll({
    status: messages.status,
    loadMore: messages.loadMore,
    loadSize: 10,
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: "",
    },
  });

  const [isAgentTyping, setIsAgentTyping] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const prevMessageCount = useRef(0);
  const waitingForUserMessage = useRef(false);

  const uiMessages = useMemo(() => toUIMessages(messages.results ?? []), [messages.results]);

  // Detect when new messages arrive in the list
  useEffect(() => {
    if (!uiMessages.length) return;
    const currentCount = uiMessages.length;
    const lastMessage = uiMessages[uiMessages.length - 1];

    if (currentCount > prevMessageCount.current) {
      if (lastMessage && lastMessage.role === "user" && waitingForUserMessage.current) {
        // User's message just appeared in the list — now show typing indicator
        waitingForUserMessage.current = false;
        setIsAgentTyping(true);
      } else if (lastMessage && lastMessage.role === "assistant" && isAgentTyping) {
        // AI response row created — step 1 of streaming
        setIsAgentTyping(false);
      }
    }

    prevMessageCount.current = currentCount;
  }, [uiMessages, isAgentTyping]);

  // Auto-clear send errors after 5 seconds
  const errorTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (sendError) {
      errorTimerRef.current = setTimeout(() => setSendError(null), 5000);
    }
    return () => {
      if (errorTimerRef.current) clearTimeout(errorTimerRef.current);
    };
  }, [sendError]);

  const createMessage = useAction(api.public.messages.create);
  const updateConversationStatus = useMutation(api.public.conversations.updateStatus);

  const handleConnectToHuman = async () => {
    if (!conversationId || !contactSessionId) return;
    try {
      await updateConversationStatus({
        conversationId,
        contactSessionId,
        status: "escalated",
      });
    } catch {
      setSendError("Could not connect to a human agent.");
    }
  };

  const handleEndConversation = async () => {
    if (!conversationId || !contactSessionId) return;
    try {
      await updateConversationStatus({
        conversationId,
        contactSessionId,
        status: "operator_review",
      });
      // Close the widget via postMessage to parent (embed)
      window.parent.postMessage({ type: "close" }, "*");
    } catch {
      setSendError("Could not end conversation.");
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!conversation || !contactSessionId) {
      return;
    }

    const messageText = values.message;
    form.reset();
    setSendError(null);

    // Mark that we're waiting for the user message to appear before showing typing
    if (conversation.status === "unresolved") {
      waitingForUserMessage.current = true;
    }

    try {
      await createMessage({
        threadId: conversation.threadId,
        prompt: messageText,
        contactSessionId,
      });
    } catch {
      setSendError("Could not send message. Please try again.");
      waitingForUserMessage.current = false;
      setIsAgentTyping(false);
    }
  };

  return (
    <>
      <WidgetHeader className="flex items-center justify-between">
        <div className="flex items-center gap-x-2">
          <Button
            onClick={onBack}
            size="icon"
            variant="transparent"
          >
            <ArrowLeftIcon />
          </Button>
          <p className="font-medium">Chat</p>
        </div>
      </WidgetHeader>
      <AIConversation>
        <AIConversationContent>
          <InfiniteScrollTrigger
            canLoadMore={canLoadMore}
            isLoadingMore={isLoadingMore}
            onLoadMore={handleLoadMore}
            ref={topElementRef}
          />
          {uiMessages?.map((message, index) => {
            const contentStr = message.content as string;
            const isLastMessage = index === uiMessages.length - 1;

            // System messages (escalation/end) — render as normal chat message without suggestions
            if (message.role === "assistant" && isSystemMessage(contentStr)) {
              return (
                <div key={message.id}>
                  <AIMessage from="assistant">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="text-[10px] font-medium text-muted-foreground">
                        {(message as typeof message & { agentName?: string }).agentName || "Milo"}
                      </span>
                    </div>
                    <AIMessageContent>
                      <AIResponse>{getSystemText(contentStr)}</AIResponse>
                    </AIMessageContent>
                  </AIMessage>
                </div>
              );
            }

            // Skip rendering empty assistant bubbles — they represent the "typing" state before streaming starts
            if (message.role === "assistant" && (!contentStr || contentStr.trim().length === 0)) {
              return null;
            }

            // Parse suggestions from assistant messages
            const parsed = message.role === "assistant"
              ? parseSuggestions(contentStr)
              : { text: contentStr, suggestions: [] };

            return (
              <div key={message.id}>
                <AIMessage
                  from={message.role === "user" ? "user" : "assistant"}
                >
                  {message.role === "assistant" && (
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="text-[10px] font-medium text-muted-foreground">
                        {(message as typeof message & { agentName?: string }).agentName || "Milo"}
                      </span>
                    </div>
                  )}
                  <AIMessageContent>
                    <AIResponse>{parsed.text}</AIResponse>
                  </AIMessageContent>
                </AIMessage>

                {/* Follow-up suggestions + End conversation — after AI messages, only on last message */}
                {message.role === "assistant" &&
                  isLastMessage &&
                  index > 0 &&
                  conversation?.status === "unresolved" && (
                    <div className="flex flex-col items-start gap-1.5 px-3 py-2">
                      <div className="flex flex-wrap gap-1.5">
                        {parsed.suggestions.map((suggestion) => (
                          <button
                            key={suggestion}
                            type="button"
                            className="rounded-full border border-border bg-background px-3 py-1 text-[11px] text-foreground hover:bg-muted transition-colors cursor-pointer whitespace-normal text-left"
                            onClick={() => {
                              form.setValue("message", suggestion, {
                                shouldValidate: true,
                                shouldDirty: true,
                                shouldTouch: true,
                              });
                              form.handleSubmit(onSubmit)();
                            }}
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                      <div className="flex flex-wrap items-center gap-2 mt-1">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 gap-1.5 px-3 text-[11px]"
                          onClick={handleConnectToHuman}
                        >
                          <UserIcon className="size-3" />
                          Talk to a human
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 gap-1.5 px-3 text-[11px]"
                          onClick={handleEndConversation}
                        >
                          <CheckCircleIcon className="size-3" />
                          End conversation
                        </Button>
                      </div>
                    </div>
                  )}
              </div>
            )
          })}

          {/* Typing indicator — shown while AI is generating (meaning an empty assistant message exists or we are waiting for one) */}
          {(isAgentTyping || (uiMessages.length > 0 && uiMessages[uiMessages.length - 1]!.role === "assistant" && (!uiMessages[uiMessages.length - 1]!.content || (uiMessages[uiMessages.length - 1]!.content as string).trim().length === 0))) && messages.status !== "LoadingFirstPage" && (
            <AIMessage from="assistant">
              <AIMessageContent>
                <div className="flex items-center gap-1.5 px-1 py-1">
                  <span
                    className="size-2 rounded-full bg-current opacity-70 animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  />
                  <span
                    className="size-2 rounded-full bg-current opacity-70 animate-bounce"
                    style={{ animationDelay: "160ms" }}
                  />
                  <span
                    className="size-2 rounded-full bg-current opacity-70 animate-bounce"
                    style={{ animationDelay: "320ms" }}
                  />
                </div>
              </AIMessageContent>
            </AIMessage>
          )}
        </AIConversationContent>
      </AIConversation>
      {uiMessages?.length === 1 && (<AISuggestions className="flex w-full flex-col items-end p-2">
        {suggestions.map((suggestion) => {
          if (!suggestion) {
            return null;
          }

          return (
            <AISuggestion
              key={suggestion}
              onClick={() => {
                form.setValue("message", suggestion, {
                  shouldValidate: true,
                  shouldDirty: true,
                  shouldTouch: true,
                });
                form.handleSubmit(onSubmit)();
              }}
              suggestion={suggestion}
            />
          )
        })}
      </AISuggestions>
      )}

      <Form {...form}>
        {sendError && (
          <div className="px-3 py-2 text-xs text-red-600 bg-red-50 border-t border-red-100">
            {sendError}
          </div>
        )}
        <div className="border-t bg-background p-2">
          <div className="flex items-start gap-2">
            <FormField
              control={form.control}
              disabled={conversation?.status === "resolved" || conversation?.status === "operator_review"}
              name="message"
              render={({ field }) => (
                <AIInputTextarea
                  className="min-h-[40px] max-h-[120px] flex-1 resize-none border-0 bg-transparent p-2 text-sm shadow-none focus-visible:ring-0"
                  disabled={conversation?.status === "resolved" || conversation?.status === "operator_review" || isAgentTyping}
                  onChange={field.onChange}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      if (!isAgentTyping) form.handleSubmit(onSubmit)();
                    }
                  }}
                  placeholder={
                    conversation?.status === "resolved"
                      ? "This conversation has been resolved."
                      : conversation?.status === "operator_review"
                        ? "This conversation is under review."
                        : "Type your message..."
                  }
                  value={field.value}
                />
              )}
            />
            <Button
              className="mt-1 size-8 shrink-0 rounded-lg"
              disabled={conversation?.status === "resolved" || conversation?.status === "operator_review" || !form.formState.isValid || isAgentTyping}
              onClick={form.handleSubmit(onSubmit)}
              size="icon"
              type="submit"
            >
              <img src="/images/icons/send.png" alt="Send" className="size-4 brightness-0 invert" />
            </Button>
          </div>
        </div>
      </Form>
    </>
  );
};
