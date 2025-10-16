import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { appConfig } from "@/constants/app-config";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const nextCookies = await cookies();
  const token = nextCookies.get(appConfig.authCookieName)?.value;
  const isAuthenticated = !!token;
  if (isAuthenticated) {
    return redirect("/");
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      {children}
    </main>
  );
}
