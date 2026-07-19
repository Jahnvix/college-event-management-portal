import { NotificationChannel, NotificationType, RegistrationStatus, UserRole, UserStatus } from "@prisma/client";
import { z } from "zod";

import { createAuditLog } from "@/server/audit/audit-service";
import { requireAdmin } from "@/server/auth/require-admin";
import { prisma } from "@/server/database";
import { createNotificationsForUsers } from "@/server/notifications/notification-service";
import { apiError, apiSuccess, validationError } from "@/server/http/api-response";

const audienceSchema = z.enum([
  "ACTIVE_STUDENTS",
  "ADMINS",
  "EVENT_ATTENDEES",
  "WAITLISTED",
  "SPECIFIC_USERS",
]);

const createNotificationSchema = z.object({
  actionUrl: z.string().min(1).max(200).optional(),
  audience: audienceSchema,
  channel: z.nativeEnum(NotificationChannel).default(NotificationChannel.IN_APP),
  eventId: z.string().optional(),
  message: z.string().min(10).max(500),
  title: z.string().min(3).max(120),
  type: z.nativeEnum(NotificationType).default(NotificationType.SYSTEM),
  userIds: z.array(z.string()).default([]),
});

async function resolveAudienceUserIds(input: z.infer<typeof createNotificationSchema>) {
  switch (input.audience) {
    case "ADMINS":
      return (
        await prisma.user.findMany({
          select: { id: true },
          where: { role: UserRole.ADMIN, status: UserStatus.ACTIVE },
        })
      ).map((user) => user.id);

    case "EVENT_ATTENDEES":
      if (!input.eventId) {
        return [];
      }

      return [
        ...new Set(
          (
            await prisma.registration.findMany({
              select: { userId: true },
              where: {
                eventId: input.eventId,
                status: {
                  in: [
                    RegistrationStatus.APPROVED,
                    RegistrationStatus.CHECKED_IN,
                    RegistrationStatus.PENDING,
                  ],
                },
              },
            })
          ).map((registration) => registration.userId),
        ),
      ];

    case "WAITLISTED":
      if (!input.eventId) {
        return [];
      }

      return [
        ...new Set(
          (
            await prisma.registration.findMany({
              select: { userId: true },
              where: {
                eventId: input.eventId,
                status: RegistrationStatus.WAITLISTED,
              },
            })
          ).map((registration) => registration.userId),
        ),
      ];

    case "SPECIFIC_USERS":
      return input.userIds;

    case "ACTIVE_STUDENTS":
    default:
      return (
        await prisma.user.findMany({
          select: { id: true },
          where: { role: UserRole.STUDENT, status: UserStatus.ACTIVE },
        })
      ).map((user) => user.id);
  }
}

export async function GET() {
  if (!(await requireAdmin())) {
    return apiError("Administrator access is required.", 403);
  }

  const notifications = await prisma.notification.findMany({
    include: {
      user: {
        select: {
          email: true,
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 25,
  });

  return apiSuccess(notifications);
}

export async function POST(request: Request) {
  const admin = await requireAdmin();

  if (!admin) {
    return apiError("Administrator access is required.", 403);
  }

  const json = await request.json().catch(() => null);
  const parsed = createNotificationSchema.safeParse(json);

  if (!parsed.success) {
    return validationError(parsed.error);
  }

  const userIds = await resolveAudienceUserIds(parsed.data);

  if (!userIds.length) {
    return apiError("No users matched the selected audience.", 400);
  }

  const result = await createNotificationsForUsers({
    // ✅ FIX
    actionUrl: parsed.data.actionUrl ?? null,
    channel: parsed.data.channel,
    message: parsed.data.message,
    metadata: {
      audience: parsed.data.audience,
      eventId: parsed.data.eventId ?? null,
    },
    title: parsed.data.title,
    type: parsed.data.type,
    userIds,
  });

  await createAuditLog({
    actionType: "SEND",
    actorId: admin.id,
    entityType: "NOTIFICATION",
    metadata: {
      audience: parsed.data.audience,
      deliveredCount: result.count,
      type: parsed.data.type,
    },
    summary: `Sent ${parsed.data.title} to ${result.count} recipients.`,
  });

  return apiSuccess({ delivered: result.count }, 201);
}
