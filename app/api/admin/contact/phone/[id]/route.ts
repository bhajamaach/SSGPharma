import { NextRequest, NextResponse } from "next/server";
import { requireAdminMutation } from "@/lib/require-admin";
import { parseJsonBody } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { createContactPhoneSchema } from "@/lib/validators/contact";

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(
  req: NextRequest,
  { params }: RouteContext
) {
  const adminCheck = await requireAdminMutation(req);
  if (adminCheck instanceof NextResponse) return adminCheck;
  const { id } = await params;

  try {
    const parsed = await parseJsonBody(req, createContactPhoneSchema);
    if (!parsed.success) return parsed.response;
    const validated = parsed.data;

    const phone = await prisma.contactPhone.update({
      where: { id },
      data: validated,
    });

    return NextResponse.json(phone);
  } catch (error) {
    console.error("Error updating phone:", error);
    return NextResponse.json(
      { error: "Failed to update phone number" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: RouteContext
) {
  const adminCheck = await requireAdminMutation(req);
  if (adminCheck instanceof NextResponse) return adminCheck;
  const { id } = await params;

  try {
    await prisma.contactPhone.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting phone:", error);
    return NextResponse.json(
      { error: "Failed to delete phone number" },
      { status: 500 }
    );
  }
}
