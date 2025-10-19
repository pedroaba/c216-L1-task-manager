"use client";

import { ChevronRight, Settings, Shield, User } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/auth";
import { getInitials } from "@/utils/get-initials";
import { useSystemUserModal } from "../../../../store/use-user-modal";
import { ProfileContent } from "./profile-content";
import { SecurityContent } from "./security-content";
import { SettingsContent } from "./settings-content";
import type { UserModalTab } from "./types";

const tabs: UserModalTab[] = [
  {
    id: "profile",
    label: "My Profile",
    icon: User,
    description: "Manage your personal information",
  },
  {
    id: "security",
    label: "Security",
    icon: Shield,
    description: "Password and account security",
  },
  {
    id: "settings",
    label: "Settings",
    icon: Settings,
    description: "Preferences and customization",
  },
];

export function SystemUserModal() {
  const { isOpen, activeTab, closeModal, setActiveTab } = useSystemUserModal();
  const { user, setUser } = useAuthStore();

  if (!user) {
    return (
      <Dialog onOpenChange={closeModal} open={isOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-destructive/10">
              <User className="size-8 text-destructive" />
            </div>
            <DialogTitle className="text-center text-xl">
              Information Unavailable
            </DialogTitle>
            <DialogDescription className="text-center text-base leading-relaxed">
              We couldn't retrieve your user information at this time. This
              might be due to a temporary connection issue.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              className="grow"
              onClick={() => window.location.reload()}
              type="button"
            >
              Try Again
            </Button>
            <DialogClose asChild>
              <Button className="grow" type="button" variant="outline">
                Close
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog onOpenChange={closeModal} open={isOpen}>
      <DialogContent className="max-w-6xl gap-0 overflow-hidden p-0">
        <div className="flex h-[700px]">
          <div className="flex w-80 flex-col border-r bg-muted/40 p-6">
            <DialogHeader className="mb-6 space-y-4 text-left">
              <div className="flex items-center gap-3">
                <Avatar className="size-14 border-2 border-border">
                  <AvatarFallback className="bg-primary/10 font-semibold text-base text-primary">
                    {getInitials(user.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <DialogTitle className="truncate font-semibold text-base leading-tight">
                    {user.name}
                  </DialogTitle>
                  <DialogDescription className="mt-1 truncate text-xs">
                    {user.email}
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <nav className="flex flex-col gap-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    className={cn(
                      "group flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left font-medium text-sm transition-all",
                      "hover:bg-accent/80",
                      isActive
                        ? "bg-background text-foreground shadow-sm hover:bg-background"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    type="button"
                  >
                    <Icon className="size-[18px] shrink-0" />
                    <span className="flex-1 truncate">{tab.label}</span>
                    <ChevronRight
                      className={cn(
                        "size-4 shrink-0 transition-opacity",
                        isActive
                          ? "opacity-100"
                          : "opacity-0 group-hover:opacity-50"
                      )}
                    />
                  </button>
                );
              })}
            </nav>

            <div className="mt-auto">
              <div className="rounded-lg border bg-background/50 p-3">
                <p className="text-muted-foreground text-xs leading-relaxed">
                  Your profile settings are synced across all devices.
                </p>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <ScrollArea className="flex h-[700px] w-full">
            <div className="flex-1 overflow-y-auto bg-background">
              {activeTab === "profile" && (
                <ProfileContent
                  updateProfileStored={({ email, name }) => {
                    setUser({
                      ...user,
                      email,
                      name,
                    });
                  }}
                  user={user}
                />
              )}
              {activeTab === "security" && <SecurityContent />}
              {activeTab === "settings" && <SettingsContent />}
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}
