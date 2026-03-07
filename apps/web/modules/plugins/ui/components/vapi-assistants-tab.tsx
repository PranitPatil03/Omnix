"use client";

import { useState } from "react";
import {
  BotIcon,
  PlusIcon,
  Loader2Icon,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table";
import { useVapiAssistants } from "../../hooks/use-vapi-data";
import { useAction } from "convex/react";
import { api } from "@workspace/backend/_generated/api";
import { Button } from "@workspace/ui/components/button";
import { toast } from "sonner";

export const VapiAssistantsTab = () => {
  const { data: assistants, isLoading, mutate } = useVapiAssistants();
  const generateAssistant = useAction(api.private.vapi.createVoiceAssistant);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      await generateAssistant();
      toast.success("Voice assistant generated successfully using your business info!");
      mutate();
    } catch (error) {
      toast.error("Failed to generate assistant. Have you saved your business info?");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="border-t bg-background">
      <div className="flex items-center justify-between p-4 border-b">
        <div>
          <h3 className="text-sm font-medium">Your Assistants</h3>
          <p className="text-sm text-muted-foreground">Manage or generate new voice assistants</p>
        </div>
        <Button onClick={handleGenerate} disabled={isGenerating || isLoading}>
          {isGenerating ? (
            <Loader2Icon className="mr-2 size-4 animate-spin" />
          ) : (
            <PlusIcon className="mr-2 size-4" />
          )}
          Generate from Business Info
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="px-6 py-4">
              Assistant
            </TableHead>
            <TableHead className="px-6 py-4">
              Model
            </TableHead>
            <TableHead className="px-6 py-4">
              First Message
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {(() => {
            if (isLoading) {
              return (
                <TableRow>
                  <TableCell
                    colSpan={3}
                    className="px-6 py-8 text-center text-muted-foreground"
                  >
                    Loading assistants...
                  </TableCell>
                </TableRow>
              )
            }

            if (assistants.length === 0) {
              return (
                <TableRow>
                  <TableCell
                    colSpan={3}
                    className="px-6 py-8 text-center text-muted-foreground"
                  >
                    No assistants configured
                  </TableCell>
                </TableRow>
              )
            }

            return assistants.map((assistant) => (
              <TableRow className="hover:bg-muted/50" key={assistant.id}>
                <TableCell className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <BotIcon className="size-4 text-muted-foreground" />
                    <span>
                      {assistant.name || "Unnamed Assistant"}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="px-6 py-4">
                  <span className="text-sm">
                    {assistant.model?.model || "Not configured"}
                  </span>
                </TableCell>
                <TableCell className="max-w-xs px-6 py-4">
                  <p className="truncate text-muted-foreground text-sm">
                    {assistant.firstMessage || "No greeting configured"}
                  </p>
                </TableCell>
              </TableRow>
            ))
          })()}
        </TableBody>
      </Table>
    </div>
  );
};
