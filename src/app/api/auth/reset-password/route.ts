import { hashPassword } from "@/server/auth/password";
import { hashToken } from "@/server/auth/tokens";
import { resetPasswordSchema } from "@/server/auth/validation";
import { prisma } from "@/server/database";
import { apiError, apiSuccess, validationError } from "@/server/http/api-response";

export async function POST(request: Request) {
  const json = await request.json().catch(() => null);
  const parsed = resetPasswordSchema.safeParse(json);

  if (!parsed.success) {
    return validationError(parsed.error);
  }

  const identifier = `password-reset:${parsed.data.email}`;
  const token = hashToken(parsed.data.token);
  const resetToken = await prisma.verificationToken.findFirst({
    where: {
      expires: { gt: new Date() },
      identifier,
      token,
    },
  });

  if (!resetToken) {
    return apiError("Password reset token is invalid or expired.", 400);
  }

  const passwordHash = await hashPassword(parsed.data.password);

  await prisma.user.update({
    data: { passwordHash },
    where: { email: parsed.data.email },
  });

  await prisma.verificationToken.deleteMany({
    where: { identifier },
  });

  return apiSuccess({ reset: true });
}
