import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { appConfig } from "@/constants/app-config";

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
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="flex md:hidden" />
          <div className="flex flex-1 items-center gap-2">
            {/* Breadcrumb ou título da página pode ir aqui */}
          </div>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
