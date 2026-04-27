import { NextRequest, NextResponse } from "next/server";
import { requireAdminMutation } from "@/lib/require-admin";
import { parseJsonBody } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { createContactEmailSchema } from "@/lib/validators/contact";

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(
  req: NextRequest,
  { params }: RouteContext
) {
  const adminCheck = await requireAdminMutation(req);
  if (adminCheck instanceof NextResponse) return adminCheck;
  const { id } = await params;

  try {
    const parsed = await parseJsonBody(req, createContactEmailSchema);
    if (!parsed.success) return parsed.response;
    const validated = parsed.data;

    const email = await prisma.contactEmail.update({
      where: { id },
      data: validated,
    });

    return NextResponse.json(email);
  } catch (error) {
    console.error("Error updating email:", error);
    return NextResponse.json(
      { error: "Failed to update email" },
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
    await prisma.contactEmail.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting email:", error);
    return NextResponse.json(
      { error: "Failed to delete email" },
      { status: 500 }
    );
  }
}
