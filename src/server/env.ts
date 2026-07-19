import { z } from "zod";

const mongoConnectionMessage =
  "DATABASE_URL must be a valid MongoDB connection string using mongodb:// or mongodb+srv://.";

const serverEnvSchema = z.object({
  AUTH_SECRET: z
    .string()
    .min(16, "AUTH_SECRET must be at least 16 characters."),

  CLOUDINARY_API_KEY: z.string().optional(),
  CLOUDINARY_API_SECRET: z.string().optional(),
  CLOUDINARY_CLOUD_NAME: z.string().optional(),

  DATABASE_URL: z
    .string()
    .min(1, "DATABASE_URL is required.")
    .refine(
      (value) =>
        value.startsWith("mongodb://") ||
        value.startsWith("mongodb+srv://"),
      {
        message: mongoConnectionMessage,
      },
    ),

  EMAIL_FROM: z
    .string()
    .min(1, "EMAIL_FROM is required.")
    .optional(),

  RESEND_API_KEY: z.string().optional(),
});

export type ServerEnv = z.infer<typeof serverEnvSchema>;

type EnvSource = Record<string, string | undefined>;

let cachedServerEnv: ServerEnv | null = null;

function formatValidationErrors(error: z.ZodError) {
  return error.issues
    .map((issue) => `${issue.path.join(".") || "env"}: ${issue.message}`)
    .join("; ");
}

export function getServerEnv(source: EnvSource = process.env): ServerEnv {
  if (source === process.env && cachedServerEnv) {
    return cachedServerEnv;
  }

  const parsed = serverEnvSchema.safeParse(source);

  if (!parsed.success) {
    throw new Error(
      `Invalid server environment configuration: ${formatValidationErrors(parsed.error)}`,
    );
  }

  if (source === process.env) {
    cachedServerEnv = parsed.data;
  }

  return parsed.data;
}
