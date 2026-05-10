import { NextRequest, NextResponse } from "next/server";
import { setAdminCookie } from "@/lib/admin";

export async function POST(req: NextRequest) {
  const { key } = await req.json();

  if (!key || key !== process.env.ADMIN_API_KEY) {
    return NextResponse.json({ error: "Invalid key" }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  return setAdminCookie(res);
}
