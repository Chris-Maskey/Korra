import * as z from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024; //5MB
export const postSchema = z.object({
  content: z
    .string()
    .min(1, "Content is required")
    .max(2000, "Content must be less than 2000 characters"),
  image: z
    .instanceof(File)
    .optional()
    .refine(
      (file) => !file || file.size <= MAX_FILE_SIZE,
      "File must be less than 5MB",
    ),
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
    .refine((file) => file.size > 0, "Image is required")
    .refine(
      (file) => file.size <= MAX_FILE_SIZE,
      "Image size must be less than 5MB",
    ),
});

export const marketplaceItemSchema = z.object({
  itemName: z.string().min(1, "Item name is required"),
  itemType: z.string().min(1, "Item type is required"),
  itemQuantity: z.number().positive("Item quantity is required"),
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
    .refine((file) => file.size > 0, "Image is required")
    .refine(
      (file) => file.size <= 5 * 1024 * 1024,
      "Image size must be less than 5MB",
    ),
});

export const messageSchema = z.object({
  content: z
    .string()
    .min(1, "Message cannot be empty")
    .max(2000, "Message is too long"),
  attachment: z
    .instanceof(File)
    .refine((file) => !file || file.size <= MAX_FILE_SIZE, {
      message: "File size must be less than 5MB",
    })
    .optional(),
});

export const locationSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  address: z.string().min(5, { message: "Please enter a valid address" }),
  latitude: z.coerce.number().min(-90).max(90),
  longitude: z.coerce.number().min(-180).max(180),
  description: z
    .string()
    .min(10, { message: "Description must be at least 10 characters" }),
  services: z
    .array(z.string())
    .min(1, { message: "Select at least one service" }),
  phone: z.string().optional(),
  website: z
    .string()
    .url({ message: "Please enter a valid URL" })
    .optional()
    .or(z.literal("")),
  email: z
    .string()
    .email({ message: "Please enter a valid email" })
    .optional()
    .or(z.literal("")),
  opening_hours: z.string().optional(),
});
