import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { parseJsonBody, internalServerError } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { requireAdminApi } from "@/lib/require-admin";
import { changePasswordSchema } from "@/lib/validators/auth";

export async function POST(request: Request): Promise<Response> {
  const denied = await requireAdminApi();
  if (denied) return denied;

  try {
    const parsed = await parseJsonBody(request, changePasswordSchema);
    if (!parsed.success) {
      return parsed.response;
    }

    const { currentPassword, newPassword } = parsed.data;
    const admin = await prisma.adminUser.findFirst({
      where: { isActive: true },
      orderBy: { createdAt: "asc" },
    });

    if (!admin) {
      return NextResponse.json({ error: "Admin user not found" }, { status: 404 });
    }

    const passwordOk = await bcrypt.compare(currentPassword, admin.passwordHash);
    if (!passwordOk) {
      return NextResponse.json({ error: "Current password is incorrect" }, { status: 401 });
    }

    const passwordHash = await bcrypt.hash(newPassword, 12);
    await prisma.adminUser.update({
      where: { id: admin.id },
      data: { passwordHash },
    });

    return NextResponse.json({ success: true });
  } catch {
    return internalServerError();
  }
}
