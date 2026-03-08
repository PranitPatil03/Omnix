"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { AuthLayout } from "../layouts/auth-layout";
import { Loader2Icon } from "lucide-react";

function clearSessionCookies() {
  document.cookie = "better-auth.session_token=; path=/; max-age=0";
  document.cookie = "__Secure-better-auth.session_token=; path=/; max-age=0";
}

export const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  useEffect(() => {
    if (!isPending && !session) {
      clearSessionCookies();
      router.replace("/sign-in");
    }
  }, [isPending, session, router]);

  if (isPending) {
    return (
      <AuthLayout>
        <Loader2Icon className="size-6 animate-spin text-muted-foreground" />
      </AuthLayout>
    );
  }

  if (!session) {
    return null;
  }

  return <>{children}</>;
};
