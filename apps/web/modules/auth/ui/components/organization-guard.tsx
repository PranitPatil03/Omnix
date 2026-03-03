"use client";

import { useEffect, useRef } from "react";
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
  const { data: session } = useSession();
  const { data: activeOrg, isPending: orgPending } = useActiveOrganization();
  const { data: orgs, isPending: listPending } = useListOrganizations();
  const creatingRef = useRef(false);

  useEffect(() => {
    // If we have a session, no active org, orgs list loaded, and no orgs exist → auto-create
    if (
      session &&
      !activeOrg &&
      !listPending &&
      orgs &&
      orgs.length === 0 &&
      !creatingRef.current
    ) {
      creatingRef.current = true;
      const userName = session.user.name || session.user.email?.split("@")[0] || "My";
      const orgName = `${userName}'s Organization`;
      const slug = orgName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");

      organization
        .create({ name: orgName, slug })
        .then(async (res) => {
          if (res.data) {
            await organization.setActive({ organizationId: res.data.id });
            document.cookie = `active_organization_id=${res.data.id};path=/;max-age=${60 * 60 * 24 * 365}`;
          }
        })
        .finally(() => {
          creatingRef.current = false;
        });
    }
  }, [session, activeOrg, listPending, orgs]);

  // If orgs exist but none is active, pick the first one
  useEffect(() => {
    if (
      session &&
      !activeOrg &&
      !listPending &&
      orgs &&
      orgs.length > 0 &&
      !creatingRef.current
    ) {
      const firstOrg = orgs[0]!;
      organization
        .setActive({ organizationId: firstOrg.id })
        .then(() => {
          document.cookie = `active_organization_id=${firstOrg.id};path=/;max-age=${60 * 60 * 24 * 365}`;
        });
    }
  }, [session, activeOrg, listPending, orgs]);

  if (orgPending || listPending || !activeOrg) {
    return (
      <AuthLayout>
        <Loader2Icon className="size-6 animate-spin text-muted-foreground" />
      </AuthLayout>
    );
  }

  return <>{children}</>;
};
