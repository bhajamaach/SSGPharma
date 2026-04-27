import { NextRequest, NextResponse } from "next/server";
import { requireAdminApi, requireAdminMutation } from "@/lib/require-admin";
import { ensureContactConfig, getContactConfig } from "@/lib/contact-config";
import { parseJsonBody } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { updateContactConfigSchema } from "@/lib/validators/contact";

export async function GET() {
  const adminCheck = await requireAdminApi();
  if (adminCheck instanceof NextResponse) return adminCheck;

  try {
    const fullConfig = await getContactConfig();
    return NextResponse.json(fullConfig);
  } catch (error) {
    console.error("Error fetching contact config:", error);
    return NextResponse.json(
      { error: "Failed to fetch contact config" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  const adminCheck = await requireAdminMutation(req);
  if (adminCheck instanceof NextResponse) return adminCheck;

  try {
    const parsed = await parseJsonBody(req, updateContactConfigSchema);
    if (!parsed.success) return parsed.response;
    const validated = parsed.data;

    const config = await ensureContactConfig();

    const updated = await prisma.contactConfig.update({
      where: { id: config.id },
      data: validated,
      include: {
        phones: true,
        emails: true,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating contact config:", error);
    return NextResponse.json(
      { error: "Failed to update contact config" },
      { status: 500 }
    );
  }
}
