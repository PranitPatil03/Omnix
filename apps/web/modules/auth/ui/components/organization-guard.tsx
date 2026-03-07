"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  useSession,
  useActiveOrganization,
  useListOrganizations,
  organization,
} from "@/lib/auth-client";
import { AuthLayout } from "@/modules/auth/ui/layouts/auth-layout";
import { Loader2Icon } from "lucide-react";

export const OrganizationGuard = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const router = useRouter();
  const { data: session } = useSession();
  const { data: activeOrg, isPending: orgPending } = useActiveOrganization();
  const { data: orgs, isPending: listPending } = useListOrganizations();
  const settingActiveRef = useRef(false);

  // No orgs at all → send to onboarding to create one
  useEffect(() => {
    if (session && !listPending && orgs && orgs.length === 0) {
      router.replace("/onboarding");
    }
  }, [session, listPending, orgs, router]);

  // Orgs exist but none active → silently activate the first
  useEffect(() => {
    if (
      session &&
      !activeOrg &&
      !orgPending &&
      !listPending &&
      orgs &&
      orgs.length > 0 &&
      !settingActiveRef.current
    ) {
      // Prevent reload loop: if we already attempted activation recently, skip
      const lastAttempt = sessionStorage.getItem("org_activation_attempt");
      if (lastAttempt && Date.now() - parseInt(lastAttempt) < 5000) {
        return;
      }

      settingActiveRef.current = true;
      sessionStorage.setItem("org_activation_attempt", Date.now().toString());

      // Prefer the org saved in cookie, otherwise use the first
      const cookieOrgId = document.cookie
        .split("; ")
        .find((row) => row.startsWith("active_organization_id="))
        ?.split("=")[1];
      const targetOrg = (cookieOrgId && orgs.find((o) => o.id === cookieOrgId)) || orgs[0]!;

      organization
        .setActive({ organizationId: targetOrg.id })
        .then(() => {
          document.cookie = `active_organization_id=${targetOrg.id};path=/;max-age=${60 * 60 * 24 * 365}`;
          window.location.reload();
        })
        .finally(() => {
          settingActiveRef.current = false;
        });
    }
  }, [session, activeOrg, orgPending, listPending, orgs]);

  // Show spinner while we're resolving the org state
  if (orgPending || listPending || (session && orgs && orgs.length > 0 && !activeOrg)) {
    return (
      <AuthLayout>
        <Loader2Icon className="size-6 animate-spin text-muted-foreground" />
      </AuthLayout>
    );
  }

  // If no orgs, useEffect above will redirect — render nothing here
  if (!orgs || orgs.length === 0) {
    return (
      <AuthLayout>
        <Loader2Icon className="size-6 animate-spin text-muted-foreground" />
      </AuthLayout>
    );
  }

  return <>{children}</>;
};
