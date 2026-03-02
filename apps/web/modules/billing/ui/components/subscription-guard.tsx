"use client";

import { useQuery } from "convex/react";
import { api } from "@workspace/backend/_generated/api";

interface SubscriptionGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const SubscriptionGuard = ({ children, fallback }: SubscriptionGuardProps) => {
  const subscription = useQuery(api.private.subscriptions.getStatus);

  const isActive = subscription?.status === "active";

  if (!isActive && fallback) {
    return <>{fallback}</>;
  }

  if (!isActive) {
    return null;
  }

  return <>{children}</>;
};
