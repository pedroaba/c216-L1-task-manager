import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AppBreadcrumb } from "@/components/app-breadcrumb";
import { AppSidebar } from "@/components/app-sidebar";
import { AvatarButton } from "@/components/avatar-button";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { appConfig } from "@/constants/app-config";
import { AuthWrapper } from "@/wrappers/auth";
import { SystemUserModal } from "./_components/modal";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const nextCookies = await cookies();
  const token = nextCookies.get(appConfig.authCookieName)?.value;
  const isAuthenticated = !!token;
  if (!isAuthenticated) {
    return redirect("/auth/sign-in");
  }

  return (
    <AuthWrapper>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-[calc(4rem+10px)] w-full shrink-0 items-center justify-between gap-2 border-b px-4">
            <SidebarTrigger className="flex md:hidden" />
            <div className="flex items-center justify-between gap-2 sm:flex-1">
              <AppBreadcrumb />
              <AvatarButton />
            </div>
          </header>
          <main className="flex flex-1 flex-col gap-4 p-4">{children}</main>
        </SidebarInset>
        <SystemUserModal />
      </SidebarProvider>
    </AuthWrapper>
  );
}
