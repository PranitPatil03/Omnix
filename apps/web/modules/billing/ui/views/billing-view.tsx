"use client";

import { useQuery } from "convex/react";
import { api } from "@workspace/backend/_generated/api";
import { PricingTable } from "../components/pricing-table";
import { ActiveSubscriptionView } from "../components/active-subscription-view";

export const BillingView = () => {
  const subscription = useQuery(api.private.subscriptions.getStatus);
  const isActive = subscription?.status === "active";

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col bg-muted/30 p-4 md:p-8">
      <div className="mx-auto w-full max-w-screen-lg">
        <div className="mb-8 space-y-2">
          <h1 className="text-2xl font-semibold md:text-3xl">Plans & Billing</h1>
          <p className="text-muted-foreground">
            {isActive
              ? "Manage your active subscription and billing details"
              : "Choose the plan that's right for you"}
          </p>
        </div>

        <div>
          {isActive ? <ActiveSubscriptionView /> : <PricingTable />}
        </div>
      </div>
    </div>
  )
}