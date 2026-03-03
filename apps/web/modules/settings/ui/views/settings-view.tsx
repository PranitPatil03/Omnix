"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@workspace/ui/components/tabs";
import { OrganizationSettings } from "../components/organization-settings";
import { MembersSettings } from "../components/members-settings";

export const SettingsView = () => {
  return (
    <div className="flex min-h-screen flex-col bg-muted p-8">
      <div className="mx-auto w-full max-w-screen-md">
        <div className="space-y-2">
          <h1 className="text-2xl md:text-4xl">Settings</h1>
          <p className="text-muted-foreground">
            Manage your organization and team
          </p>
        </div>

        <Tabs defaultValue="organization" className="mt-8">
          <TabsList>
            <TabsTrigger value="organization">Organization</TabsTrigger>
            <TabsTrigger value="members">Members</TabsTrigger>
          </TabsList>

          <TabsContent value="organization" className="mt-6">
            <OrganizationSettings />
          </TabsContent>

          <TabsContent value="members" className="mt-6">
            <MembersSettings />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
