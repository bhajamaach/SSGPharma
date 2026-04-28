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
  const originHeader = request.headers.get("origin") ?? request.headers.get("referer");
  const requestHosts = new Set(
    [
      request.headers.get("x-forwarded-host"),
      request.headers.get("host"),
      (() => {
        try {
          return process.env.NEXT_PUBLIC_SITE_URL ? new URL(process.env.NEXT_PUBLIC_SITE_URL).host : null;
        } catch {
          return null;
        }
      })(),
    ]
      .flatMap((value) => value?.split(",") ?? [])
      .map((value) => value.trim().toLowerCase())
      .filter(Boolean),
  );

  if (!originHeader || requestHosts.size === 0) {
    return false;
  }

  try {
    const originUrl = new URL(originHeader);
    return requestHosts.has(originUrl.host.toLowerCase());
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
