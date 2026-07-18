import { z } from "zod";

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters.")
  .max(128, "Password must be 128 characters or fewer.")
  .regex(/[A-Z]/, "Password must include an uppercase letter.")
  .regex(/[a-z]/, "Password must include a lowercase letter.")
  .regex(/[0-9]/, "Password must include a number.");

export const credentialsSchema = z.object({
  email: z.email().transform((value) => value.toLowerCase()),
  password: z.string().min(1),
});

export const registerStudentSchema = z.object({
  course: z.string().max(120).optional(),
  department: z.string().max(120).optional(),
  email: z.email().transform((value) => value.toLowerCase()),
  name: z.string().min(2).max(120),
  password: passwordSchema,
  phone: z.string().max(30).optional(),
  studentId: z.string().max(80).optional(),
  yearOfStudy: z.coerce.number().int().min(1).max(8).optional(),
});

export const emailTokenSchema = z.object({
  email: z.email().transform((value) => value.toLowerCase()),
  token: z.string().min(32),
});

export const forgotPasswordSchema = z.object({
  email: z.email().transform((value) => value.toLowerCase()),
});

export const resetPasswordSchema = emailTokenSchema.extend({
  password: passwordSchema,
});

export type RegisterStudentInput = z.infer<typeof registerStudentSchema>;
