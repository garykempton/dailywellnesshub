import { NextRequest, NextResponse } from "next/server";

const ADMIN_COOKIE = "dwh_admin";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Only protect /admin routes (except login page and API routes)
  if (
    pathname.startsWith("/admin") &&
    !pathname.startsWith("/admin/login") &&
    !pathname.startsWith("/api/")
  ) {
    const token = req.cookies.get(ADMIN_COOKIE)?.value;
    const valid = !!token && token === process.env.ADMIN_API_KEY;

    if (!valid) {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
