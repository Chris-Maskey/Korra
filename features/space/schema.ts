import * as z from "zod";

export const postSchema = z.object({
  content: z
    .string()
    .min(1, "Content is required")
    .max(2000, "Content must be less than 2000 characters"),
  image: z.instanceof(File).optional(),
  type: z.enum(["NORMAL", "HELP"]).default("NORMAL"),
});

export const commentSchema = z.object({
  content: z.string().min(1, "Content is required"),
});

export const adoptionSchema = z.object({
  petName: z.string().min(1, "Pet name is required"),
  petType: z.string().min(1, "Pet type is required"),
  petAge: z.number().positive("Pet age is required"),
  petAgeUnit: z.enum(["month", "months", "year", "years"]),
  petDescription: z
    .string()
    .min(10, "Description must be at least 10 characters"),
  petImage: z
    .instanceof(File)
    .refine((file) => file.size > 0, "Image is required"),
});

export const marketplaceItemSchema = z.object({
  itemName: z.string().min(1, "Item name is required"),
  itemType: z.string().min(1, "Item type is required"),
  currency: z.enum(["USD", "EUR", "GBP", "JPY", "NPR"]).default("USD"),
  itemPrice: z
    .number()
    .positive("Item price is required")
    .min(1, "Item price is required"),
  itemDescription: z
    .string()
    .min(10, "Description must be at least 10 characters"),
  itemImage: z
    .instanceof(File)
    .refine((file) => file.size > 0, "Image is required"),
});
