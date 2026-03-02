"use client";

import { useActiveOrganization } from "@/lib/auth-client";
import { AuthLayout } from "@/modules/auth/ui/layouts/auth-layout";
import { OrgSelectionView } from "@/modules/auth/ui/views/org-selection-view";
import { Loader2Icon } from "lucide-react";

export const OrganizationGuard = ({ children }: { children: React.ReactNode; }) => {
  const { data: activeOrg, isPending } = useActiveOrganization();

  if (isPending) {
    return (
      <AuthLayout>
        <Loader2Icon className="size-6 animate-spin text-muted-foreground" />
      </AuthLayout>
    );
  }

  if (!activeOrg) {
    return (
      <AuthLayout>
        <OrgSelectionView />
      </AuthLayout>
    );
  }

  return (
    <>
      {children}
    </>
  );
};
