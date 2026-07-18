import { emailTokenSchema } from "@/server/auth/validation";
import { hashToken } from "@/server/auth/tokens";
import { prisma } from "@/server/database";
import { apiError, apiSuccess, validationError } from "@/server/http/api-response";

export async function POST(request: Request) {
  const json = await request.json().catch(() => null);
  const parsed = emailTokenSchema.safeParse(json);

  if (!parsed.success) {
    return validationError(parsed.error);
  }

  const identifier = `email-verification:${parsed.data.email}`;
  const token = hashToken(parsed.data.token);
  const verificationToken = await prisma.verificationToken.findFirst({
    where: {
      expires: { gt: new Date() },
      identifier,
      token,
    },
  });

  if (!verificationToken) {
    return apiError("Verification token is invalid or expired.", 400);
  }

  await prisma.user.update({
    data: {
      emailVerified: new Date(),
      status: "ACTIVE",
    },
    where: { email: parsed.data.email },
  });

  await prisma.verificationToken.deleteMany({
    where: { identifier },
  });

  return apiSuccess({ verified: true });
}
