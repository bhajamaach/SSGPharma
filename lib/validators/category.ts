import { z } from "zod";

export const createCategorySchema = z.object({
  name: z.string().trim().min(1, "Category name is required").max(120, "Category name is too long"),
  slug: z.string().trim().min(1, "Slug is required").max(140, "Slug is too long"),
  description: z.string().trim().max(1000, "Description is too long").optional(),
  isActive: z.boolean().default(true),
});

export const updateCategorySchema = createCategorySchema.partial();

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
