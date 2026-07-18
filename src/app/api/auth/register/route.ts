import { hashPassword } from "@/server/auth/password";
import { checkRateLimit } from "@/server/auth/rate-limit";
import { createSecureToken, createTokenExpiry, hashToken } from "@/server/auth/tokens";
import { registerStudentSchema } from "@/server/auth/validation";
import { prisma } from "@/server/database";
import { buildVerificationEmail } from "@/server/email/templates";
import { sendTransactionalEmail } from "@/server/email/email-service";
import { apiError, apiSuccess, validationError } from "@/server/http/api-response";

export async function POST(request: Request) {
  const ipAddress = request.headers.get("x-forwarded-for") ?? "local";
  const rateLimit = checkRateLimit(`register:${ipAddress}`, {
    limit: 5,
    windowMs: 15 * 60 * 1000,
  });

  if (!rateLimit.allowed) {
    return apiError(
      `Too many registration attempts. Try again in ${rateLimit.retryAfterSeconds} seconds.`,
      429,
    );
  }

  const json = await request.json().catch(() => null);
  const parsed = registerStudentSchema.safeParse(json);

  if (!parsed.success) {
    return validationError(parsed.error);
  }

  const existingUser = await prisma.user.findUnique({
    where: { email: parsed.data.email },
  });

  if (existingUser) {
    return apiError("An account with this email already exists.", 409);
  }

  const passwordHash = await hashPassword(parsed.data.password);
  const verificationToken = createSecureToken();
  const verificationTokenHash = hashToken(verificationToken);
  const profileCreateData = {
    course: parsed.data.course ?? null,
    department: parsed.data.department ?? null,
    studentId: parsed.data.studentId ?? null,
    yearOfStudy: parsed.data.yearOfStudy ?? null,
  };

  const user = await prisma.user.create({
    data: {
      email: parsed.data.email,
      name: parsed.data.name,
      passwordHash,
      phone: parsed.data.phone ?? null,
      profile: {
        create: profileCreateData,
      },
      role: "STUDENT",
      status: "PENDING_VERIFICATION",
    },
    select: {
      email: true,
      id: true,
      name: true,
      role: true,
      status: true,
    },
  });

  await prisma.verificationToken.create({
    data: {
      expires: createTokenExpiry(24 * 60),
      identifier: `email-verification:${user.email}`,
      token: verificationTokenHash,
    },
  });

  const email = buildVerificationEmail({
    name: user.name,
    token: verificationToken,
  });

  await sendTransactionalEmail({
    ...email,
    to: user.email,
  });

  return apiSuccess({ user }, 201);
}
