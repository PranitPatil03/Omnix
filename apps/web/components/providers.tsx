"use client"

import * as React from "react"
import { ConvexProviderWithAuth, ConvexReactClient } from "convex/react";
import type { ReactNode } from "react";
import { useSession } from "@/lib/auth-client";

if (!process.env.NEXT_PUBLIC_CONVEX_URL) {
  throw new Error('Missing NEXT_PUBLIC_CONVEX_URL in your .env file')
}

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL || "");

function useBetterAuthFromConvex() {
  const { data: session, isPending } = useSession();

  const fetchAccessToken = React.useCallback(
    async ({ forceRefreshToken }: { forceRefreshToken: boolean }) => {
      if (!session) return null;
      try {
        // Fetch JWT token from better-auth's JWT plugin endpoint
        const response = await fetch("/api/auth/token", {
          method: "POST",
          credentials: "include",
        });
        if (!response.ok) return null;
        const data = await response.json();
        return data.token ?? null;
      } catch {
        return null;
      }
    },
    [session],
  );

  return React.useMemo(
    () => ({
      isLoading: isPending,
      isAuthenticated: !!session,
      fetchAccessToken,
    }),
    [isPending, session, fetchAccessToken],
  );
}

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ConvexProviderWithAuth client={convex} useAuth={useBetterAuthFromConvex}>
      {children}
    </ConvexProviderWithAuth>
  );
};
