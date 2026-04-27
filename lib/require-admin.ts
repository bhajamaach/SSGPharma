import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-session";

export async function requireAdminApi() {
  const ok = await isAdminAuthenticated();
  if (!ok) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}

export function verifySameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");
  if (!origin || !host) {
    return false;
  }

  try {
    const originUrl = new URL(origin);
    return originUrl.host === host;
  } catch {
    return false;
  }
}

export async function requireAdminMutation(request: Request) {
  const authCheck = await requireAdminApi();
  if (authCheck instanceof NextResponse) return authCheck;

  if (!verifySameOrigin(request)) {
    return NextResponse.json({ error: "Invalid origin" }, { status: 403 });
  }

  return null;
}
