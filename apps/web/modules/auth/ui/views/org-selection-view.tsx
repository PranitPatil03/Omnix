"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { organization, useListOrganizations, useSession } from "@/lib/auth-client";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { BuildingIcon, Loader2Icon, PlusIcon } from "lucide-react";

export const OrgSelectionView = () => {
  const router = useRouter();
  const { data: session, isPending: sessionLoading } = useSession();
  const { data: orgs, isPending: orgsLoading } = useListOrganizations();
  const [creating, setCreating] = useState(false);
  const [newOrgName, setNewOrgName] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectingId, setSelectingId] = useState<string | null>(null);

  // Redirect to sign-in if no session (client-side guard)
  useEffect(() => {
    if (!sessionLoading && !session) {
      router.replace("/sign-in");
    }
  }, [session, sessionLoading, router]);

  // Auto-open create form when user has no orgs (new user)
  useEffect(() => {
    if (!orgsLoading && orgs && orgs.length === 0) {
      setCreating(true);
    }
  }, [orgs, orgsLoading]);

  const navigateToConversations = () => {
    router.push("/conversations");
    router.refresh();
  };

  const handleCreateOrg = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOrgName.trim()) return;
    setLoading(true);

    try {
      const result = await organization.create({
        name: newOrgName.trim(),
        slug: newOrgName.trim().toLowerCase().replace(/\s+/g, "-"),
      });

      if (result.data) {
        await organization.setActive({ organizationId: result.data.id });
        // Set cookie for middleware
        document.cookie = `active_organization_id=${result.data.id};path=/;max-age=${60 * 60 * 24 * 365}`;
        navigateToConversations();
      }
    } catch {
      // error handling
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOrg = async (orgId: string) => {
    setSelectingId(orgId);
    try {
      await organization.setActive({ organizationId: orgId });
      // Set cookie for middleware
      document.cookie = `active_organization_id=${orgId};path=/;max-age=${60 * 60 * 24 * 365}`;
      navigateToConversations();
    } catch {
      // error handling
    } finally {
      setSelectingId(null);
    }
  };

  if (sessionLoading || orgsLoading) {
    return (
      <div className="flex items-center justify-center">
        <Loader2Icon className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // Don't render if no session (redirect happening)
  if (!session) return null;

  const hasOrgs = orgs && orgs.length > 0;

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">
          {hasOrgs ? "Select Organization" : "Create Your Organization"}
        </CardTitle>
        <CardDescription>
          {hasOrgs
            ? "Choose an organization or create a new one"
            : "Create your first organization to get started"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Existing organizations */}
        {hasOrgs && (
          <div className="space-y-2">
            {orgs.map((org) => (
              <button
                key={org.id}
                onClick={() => handleSelectOrg(org.id)}
                disabled={selectingId === org.id}
                className="flex w-full items-center gap-3 rounded-lg border p-3 text-left hover:bg-accent transition-colors disabled:opacity-50"
              >
                <div className="flex size-9 items-center justify-center rounded-md bg-primary/10">
                  <BuildingIcon className="size-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{org.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{org.slug}</p>
                </div>
                {selectingId === org.id && (
                  <Loader2Icon className="size-4 animate-spin" />
                )}
              </button>
            ))}
          </div>
        )}

        {/* Create new org */}
        {!creating ? (
          <Button
            variant="outline"
            className="w-full"
            onClick={() => setCreating(true)}
          >
            <PlusIcon className="mr-2 size-4" />
            Create Organization
          </Button>
        ) : (
          <form onSubmit={handleCreateOrg} className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="org-name">Organization Name</Label>
              <Input
                id="org-name"
                placeholder="My Company"
                value={newOrgName}
                onChange={(e) => setNewOrgName(e.target.value)}
                required
              />
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="ghost"
                className="flex-1"
                onClick={() => setCreating(false)}
              >
                Cancel
              </Button>
              <Button type="submit" className="flex-1" disabled={loading}>
                {loading && <Loader2Icon className="mr-2 size-4 animate-spin" />}
                Create
              </Button>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
};
