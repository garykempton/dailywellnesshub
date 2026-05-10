import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const ADMIN_COOKIE = "dwh_admin";
const SESSION_MAX_AGE = 60 * 60 * 8; // 8 hours

/** Check x-api-key header — used by API routes and AI agents */
export function isAdminAuthorized(req: NextRequest): boolean {
  const key = req.headers.get("x-api-key");
  return !!key && key === process.env.ADMIN_API_KEY;
}

/** Check admin session cookie — used by browser dashboard pages */
export async function isAdminSession(): Promise<boolean> {
  try {
    const jar = await cookies();
    const token = jar.get(ADMIN_COOKIE)?.value;
    return !!token && token === process.env.ADMIN_API_KEY;
  } catch {
    return false;
  }
}

/** Set the admin session cookie after successful login */
export function setAdminCookie(res: NextResponse): NextResponse {
  res.cookies.set(ADMIN_COOKIE, process.env.ADMIN_API_KEY!, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/admin",
    maxAge: SESSION_MAX_AGE,
  });
  return res;
}

/** Clear the admin session cookie */
export function clearAdminCookie(res: NextResponse): NextResponse {
  res.cookies.delete(ADMIN_COOKIE);
  return res;
}
