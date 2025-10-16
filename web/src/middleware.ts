import { cookies } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import { appConfig } from "@/constants/app-config";

const unprotectedRoutePrefix = "/auth";

export default async function middleware(request: NextRequest) {
  const nextCookies = await cookies();
  if (request.nextUrl.pathname.startsWith(unprotectedRoutePrefix)) {
    return NextResponse.next();
  }

  const token = nextCookies.get(appConfig.authCookieName)?.value;
  const isAuthenticated = !!token;
  if (!isAuthenticated) {
    return NextResponse.redirect(new URL("/auth/sign-in", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
