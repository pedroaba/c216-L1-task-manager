"use client";

import {
  PlusIcon,
  SettingsIcon,
  Trash2,
  UserIcon,
  WandSparkles,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { destroyCookie } from "nookies";
import { toast } from "sonner";
import { appConfig } from "@/constants/app-config";
import { logout } from "@/http/logout";
import { useSystemUserModal } from "@/store/use-user-modal";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export function AvatarButton() {
  const router = useRouter();
  const { openModal } = useSystemUserModal();

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
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="cursor-pointer">
        <Avatar className="size-9">
          <AvatarImage alt="User" src="/avatar.png" />
          <AvatarFallback className="bg-primary/10 text-primary text-xs">
            UU
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem onClick={() => openModal("profile")}>
          <UserIcon className="mr-2 size-4" />
          Meu Perfil
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => openModal("settings")}>
          <SettingsIcon className="mr-2 size-4" />
          Configurações
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
              Criar Workspace
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Trash2 className="size-4" />
              Acessar Lixeira
            </DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>Sair</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
