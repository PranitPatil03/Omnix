"use client";

import {
  BuildingIcon,
  ChevronsUpDownIcon,
  LogOutIcon,
  MessageSquareTextIcon,
  DatabaseIcon,
  BriefcaseIcon,
  LayoutGridIcon,
  MicIcon,
  PaletteIcon,
  SettingsIcon,
  CreditCardIcon,
  UserIcon,
  UsersIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@workspace/ui/components/sidebar";
import { cn } from "@workspace/ui/lib/utils";
import {
  useSession,
  useActiveOrganization,
  useListOrganizations,
  organization,
  signOut,
} from "@/lib/auth-client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuLabel,
} from "@workspace/ui/components/dropdown-menu";

const customerSupportItems = [
  {
    title: "Conversations",
    url: "/conversations",
    icon: MessageSquareTextIcon,
  },
  {
    title: "Knowledge Base",
    url: "/files",
    icon: DatabaseIcon,
  },
];

const configurationItems = [
  {
    title: "Business Info",
    url: "/business-info",
    icon: BriefcaseIcon,
  },
  {
    title: "Integrations",
    url: "/integrations",
    icon: LayoutGridIcon,
  },
  {
    title: "Voice Assistant",
    url: "/plugins/vapi",
    icon: MicIcon,
  },
  {
    title: "Widget Customization",
    url: "/customization",
    icon: PaletteIcon,
  },
];

const accountItems = [
  {
    title: "Settings",
    url: "/settings",
    icon: SettingsIcon,
  },
  {
    title: "Plans & Billing",
    url: "/billing",
    icon: CreditCardIcon,
  },
];

export const DashboardSidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const { data: activeOrg } = useActiveOrganization();
  const { data: orgs } = useListOrganizations();

  const isActive = (url: string) => {
    if (url === "/") {
      return pathname === "/";
    }

    return pathname.startsWith(url);
  };

  const handleSwitchOrg = async (orgId: string) => {
    await organization.setActive({ organizationId: orgId });
    document.cookie = `active_organization_id=${orgId};path=/;max-age=${60 * 60 * 24 * 365}`;
    // Full reload ensures all Convex queries re-subscribe under the new org context
    window.location.reload();
  };

  const handleSignOut = async () => {
    document.cookie = "active_organization_id=;path=/;max-age=0";
    await signOut();
    router.push("/sign-in");
    router.refresh();
  };

  return (
    <Sidebar className="group" collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" className="w-full cursor-default hover:bg-transparent pl-1">
              <img src="/logo.svg" alt="Omnixx Logo" className="h-6 object-contain" />
              <span className="text-lg font-bold tracking-tight group-data-[collapsible=icon]:hidden">Omnixx</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {/* Customer Support */}
        <SidebarGroup>
          <SidebarGroupLabel>Customer Support</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {customerSupportItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.url)}
                    className={cn(
                      isActive(item.url) && "bg-gradient-to-b from-sidebar-primary to-[#0b63f3]! text-sidebar-primary-foreground! hover:to-[#0b63f3]/90!"
                    )}
                    tooltip={item.title}
                  >
                    <Link href={item.url}>
                      <item.icon className="size-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Configuration */}
        <SidebarGroup>
          <SidebarGroupLabel>Configuration</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {configurationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.url)}
                    className={cn(
                      isActive(item.url) && "bg-gradient-to-b from-sidebar-primary to-[#0b63f3]! text-sidebar-primary-foreground! hover:to-[#0b63f3]/90!"
                    )}
                    tooltip={item.title}
                  >
                    <Link href={item.url}>
                      <item.icon className="size-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Account */}
        <SidebarGroup>
          <SidebarGroupLabel>Account</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {accountItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.url)}
                    className={cn(
                      isActive(item.url) && "bg-gradient-to-b from-sidebar-primary to-[#0b63f3]! text-sidebar-primary-foreground! hover:to-[#0b63f3]/90!"
                    )}
                    tooltip={item.title}
                  >
                    <Link href={item.url}>
                      <item.icon className="size-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="w-full bg-[#0b63f3] text-white hover:bg-[#0b63f3]/90 active:bg-[#0b63f3]/90 hover:text-white h-auto py-2 group-data-[collapsible=icon]:p-2 group-data-[collapsible=icon]:justify-center">
                  <UserIcon className="size-5 shrink-0 group-data-[collapsible=icon]:size-5" />
                  <div className="flex flex-col items-start min-w-0 group-data-[collapsible=icon]:hidden">
                    <span className="truncate text-sm font-semibold">
                      {session?.user?.name ?? session?.user?.email ?? "User"}
                    </span>
                    <span className="truncate text-[10px] text-white/80 font-medium flex items-center gap-1">
                      <BuildingIcon className="size-3" />
                      {activeOrg?.name ?? "Select Org"}
                    </span>
                  </div>

                  <ChevronsUpDownIcon className="ml-auto size-4 group-data-[collapsible=icon]:hidden" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-64" side="top" sideOffset={8}>
                <div className="px-2 py-2">
                  <p className="text-sm font-semibold">{session?.user?.name}</p>
                  <p className="text-xs text-muted-foreground">{session?.user?.email}</p>
                </div>

                <DropdownMenuSeparator />

                <DropdownMenuGroup>
                  <DropdownMenuLabel className="text-xs text-muted-foreground uppercase tracking-wider">
                    Organizations
                  </DropdownMenuLabel>
                  {orgs?.map((org) => (
                    <DropdownMenuItem
                      key={org.id}
                      onClick={() => handleSwitchOrg(org.id)}
                      className={cn(activeOrg?.id === org.id && "bg-accent")}
                    >
                      <BuildingIcon className="mr-2 size-4" />
                      <span className="truncate">{org.name}</span>
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => router.push("/org-selection")}>
                    <UsersIcon className="mr-2 size-4" />
                    Manage Organizations
                  </DropdownMenuItem>
                </DropdownMenuGroup>

                <DropdownMenuSeparator />

                <DropdownMenuItem onClick={() => router.push("/settings")}>
                  <SettingsIcon className="mr-2 size-4" />
                  Account Settings
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOutIcon className="mr-2 size-4 text-destructive" />
                  <span className="text-destructive">Sign Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
};
