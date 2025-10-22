"use client";

import { Check, ChevronRight, PlusIcon } from "lucide-react";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { CreateWorkspaceModal } from "./create-workspace-modal";

// Mock data - replace with actual data from backend
const mockWorkspaces = [
  {
    id: "1",
    name: "Personal Workspace",
    description: "Personal projects",
    icon: "WP",
    color: "bg-blue-500",
  },
  {
    id: "2",
    name: "XYZ Company",
    description: "Company projects",
    icon: "EX",
    color: "bg-purple-500",
  },
  {
    id: "3",
    name: "Freelance",
    description: "Freelance projects",
    icon: "FR",
    color: "bg-green-500",
  },
];

export function AppSidebarHeader() {
  const [selectedWorkspace, setSelectedWorkspace] = useState<string | null>(
    null
  );

  const [createWorkspaceOpen, setCreateWorkspaceOpen] = useState(false);

  const currentWorkspace = mockWorkspaces.find(
    (ws) => ws.id === selectedWorkspace
  );

  return (
    <>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  className={cn(
                    "group/trigger h-fit min-h-[48px] transition-all duration-200",
                    currentWorkspace
                      ? "hover:bg-sidebar-accent"
                      : "border border-zinc-300 border-dashed py-3 hover:border-zinc-400 hover:from-zinc-100 hover:to-zinc-200 hover:shadow dark:border-zinc-700 dark:from-zinc-800/30 dark:to-zinc-900/50 dark:hover:border-zinc-600 dark:hover:from-zinc-800/50 dark:hover:to-zinc-900/70"
                  )}
                  // size="lg"
                >
                  {currentWorkspace ? (
                    <>
                      <div
                        className={cn(
                          "flex aspect-square size-9 items-center justify-center rounded-md text-white shadow-none transition-transform duration-200 group-hover/trigger:scale-105",
                          currentWorkspace.color
                        )}
                      >
                        <span className="font-semibold text-sm">
                          {currentWorkspace.icon}
                        </span>
                      </div>
                      <div className="flex flex-1 flex-col text-left leading-normal">
                        <p className="max-w-[150px] truncate font-semibold text-sm transition-colors">
                          {currentWorkspace.name}
                        </p>
                        <p className="max-w-[150px] truncate text-muted-foreground text-xs transition-colors">
                          {currentWorkspace.description}
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="relative flex aspect-square size-9 shrink-0 items-center justify-center rounded-md border-2 border-zinc-300 border-dashed bg-zinc-50 shadow-sm transition-all duration-200 group-hover/trigger:scale-105 group-hover/trigger:border-zinc-400 group-hover/trigger:bg-zinc-100 dark:border-zinc-600 dark:bg-zinc-800 dark:group-hover/trigger:border-zinc-500 dark:group-hover/trigger:bg-zinc-700">
                        <span className="font-bold text-base text-zinc-500 transition-colors group-hover/trigger:text-zinc-600 dark:text-zinc-400 dark:group-hover/trigger:text-zinc-300">
                          ?
                        </span>
                        <span className="-right-1 -top-1 absolute flex size-3 items-center justify-center rounded-full bg-red-500 shadow-sm">
                          <span className="absolute inline-flex size-full animate-ping rounded-full bg-red-400 opacity-75" />
                        </span>
                      </div>
                      <div className="flex flex-1 flex-col gap-1 text-left leading-normal">
                        <p className="max-w-[150px] truncate whitespace-nowrap font-semibold text-sm transition-colors">
                          Select a workspace
                        </p>
                        <p className="max-w-[150px] truncate text-muted-foreground text-xs transition-colors group-hover/trigger:text-foreground/70">
                          Click to choose
                        </p>
                      </div>
                    </>
                  )}
                  <ChevronRight className="ml-auto size-4 shrink-0 text-muted-foreground transition-all duration-200 group-hover/trigger:text-foreground group-data-[state=open]/menu-item:rotate-90" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-64" side="bottom">
                <DropdownMenuLabel className="text-muted-foreground text-xs">
                  Your Workspaces
                </DropdownMenuLabel>
                {mockWorkspaces.map((workspace) => (
                  <DropdownMenuItem
                    className="gap-2 py-2"
                    key={workspace.id}
                    onClick={() => setSelectedWorkspace(workspace.id)}
                  >
                    <div
                      className={cn(
                        "flex size-8 shrink-0 items-center justify-center rounded-md text-white text-xs",
                        workspace.color
                      )}
                    >
                      {workspace.icon}
                    </div>
                    <div className="flex flex-1 flex-col gap-0.5">
                      <span className="font-medium text-sm">
                        {workspace.name}
                      </span>
                      <span className="text-muted-foreground text-xs">
                        {workspace.description}
                      </span>
                    </div>
                    {selectedWorkspace === workspace.id && (
                      <Check className="size-4 text-primary" />
                    )}
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />

                <DropdownMenuItem
                  className="gap-2"
                  onClick={() => setCreateWorkspaceOpen(true)}
                >
                  <PlusIcon className="size-4" />
                  <span>Create new workspace</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <CreateWorkspaceModal
        onOpenChange={setCreateWorkspaceOpen}
        open={createWorkspaceOpen}
      />
    </>
  );
}
