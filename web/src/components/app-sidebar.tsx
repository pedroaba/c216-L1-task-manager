"use client";

import {
  ChevronRight,
  Container,
  HomeIcon,
  InboxIcon,
  icons,
  PlusIcon,
  SettingsIcon,
  Trash2,
  UserIcon,
  WandSparkles,
} from "lucide-react";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { destroyCookie } from "nookies";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { appConfig } from "@/constants/app-config";
import { useGetProject } from "@/http/gen/endpoints/project/project.gen";
import { logout } from "@/http/logout";
import { useAuthStore } from "@/store/auth";
import { useSystemUserModal } from "@/store/use-user-modal";
import { camelCasify } from "@/utils/camel-casify";
import { AppSidebarHeader } from "./app-sidebar-header";

const mainNavItems = [
  {
    title: "Home",
    icon: HomeIcon,
    url: "/",
  },
  {
    title: "Inbox",
    icon: InboxIcon,
    url: "/inbox",
    badge: "3",
  },
];

export function AppSidebar() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const { workspaceSlug } = useParams();

  const { openModal } = useSystemUserModal();

  const { data, isLoading } = useGetProject();

  const [_, projects] = data ?? [];

  async function handleLogout() {
    const response = await logout();
    const toastId = toast.loading("Logging out...");

    if (!response.success) {
      toast.error(response.message, { id: toastId });
      return;
    }

    destroyCookie(null, appConfig.authCookieName);
    toast.success("Logged out successfully", {
      description: "You will be redirected to the sign in page",
      id: toastId,
    });
    router.push("/auth/sign-in");
  }

  return (
    <Sidebar collapsible="icon" variant="sidebar">
      <AppSidebarHeader />

      <SidebarContent className="gap-0">
        {/* Main Navigation */}
        <SidebarGroup className="py-0">
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                      {item.badge && (
                        <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-md bg-primary/10 px-1 text-primary text-xs group-data-[collapsible=icon]:hidden">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Workspace Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel>Workspace</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <Collapsible asChild>
                <SidebarMenuItem>
                  {/* <SidebarMenuButton asChild tooltip="Projects">
                    <Link href="/projects">
                      <Container />
                      <span>Projetos</span>
                    </Link>
                  </SidebarMenuButton> */}
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton className="group">
                      <Container />
                      <span>Projects</span>

                      <ChevronRight className="ml-auto size-3.5 transition-transform group-data-[state=open]:rotate-90" />
                      <span className="sr-only">Toggle</span>
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {/* {workspaceItems.map((subItem) => (
                            <SidebarMenuSubItem key={subItem.title}>
                              <SidebarMenuSubButton asChild>
                                <Link href={subItem.url}>
                                  <span>{subItem.title}</span>
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))} */}
                      {!isLoading && (projects?.total ?? 0) === 0 && (
                        <div className="flex flex-col items-center gap-2 py-6">
                          <InboxIcon className="size-6 text-muted-foreground" />
                          <span className="text-muted-foreground">
                            No projects created
                          </span>
                        </div>
                      )}

                      {!isLoading &&
                        (projects?.total ?? 0) > 0 &&
                        projects?.projects.map((project) => {
                          const icon = project.icon ? project.icon : "Folder";
                          const Icon =
                            icons[
                              camelCasify(icon, {
                                keepFirstLetterUpperCase: true,
                              }) as keyof typeof icons
                            ];

                          return (
                            <SidebarMenuSubItem key={project.id}>
                              <SidebarMenuSubButton asChild>
                                <Link
                                  href={`/workspace/${workspaceSlug}/projects/${project.slug}`}
                                >
                                  <Icon className="mr-1 size-4" />
                                  <span>{project.name}</span>
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          );
                        })}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  className="h-12 hover:bg-sidebar-accent"
                  size="lg"
                >
                  <Avatar className="size-8">
                    <AvatarImage alt="User" src="/avatar.png" />
                    <AvatarFallback className="bg-primary/10 text-primary">
                      U
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col gap-0.5 text-left text-sm leading-tight">
                    <p className="max-w-[150px] truncate font-semibold">
                      {user?.name}
                    </p>
                    <p className="max-w-[150px] truncate text-muted-foreground text-xs">
                      {user?.email}
                    </p>
                  </div>
                  <ChevronRight className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center" className="w-56" side="top">
                <DropdownMenuItem onClick={() => openModal("profile")}>
                  <UserIcon className="mr-2 size-4" />
                  My Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => openModal("settings")}>
                  <SettingsIcon className="mr-2 size-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>
                    <WandSparkles className="size-4" />
                    Quick Actions
                  </DropdownMenuSubTrigger>
                  <DropdownMenuSubContent sideOffset={10}>
                    <DropdownMenuItem>
                      <PlusIcon className="size-4" />
                      Create Workspace
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Trash2 className="size-4" />
                      Access Trash
                    </DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
