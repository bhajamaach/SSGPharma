import { Prisma } from "@prisma/client";
import { ZodSchema } from "zod";

export async function parseJsonBody<T>(
  request: Request,
  schema: ZodSchema<T>,
): Promise<{ success: true; data: T } | { success: false; response: Response }> {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return {
      success: false,
      response: Response.json({ error: "Invalid JSON" }, { status: 400 }),
    };
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return {
      success: false,
      response: Response.json({ error: "Invalid input", details: parsed.error.flatten() }, { status: 400 }),
    };
  }

  return {
    success: true,
    data: parsed.data,
  };
}

export function internalServerError(): Response {
  return Response.json({ error: "Internal server error" }, { status: 500 });
}

function formatConstraintTarget(target: Prisma.PrismaClientKnownRequestError["meta"]) {
  const rawTarget = target && typeof target === "object" && "target" in target ? target.target : undefined;
  const fields = Array.isArray(rawTarget) ? rawTarget : typeof rawTarget === "string" ? [rawTarget] : [];

  if (fields.length === 0) return "A record with the same value";

  const labels = fields.map((field) => field.replace(/Id$/, "").replace(/([a-z])([A-Z])/g, "$1 $2").toLowerCase());
  const friendly = labels.join(" and ");
  return `${friendly.charAt(0).toUpperCase()}${friendly.slice(1)}`;
}

export function mutationErrorResponse(error: unknown, fallback = "Request failed"): Response {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      return Response.json({ error: `${formatConstraintTarget(error.meta)} already exists.` }, { status: 409 });
    }

    if (error.code === "P2003") {
      return Response.json(
        { error: "This change references data that does not exist, or the record is still in use elsewhere." },
        { status: 400 },
      );
    }

    if (error.code === "P2025") {
      return Response.json({ error: "Record not found." }, { status: 404 });
    }
  }

  if (error instanceof Error && /no such column/i.test(error.message)) {
    return Response.json(
      { error: "Database schema is out of date. Apply the latest Prisma migrations, then try again." },
      { status: 500 },
    );
  }

  return Response.json({ error: fallback }, { status: 500 });
}
