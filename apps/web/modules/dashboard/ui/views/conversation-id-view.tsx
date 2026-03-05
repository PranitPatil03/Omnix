"use client";

import { useInfiniteScroll } from "@workspace/ui/hooks/use-infinite-scroll";
import { InfiniteScrollTrigger } from "@workspace/ui/components/infinite-scroll-trigger";
import { toUIMessages, useThreadMessages } from "@convex-dev/agent/react";
import { api } from "@workspace/backend/_generated/api";
import { Id } from "@workspace/backend/_generated/dataModel";
import { Button } from "@workspace/ui/components/button";
import { useAction, useMutation, useQuery } from "convex/react";
import { CheckIcon, CopyIcon, MoreHorizontalIcon, PencilIcon, Trash2Icon, Wand2Icon } from "lucide-react";
import {
  AIConversation,
  AIConversationContent,
  AIConversationScrollButton,
} from "@workspace/ui/components/ai/conversation";
import {
  AIInput,
  AIInputButton,
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
import { Form, FormField } from "@workspace/ui/components/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DicebearAvatar } from "@workspace/ui/components/dicebear-avatar";
import { ConversationStatusButton } from "../components/conversation-status-button";
import { useState, useMemo } from "react";
import { cn } from "@workspace/ui/lib/utils";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { toast } from "sonner";

const formSchema = z.object({
  message: z.string().min(1, "Message is required"),
});

export const ConversationIdView = ({
  conversationId,
}: {
  conversationId: Id<"conversations">,
}) => {
  const conversation = useQuery(api.private.conversations.getOne, {
    conversationId,
  });

  const messages = useThreadMessages(
    api.private.messages.getMany,
    conversation?.threadId ? { threadId: conversation.threadId } : "skip",
    { initialNumItems: 10, }
  );

  const {
    topElementRef,
    handleLoadMore,
    canLoadMore,
    isLoadingMore,
  } = useInfiniteScroll({
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

  const [isEnhancing, setIsEnhancing] = useState(false);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const enhanceResponse = useAction(api.private.messages.enhanceResponse);
  const handleEnhanceResponse = async () => {
    setIsEnhancing(true);
    const currentValue = form.getValues("message");

    try {
      const response = await enhanceResponse({ prompt: currentValue });

      form.setValue("message", response);
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
    } finally {
      setIsEnhancing(false);
    }
  }

  // Pre-fill operator input with the latest AI reply so they can edit/send it
  const handleUseAIReply = (content: string) => {
    form.setValue("message", content, { shouldValidate: true, shouldDirty: true });
    setCopiedMessageId(content);
    // Focus the textarea
    setTimeout(() => {
      document.querySelector<HTMLTextAreaElement>("[data-ai-input-textarea]")?.focus();
    }, 0);
  };

  const createMessage = useMutation(api.private.messages.create);
  const updateMessage = useMutation(api.private.messages.update);
  const removeMessage = useMutation(api.private.messages.remove);

  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);

  const handleEditStart = (messageId: string, content: string) => {
    setEditingMessageId(messageId);
    form.setValue("message", content, { shouldValidate: true, shouldDirty: true });
    setTimeout(() => {
      document.querySelector<HTMLTextAreaElement>("[data-ai-input-textarea]")?.focus();
    }, 0);
  };

  const handleEditSave = async () => {
    const content = form.getValues("message");
    if (!editingMessageId || !conversation?.threadId || !content.trim()) return;
    try {
      await updateMessage({
        messageId: editingMessageId,
        threadId: conversation.threadId,
        content: content.trim(),
      });
      setEditingMessageId(null);
      form.reset();
      toast.success("Message updated");
    } catch {
      toast.error("Failed to update message");
    }
  };

  const handleEditCancel = () => {
    setEditingMessageId(null);
    form.reset();
  };

  const handleDelete = async (messageId: string) => {
    if (!conversation?.threadId) return;
    try {
      await removeMessage({
        messageId,
        threadId: conversation.threadId,
      });
      toast.success("Message deleted");
    } catch {
      toast.error("Failed to delete message");
    }
  };

  const uiMessages = useMemo(() => toUIMessages(messages.results ?? []), [messages.results]);
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await createMessage({
        conversationId,
        prompt: values.message,
      });

      form.reset();
    } catch (error) {
      console.error(error);
    }
  };

  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const updateConversationStatus = useMutation(api.private.conversations.updateStatus);
  const handleToggleStatus = async () => {
    if (!conversation) {
      return;
    }

    setIsUpdatingStatus(true);

    let newStatus: "unresolved" | "resolved" | "escalated" | "operator_review";

    // Cycle through states: unresolved -> escalated -> resolved -> unresolved
    // operator_review -> resolved
    if (conversation.status === "unresolved") {
      newStatus = "escalated";
    } else if (conversation.status === "escalated") {
      newStatus = "resolved"
    } else if (conversation.status === "operator_review") {
      newStatus = "resolved"
    } else {
      newStatus = "unresolved"
    }

    try {
      await updateConversationStatus({
        conversationId,
        status: newStatus,
      });
    } catch (error) {
      console.error(error);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  if (conversation === undefined || messages.status === "LoadingFirstPage") {
    return <ConversationIdViewLoading />
  }

  return (
    <div className="flex h-full flex-col bg-muted">
      <header className="flex items-center justify-between border-b bg-background p-2.5">
        <Button
          size="sm"
          variant="ghost"
        >
          <MoreHorizontalIcon />
        </Button>
        {!!conversation && (
          <ConversationStatusButton
            onClick={handleToggleStatus}
            status={conversation.status}
            disabled={isUpdatingStatus}
          />
        )}
      </header>
      <AIConversation className="max-h-[calc(100vh-180px)]">
        <AIConversationContent>
          <InfiniteScrollTrigger
            canLoadMore={canLoadMore}
            isLoadingMore={isLoadingMore}
            onLoadMore={handleLoadMore}
            ref={topElementRef}
          />
          {uiMessages?.map((message) => (
            <AIMessage
              // In reverse, because we are watching from "assistant" prespective
              from={message.role === "user" ? "assistant" : "user"}
              key={message.id}
            >
              <div className="flex flex-col gap-1">
                {/* Show agent name tag for AI messages */}
                {message.role === "assistant" && (
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="text-[10px] font-medium text-muted-foreground">
                      {(message as typeof message & { agentName?: string }).agentName || "Milo"}
                    </span>
                  </div>
                )}
                <AIMessageContent>
                  <AIResponse>
                    {message.content}
                  </AIResponse>
                </AIMessageContent>
                {/* For AI messages: show action buttons below the message */}
                {message.role === "assistant" && conversation?.status !== "resolved" && (
                  <div className="flex items-center gap-1">
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-6 gap-1.5 px-2 text-xs text-muted-foreground hover:text-foreground"
                      onClick={() => handleUseAIReply(message.content as string)}
                    >
                      {copiedMessageId === message.content ? (
                        <><CheckIcon className="size-3" /> Loaded</>
                      ) : (
                        <><CopyIcon className="size-3" /> Use this reply</>
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-6 gap-1.5 px-2 text-xs text-muted-foreground hover:text-foreground"
                      onClick={() => handleEditStart(message.id, message.content as string)}
                    >
                      <PencilIcon className="size-3" /> Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-6 gap-1.5 px-2 text-xs text-destructive hover:text-destructive"
                      onClick={() => handleDelete(message.id)}
                    >
                      <Trash2Icon className="size-3" /> Delete
                    </Button>
                  </div>
                )}
              </div>
              {message.role === "user" && (
                <DicebearAvatar
                  seed={conversation?.contactSessionId ?? "user"}
                  size={32}
                />
              )}
            </AIMessage>
          ))}
        </AIConversationContent>
        <AIConversationScrollButton />
      </AIConversation>

      <div className="p-2">
        {editingMessageId && (
          <div className="flex items-center gap-2 px-3 py-1.5 mb-1 rounded-t-md bg-muted-foreground/10 text-xs text-muted-foreground">
            <PencilIcon className="size-3" />
            <span>Editing message</span>
            <button className="ml-auto hover:text-foreground" onClick={handleEditCancel}>✕</button>
          </div>
        )}
        <Form {...form}>
          <AIInput onSubmit={editingMessageId ? handleEditSave : form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              disabled={conversation?.status === "resolved"}
              name="message"
              render={({ field }) => (
                <AIInputTextarea
                  data-ai-input-textarea
                  disabled={
                    conversation?.status === "resolved" ||
                    form.formState.isSubmitting ||
                    isEnhancing
                  }
                  onChange={field.onChange}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      if (editingMessageId) {
                        handleEditSave();
                      } else {
                        form.handleSubmit(onSubmit)();
                      }
                    }
                    if (e.key === "Escape" && editingMessageId) {
                      handleEditCancel();
                    }
                  }}
                  placeholder={
                    conversation?.status === "resolved"
                      ? "This conversation has been resolved"
                      : editingMessageId
                        ? "Edit the message and press Enter to save..."
                        : "Type your response as an operator..."
                  }
                  value={field.value}
                />
              )}
            />
            <AIInputToolbar>
              <AIInputTools>
                {editingMessageId ? (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 px-2 text-xs"
                    onClick={handleEditCancel}
                  >
                    Cancel
                  </Button>
                ) : (
                  <AIInputButton
                    onClick={handleEnhanceResponse}
                    disabled={
                      conversation?.status === "resolved" ||
                      isEnhancing ||
                      !form.formState.isValid
                    }
                  >
                    <Wand2Icon />
                    {isEnhancing ? "Enhancing..." : "Enhance"}
                  </AIInputButton>
                )}
              </AIInputTools>
              {editingMessageId ? (
                <Button
                  size="sm"
                  className="h-7 px-3 text-xs"
                  disabled={!form.formState.isValid}
                  onClick={handleEditSave}
                >
                  <CheckIcon className="size-3 mr-1" /> Update
                </Button>
              ) : (
                <AIInputSubmit
                  disabled={
                    conversation?.status === "resolved" ||
                    !form.formState.isValid ||
                    form.formState.isSubmitting ||
                    isEnhancing
                  }
                  status="ready"
                  type="submit"
                />
              )}
            </AIInputToolbar>
          </AIInput>
        </Form>
      </div>
    </div>
  );
};

export const ConversationIdViewLoading = () => {
  return (
    <div className="flex h-full flex-col bg-muted">
      <header className="flex items-center justify-between border-b bg-background p-2.5">
        <Button disabled size="sm" variant="ghost">
          <MoreHorizontalIcon />
        </Button>
      </header>
      <AIConversation className="max-h-[calc(100vh-180px)]">
        <AIConversationContent>
          {Array.from({ length: 8 }, (_, index) => {
            const isUser = index % 2 === 0;
            const widths = ["w-48", "w-60", "w-72"];
            const width = widths[index % widths.length];

            return (
              <div
                className={cn(
                  "group flex w-full items-end justify-end gap-2 py-2 [&>div]:max-w-[80%]",
                  isUser ? "is-user" : "is-assistant flex-row-reverse"
                )}
                key={index}
              >
                <Skeleton className={`h-9 ${width} rounded-lg bg-neutral-200`} />
                <Skeleton className="size-8 rounded-full bg-neutral-200" />
              </div>
            );
          })}
        </AIConversationContent>
      </AIConversation>

      <div className="p-2">
        <AIInput>
          <AIInputTextarea
            disabled
            placeholder="Type your response as an operator..."
          />
          <AIInputToolbar>
            <AIInputTools />
            <AIInputSubmit disabled status="ready" />
          </AIInputToolbar>
        </AIInput>
      </div>
    </div>
  );
};
