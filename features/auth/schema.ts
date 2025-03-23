import * as z from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

export const signInSchema = z.object({
  email: z.string().email().min(1, {
    message: "Email is required",
  }),
  password: z.string().min(1, {
    message: "Password is required",
  }),
});

export const signUpSchema = z
  .object({
    firstName: z.string().min(1, {
      message: "First Name is required",
    }),
    lastName: z.string().min(1, {
      message: "Last Name is required",
    }),
    username: z.string().min(1, {
      message: "Username is required",
    }),
    email: z.string().email().min(1, {
      message: "Email is required",
    }),
    password: z.string().min(1, {
      message: "Password is required",
    }),
    confirmPassword: z.string().min(1, {
      message: "Confirm Password is required",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const settingSchema = z.object({
  full_name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name cannot exceed 50 characters"),
  user_name: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username cannot exceed 30 characters")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers, and underscores",
    ),
  bio: z.string().max(500, "Bio must be less than 500 characters").optional(),
  email: z.string().email("Please enter a valid email address"),
  website: z
    .string()
    .url("Please enter a valid URL")
    .or(z.literal(""))
    .optional(),
  instagram: z
    .string()
    .regex(/^[a-zA-Z0-9_.]+$/, "Please enter a valid Instagram username")
    .or(z.literal(""))
    .optional(),
  twitter: z
    .string()
    .regex(/^[a-zA-Z0-9_]+$/, "Please enter a valid Twitter username")
    .or(z.literal(""))
    .optional(),
  avatar_image: z
    .instanceof(File)
    .optional()
    .refine(
      (file) => !file || file.size <= MAX_FILE_SIZE,
      "File must be less than 5MB",
    )
    .refine(
      (file) => !file || file.type.startsWith("image/"),
      "File must be an image",
    ),
  banner_image: z
    .instanceof(File)
    .optional()
    .refine(
      (file) => !file || file.size <= MAX_FILE_SIZE,
      "File must be less than 5MB",
    )
    .refine(
      (file) => !file || file.type.startsWith("image/"),
      "File must be an image",
    ),
  avatar_url: z.string().url("Invalid avatar URL").optional().or(z.literal("")),
  banner_url: z.string().url("Invalid banner URL").optional().or(z.literal("")),
});
