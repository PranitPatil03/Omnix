"use client";

import { AISuggestion, AISuggestions } from "@workspace/ui/components/ai/suggestion";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { useThreadMessages, toUIMessages } from "@convex-dev/agent/react";
import { WidgetHeader } from "@/modules/widget/ui/components/widget-header";
import { Button } from "@workspace/ui/components/button";
import { useAtomValue, useSetAtom } from "jotai";
import { ArrowLeftIcon, MenuIcon } from "lucide-react";
import { DicebearAvatar } from "@workspace/ui/components/dicebear-avatar";
import { useInfiniteScroll } from "@workspace/ui/hooks/use-infinite-scroll";
import { InfiniteScrollTrigger } from "@workspace/ui/components/infinite-scroll-trigger";
import { contactSessionIdAtomFamily, conversationIdAtom, organizationIdAtom, screenAtom, widgetSettingsAtom } from "../../atoms/widget-atoms";
import { useAction, useQuery } from "convex/react";
import { api } from "@workspace/backend/_generated/api";
import { Form, FormField } from "@workspace/ui/components/form";
import {
  AIConversation,
  AIConversationContent,
  AIConversationScrollButton,
} from "@workspace/ui/components/ai/conversation";
import {
  AIInput,
  AIInputSubmit,
  AIInputTextarea,
  AIInputToolbar,
  AIInputTools,
} from "@workspace/ui/components/ai/input";
import {
  AIMessage,
  AIMessageContent,
} from "@workspace/ui/components/ai/message";
import { AIResponse } from "@workspace/ui/components/ai/response";
import { useMemo, useState, useEffect, useRef } from "react";

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

    return Object.keys(widgetSettings.defaultSuggestions).map((key) => {
      return widgetSettings.defaultSuggestions[
        key as keyof typeof widgetSettings.defaultSuggestions
      ];
    });
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
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!conversation || !contactSessionId) {
      return;
    }

    const messageText = values.message;
    form.reset();
    setSendError(null);

    if (conversation.status === "unresolved") {
      setIsAgentTyping(true);
    }

    try {
      await createMessage({
        threadId: conversation.threadId,
        prompt: messageText,
        contactSessionId,
      });
    } catch {
      setSendError("Could not send message. Please try again.");
    } finally {
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
          <p>Chat</p>
        </div>
        <Button
          size="icon"
          variant="transparent"
        >
          <MenuIcon />
        </Button>
      </WidgetHeader>
      <AIConversation>
        <AIConversationContent>
          <InfiniteScrollTrigger
            canLoadMore={canLoadMore}
            isLoadingMore={isLoadingMore}
            onLoadMore={handleLoadMore}
            ref={topElementRef}
          />
          {toUIMessages(messages.results ?? [])?.map((message) => {
            return (
              <AIMessage
                from={message.role === "user" ? "user" : "assistant"}
                key={message.id}
              >
                <AIMessageContent>
                  <AIResponse>{message.content}</AIResponse>
                </AIMessageContent>
                {message.role === "assistant" && (
                  <DicebearAvatar
                    imageUrl="/logo.svg"
                    seed="assistant"
                    size={32}
                  />
                )}
              </AIMessage>
            )
          })}

          {/* Typing indicator — shown while AI is generating, only after messages have loaded */}
          {isAgentTyping && messages.status !== "LoadingFirstPage" && (
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
              <DicebearAvatar
                imageUrl="/logo.svg"
                seed="assistant"
                size={32}
              />
            </AIMessage>
          )}
        </AIConversationContent>
      </AIConversation>
      {toUIMessages(messages.results ?? [])?.length === 1 && (        <AISuggestions className="flex w-full flex-col items-end p-2">
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
        <AIInput
          className="rounded-none border-x-0 border-b-0"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FormField
            control={form.control}
            disabled={conversation?.status === "resolved"}
            name="message"
            render={({ field }) => (
              <AIInputTextarea
                disabled={conversation?.status === "resolved" || isAgentTyping}
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
                    : "Type your message..."
                }
                value={field.value}
              />
            )}
          />
          <AIInputToolbar>
            <AIInputTools />
            <AIInputSubmit
              disabled={conversation?.status === "resolved" || !form.formState.isValid || isAgentTyping}
              status="ready"
              type="submit"
            />
          </AIInputToolbar>
        </AIInput>
      </Form>
    </>
  );
};
