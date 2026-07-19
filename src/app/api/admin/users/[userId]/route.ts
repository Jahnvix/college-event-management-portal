import { UserRole, UserStatus } from "@prisma/client";
import { z } from "zod";

import { createAuditLog } from "@/server/audit/audit-service";
import { requireAdmin } from "@/server/auth/require-admin";
import { prisma } from "@/server/database";
import { createNotification } from "@/server/notifications/notification-service";
import { apiError, apiSuccess, validationError } from "@/server/http/api-response";

const updateUserSchema = z.object({
  role: z.nativeEnum(UserRole).optional(),
  status: z.nativeEnum(UserStatus).optional(),
});

type Context = { params: Promise<{ userId: string }> };

export async function PATCH(request: Request, { params }: Context) {
  const admin = await requireAdmin();

  if (!admin) {
    return apiError("Administrator access is required.", 403);
  }

  const json = await request.json().catch(() => null);
  const parsed = updateUserSchema.safeParse(json);

  if (!parsed.success) {
    return validationError(parsed.error);
  }

  const { userId } = await params;
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    return apiError("User not found.", 404);
  }

  const data = Object.fromEntries(
    Object.entries(parsed.data).filter(([, value]) => value !== undefined),
  );

  if (!Object.keys(data).length) {
    return apiError("No updates were provided.", 400);
  }

  const updatedUser = await prisma.user.update({
    data,
    include: {
      profile: true,
    },
    where: { id: userId },
  });

  await createAuditLog({
    actionType: "UPDATE",
    actorId: admin.id,
    entityId: updatedUser.id,
    entityType: "USER",
    metadata: {
      nextRole: updatedUser.role,
      nextStatus: updatedUser.status,
      previousRole: user.role,
      previousStatus: user.status,
    },
    summary: `Updated access for ${updatedUser.name}.`,
  });

  if (user.status !== updatedUser.status) {
    await createNotification({
      actionUrl: "/settings",
      message: `Your account status is now ${updatedUser.status.toLowerCase().replaceAll("_", " ")}.`,
      title: "Account access updated",
      type: "SECURITY",
      userId: updatedUser.id,
    });
  }

  return apiSuccess(updatedUser);
}
