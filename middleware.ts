import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

import { ROUTES } from "@/constants/routes";

const protectedRoutes = [ROUTES.dashboard, ROUTES.profile, ROUTES.admin];

function isProtectedPath(pathname: string) {
  return protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!isProtectedPath(pathname)) {
    return NextResponse.next();
  }

  const authSecret = process.env.AUTH_SECRET;

  if (!authSecret) {
    return NextResponse.redirect(new URL(ROUTES.login, request.url));
  }

  const token = await getToken({
    req: request,
    secret: authSecret,
  });

  if (!token) {
    const loginUrl = new URL(ROUTES.login, request.url);
    loginUrl.searchParams.set("callbackUrl", request.nextUrl.pathname);

    return NextResponse.redirect(loginUrl);
  }

  if (pathname.startsWith(ROUTES.admin) && token.role !== "ADMIN") {
    return NextResponse.redirect(new URL(ROUTES.dashboard, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/profile/:path*", "/settings/:path*", "/admin/:path*"],
};
