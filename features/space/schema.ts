import * as z from "zod";

export const postSchema = z.object({
  content: z
    .string()
    .min(1, "Content is required")
    .max(2000, "Content must be less than 2000 characters"),
  image: z.instanceof(File).optional(),
});
