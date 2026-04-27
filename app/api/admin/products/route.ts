import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdminApi, requireAdminMutation } from "@/lib/require-admin";
import { parseJsonBody } from "@/lib/api";
import { productDivisions } from "@/lib/divisions";
import { prisma } from "@/lib/prisma";
import { createProductSchema } from "@/lib/validators/product";

function revalidateProductPaths(slug?: string) {
  revalidatePath("/");
  revalidatePath("/products");
  for (const division of productDivisions) {
    revalidatePath(`/divisions/${division.slug}`);
  }
  if (slug) {
    revalidatePath(`/products/${slug}`);
  }
}

export async function GET() {
  const adminCheck = await requireAdminApi();
  if (adminCheck instanceof NextResponse) return adminCheck;

  try {
    const products = await prisma.product.findMany({
      include: {
        category: true,
        molecules: {
          include: {
            molecule: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const adminCheck = await requireAdminMutation(req);
  if (adminCheck instanceof NextResponse) return adminCheck;

  try {
    const parsed = await parseJsonBody(req, createProductSchema);
    if (!parsed.success) return parsed.response;
    const validated = parsed.data;

    const product = await prisma.$transaction(async (tx) => {
      const created = await tx.product.create({
        data: {
          name: validated.name,
          slug: validated.slug,
          categoryId: validated.categoryId ?? null,
          manufacturer: validated.manufacturer,
          isActive: validated.isActive,
          pricePaise: validated.pricePaise,
          mrpPaise: validated.mrpPaise ?? null,
          dosage: validated.dosage,
          packSize: validated.packSize,
          salts: validated.salts,
          description: validated.description,
          keyBenefits: validated.keyBenefits,
          goodToKnow: validated.goodToKnow,
          dietType: validated.dietType,
          productForm: validated.productForm,
          allergiesInformation: validated.allergiesInformation,
          directionForUse: validated.directionForUse,
          safetyInformation: validated.safetyInformation,
          schema: validated.schema,
          specialBenefitSchemes: validated.specialBenefitSchemes,
          faqs: validated.faqs,
          imageUrl1: validated.imageUrl1 ?? null,
          imageUrl2: validated.imageUrl2 ?? null,
          imageUrl3: validated.imageUrl3 ?? null,
        },
      });

      if (validated.moleculeIds && validated.moleculeIds.length > 0) {
        await tx.productMolecule.createMany({
          data: validated.moleculeIds.map((moleculeId) => ({
            productId: created.id,
            moleculeId,
          })),
        });
      }

      return tx.product.findUniqueOrThrow({
        where: { id: created.id },
        include: {
          category: true,
          molecules: {
            include: {
              molecule: true,
            },
          },
        },
      });
    });

    revalidateProductPaths(product.slug);

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}
