import { NextRequest, NextResponse } from "next/server";
import { requireAdminMutation } from "@/lib/require-admin";
import { ensureContactConfig } from "@/lib/contact-config";
import { parseJsonBody } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { createContactPhoneSchema } from "@/lib/validators/contact";

export async function POST(req: NextRequest) {
  const adminCheck = await requireAdminMutation(req);
  if (adminCheck instanceof NextResponse) return adminCheck;

  try {
    const parsed = await parseJsonBody(req, createContactPhoneSchema);
    if (!parsed.success) return parsed.response;
    const validated = parsed.data;

    const config = await ensureContactConfig();

    const phone = await prisma.contactPhone.create({
      data: {
        configId: config.id,
        ...validated,
      },
    });

    return NextResponse.json(phone, { status: 201 });
  } catch (error) {
    console.error("Error creating phone:", error);
    return NextResponse.json(
      { error: "Failed to create phone number" },
      { status: 500 }
    );
  }
}
