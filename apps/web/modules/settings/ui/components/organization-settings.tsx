"use client";

import { useState } from "react";
import { useActiveOrganization, organization } from "@/lib/auth-client";
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
import { Loader2Icon, CheckIcon } from "lucide-react";

export const OrganizationSettings = () => {
  const { data: activeOrg, isPending } = useActiveOrganization();
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  // Initialize form values when org loads
  const [initialized, setInitialized] = useState(false);
  if (activeOrg && !initialized) {
    setName(activeOrg.name);
    setSlug(activeOrg.slug);
    setInitialized(true);
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeOrg || !name.trim()) return;

    setSaving(true);
    setError("");
    setSaved(false);

    try {
      await organization.update({
        organizationId: activeOrg.id,
        data: {
          name: name.trim(),
          slug: slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, "-"),
        },
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err: any) {
      setError(err?.message || "Failed to update organization");
    } finally {
      setSaving(false);
    }
  };

  if (isPending) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2Icon className="size-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (!activeOrg) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Organization Details</CardTitle>
        <CardDescription>
          Update your organization name and slug
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSave} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="org-name">Organization Name</Label>
            <Input
              id="org-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="My Organization"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="org-slug">Slug</Label>
            <Input
              id="org-slug"
              value={slug}
              onChange={(e) =>
                setSlug(
                  e.target.value
                    .toLowerCase()
                    .replace(/[^a-z0-9-]/g, "-")
                )
              }
              placeholder="my-organization"
            />
            <p className="text-xs text-muted-foreground">
              URL-friendly identifier for your organization
            </p>
          </div>

          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}

          <Button type="submit" disabled={saving || !name.trim()}>
            {saving ? (
              <Loader2Icon className="mr-2 size-4 animate-spin" />
            ) : saved ? (
              <CheckIcon className="mr-2 size-4" />
            ) : null}
            {saved ? "Saved" : "Save Changes"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
