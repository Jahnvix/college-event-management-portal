import { checkRateLimit } from "@/server/auth/rate-limit";
import { createSecureToken, createTokenExpiry, hashToken } from "@/server/auth/tokens";
import { forgotPasswordSchema } from "@/server/auth/validation";
import { prisma } from "@/server/database";
import { buildPasswordResetEmail } from "@/server/email/templates";
import { sendTransactionalEmail } from "@/server/email/email-service";
import { apiError, apiSuccess, validationError } from "@/server/http/api-response";

export async function POST(request: Request) {
  const ipAddress = request.headers.get("x-forwarded-for") ?? "local";
  const rateLimit = checkRateLimit(`forgot-password:${ipAddress}`, {
    limit: 5,
    windowMs: 15 * 60 * 1000,
  });

  if (!rateLimit.allowed) {
    return apiError(
      `Too many password reset attempts. Try again in ${rateLimit.retryAfterSeconds} seconds.`,
      429,
    );
  }

  const json = await request.json().catch(() => null);
  const parsed = forgotPasswordSchema.safeParse(json);

  if (!parsed.success) {
    return validationError(parsed.error);
  }

  const user = await prisma.user.findUnique({
    where: { email: parsed.data.email },
  });

  if (user) {
    const resetToken = createSecureToken();
    const identifier = `password-reset:${user.email}`;

    await prisma.verificationToken.deleteMany({
      where: { identifier },
    });

    await prisma.verificationToken.create({
      data: {
        expires: createTokenExpiry(60),
        identifier,
        token: hashToken(resetToken),
      },
    });

    const email = buildPasswordResetEmail({
      name: user.name,
      token: resetToken,
    });

    await sendTransactionalEmail({
      ...email,
      to: user.email,
    });
  }

  return apiSuccess({
    message:
      "If an account exists for that email, a password reset link has been sent.",
  });
}
