"use client";

import {
  CreditCardIcon,
  InboxIcon,
  LayoutDashboardIcon,
  LibraryBigIcon,
  Mic,
  PaletteIcon,
  BuildingIcon,
  ChevronsUpDownIcon,
  LogOutIcon,
  Loader2Icon,
  UserIcon,
  SettingsIcon,
  BriefcaseBusinessIcon,
  PlusIcon,
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
} from "@workspace/ui/components/dropdown-menu";
import { Avatar, AvatarFallback } from "@workspace/ui/components/avatar";

const customerSupportItems = [
  {
    title: "Conversations",
    url: "/conversations",
    icon: InboxIcon,
  },
  {
    title: "Knowledge Base",
    url: "/files",
    icon: LibraryBigIcon,
  },
];

const configurationItems = [
  {
    title: "Business Info",
    url: "/business-info",
    icon: BriefcaseBusinessIcon,
  },
  {
    title: "Widget Customization",
    url: "/customization",
    icon: PaletteIcon,
  },
  {
    title: "Integrations",
    url: "/integrations",
    icon: LayoutDashboardIcon,
  },
  {
    title: "Voice Assistant",
    url: "/plugins/vapi",
    icon: Mic,
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
            <SidebarMenuButton size="lg" className="w-full cursor-default hover:bg-transparent">
              <div className="flex size-6 items-center justify-center rounded-lg bg-gradient-to-b from-primary to-[#0b63f3]">
                <span className="text-xs font-bold text-white">O</span>
              </div>
              <span className="text-sm font-semibold group-data-[collapsible=icon]:hidden">
                Omnixx
              </span>
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
        {/* Organization Switcher */}
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="w-full group-data-[collapsible=icon]:size-8 group-data-[collapsible=icon]:p-2">
                  <div className="flex size-4 items-center justify-center rounded-sm bg-primary/10">
                    <BuildingIcon className="size-3 text-primary" />
                  </div>
                  <span className="truncate text-xs font-medium group-data-[collapsible=icon]:hidden">
                    {activeOrg?.name ?? "Select Org"}
                  </span>
                  <ChevronsUpDownIcon className="ml-auto size-3 group-data-[collapsible=icon]:hidden" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
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
                <DropdownMenuItem onClick={() => router.push("/onboarding")}>
                  <PlusIcon className="mr-2 size-4" />
                  New Organization
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push("/org-selection")}>
                  <BuildingIcon className="mr-2 size-4" />
                  Manage Organizations
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>

        {/* User Profile */}
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="w-full group-data-[collapsible=icon]:size-8 group-data-[collapsible=icon]:p-2">
                  <Avatar className="size-4">
                    <AvatarFallback className="text-[10px]">
                      {session?.user?.name?.charAt(0)?.toUpperCase() ?? <UserIcon className="size-3" />}
                    </AvatarFallback>
                  </Avatar>
                  <span className="truncate text-xs group-data-[collapsible=icon]:hidden">
                    {session?.user?.name ?? session?.user?.email ?? "User"}
                  </span>
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                <div className="px-2 py-1.5">
                  <p className="text-sm font-medium">{session?.user?.name}</p>
                  <p className="text-xs text-muted-foreground">{session?.user?.email}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOutIcon className="mr-2 size-4" />
                  Sign Out
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
