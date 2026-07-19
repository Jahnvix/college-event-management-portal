import { z } from "zod";

import { getCurrentUser } from "@/server/auth";
import { hashPassword, verifyPassword } from "@/server/auth/password";
import { passwordSchema } from "@/server/auth/validation";
import { prisma } from "@/server/database";
import { createNotification } from "@/server/notifications/notification-service";
import { apiError, apiSuccess, validationError } from "@/server/http/api-response";

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  nextPassword: passwordSchema,
});

export async function POST(request: Request) {
  const user = await getCurrentUser();

  if (!user?.id) {
    return apiError("Authentication is required.", 401);
  }

  const json = await request.json().catch(() => null);
  const parsed = changePasswordSchema.safeParse(json);

  if (!parsed.success) {
    return validationError(parsed.error);
  }

  const account = await prisma.user.findUnique({
    select: {
      id: true,
      passwordHash: true,
    },
    where: { id: user.id },
  });

  if (!account?.passwordHash) {
    return apiError("Password sign-in is not configured for this account.", 400);
  }

  const isValid = await verifyPassword(parsed.data.currentPassword, account.passwordHash);

  if (!isValid) {
    return apiError("Your current password is incorrect.", 400);
  }

  const passwordHash = await hashPassword(parsed.data.nextPassword);

  await prisma.user.update({
    data: { passwordHash },
    where: { id: user.id },
  });

  await createNotification({
    actionUrl: "/settings",
    message: "Your CampusPulse password was updated successfully.",
    title: "Password changed",
    type: "SECURITY",
    userId: user.id,
  });

  return apiSuccess({ updated: true });
}
