import { NextRequest } from "next/server";

export function isAdminAuthorized(req: NextRequest): boolean {
  const key = req.headers.get("x-api-key");
  return !!key && key === process.env.ADMIN_API_KEY;
}
