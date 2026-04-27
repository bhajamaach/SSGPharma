import { NextResponse } from "next/server";
import { clearAdminSessionCookie } from "@/lib/admin-session";
import { internalServerError } from "@/lib/api";
import { requireAdminMutation } from "@/lib/require-admin";

export async function POST(request: Request): Promise<Response> {
  const denied = await requireAdminMutation(request);
  if (denied) return denied;

  try {
    await clearAdminSessionCookie();
    return NextResponse.json({ ok: true });
  } catch {
    return internalServerError();
  }
}
