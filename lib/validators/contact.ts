import { z } from "zod";

export const createContactPhoneSchema = z.object({
  value: z.string().trim().min(5, "Phone number is too short").max(40, "Phone number is too long").regex(/^\+?[0-9\s\-()]+$/, "Invalid phone number format"),
  purpose: z.enum(["sales", "support", "procurement", "emergency"]),
  description: z.string().trim().max(200, "Description is too long").optional(),
  isActive: z.boolean().default(true),
  priority: z.number().int().min(0).max(999).default(0),
});

export const createContactEmailSchema = z.object({
  value: z.string().trim().email("Invalid email address").max(254, "Email is too long"),
  type: z.enum(["general", "procurement", "support", "sales", "inquiry_recipient"]),
  description: z.string().trim().max(200, "Description is too long").optional(),
  isActive: z.boolean().default(true),
  priority: z.number().int().min(0).max(999).default(0),
});

export const updateContactConfigSchema = z.object({
  companyName: z.string().trim().max(160).optional(),
  businessType: z.string().trim().max(120).optional(),
  officeAddress: z.string().trim().max(400).optional(),
  officeCity: z.string().trim().max(120).optional(),
  officeState: z.string().trim().max(120).optional(),
  officeZipCode: z.string().trim().max(24).optional(),
  businessHoursStart: z.string().optional(),
  businessHoursEnd: z.string().optional(),
  businessDaysMonFri: z.boolean().optional(),
  businessDaysSat: z.boolean().optional(),
  businessDaysSun: z.boolean().optional(),
});

export type CreateContactPhoneInput = z.infer<typeof createContactPhoneSchema>;
export type CreateContactEmailInput = z.infer<typeof createContactEmailSchema>;
export type UpdateContactConfigInput = z.infer<typeof updateContactConfigSchema>;
