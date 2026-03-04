"use client";

import { api } from "@workspace/backend/_generated/api";
import { useQuery } from "convex/react";
import { Loader2Icon } from "lucide-react";
import { BusinessInfoForm } from "../components/business-info-form";

export const BusinessInfoView = () => {
  const businessInfo = useQuery(api.private.businessInfo.getOne);

  const isLoading = businessInfo === undefined;

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-y-2 bg-muted p-8">
        <Loader2Icon className="text-muted-foreground animate-spin" />
        <p className="text-muted-foreground text-sm">Loading business info...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-muted p-8">
      <div className="max-w-screen-md mx-auto w-full">
        <div className="space-y-2">
          <h1 className="text-2xl md:text-4xl">Business Information</h1>
          <p className="text-muted-foreground">
            Provide information about your business so the AI assistant can give accurate, personalized answers to your customers
          </p>
        </div>

        <div className="mt-8">
          <BusinessInfoForm initialData={businessInfo} />
        </div>
      </div>
    </div>
  );
};
