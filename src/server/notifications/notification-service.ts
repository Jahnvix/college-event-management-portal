import type { NotificationChannel, NotificationType, Prisma } from "@prisma/client";

import { prisma } from "@/server/database";

type CreateNotificationInput = {
  actionUrl?: string | null;
  channel?: NotificationChannel;
  message: string;
  metadata?: Prisma.InputJsonValue;
  title: string;
  type: NotificationType;
  userId: string;
};

type CreateNotificationsForUsersInput = Omit<CreateNotificationInput, "userId"> & {
  respectInAppPreference?: boolean;
  userIds: string[];
};

export function markNotificationRead(notificationId: string, userId: string) {
  return prisma.notification.updateMany({
    data: { readAt: new Date() },
    where: { id: notificationId, userId },
  });
}

export function markAllNotificationsRead(userId: string) {
  return prisma.notification.updateMany({
    data: { readAt: new Date() },
    where: { readAt: null, userId },
  });
}

export function deleteNotification(notificationId: string, userId: string) {
  return prisma.notification.deleteMany({
    where: { id: notificationId, userId },
  });
}

export function createNotification(input: CreateNotificationInput) {
  return prisma.notification.create({
    data: {
      actionUrl: input.actionUrl ?? null,
      channel: input.channel ?? "IN_APP",
      deliveredAt: new Date(),
      message: input.message,
      metadata: input.metadata ?? null,
      title: input.title,
      type: input.type,
      userId: input.userId,
    },
  });
}

export async function createNotificationsForUsers(
  input: CreateNotificationsForUsersInput,
) {
  const uniqueUserIds = [...new Set(input.userIds)];

  if (!uniqueUserIds.length) {
    return { count: 0 };
  }

  const optedInUserIds =
    input.respectInAppPreference === false
      ? uniqueUserIds
      : (
          await prisma.profile.findMany({
            select: { userId: true },
            where: {
              inAppNotificationsEnabled: true,
              userId: { in: uniqueUserIds },
            },
          })
        ).map((profile) => profile.userId);

  if (!optedInUserIds.length) {
    return { count: 0 };
  }

  await prisma.$transaction(
    optedInUserIds.map((userId) =>
      prisma.notification.create({
        data: {
          actionUrl: input.actionUrl ?? null,
          channel: input.channel ?? "IN_APP",
          deliveredAt: new Date(),
          message: input.message,
          metadata: input.metadata ?? null,
          title: input.title,
          type: input.type,
          userId,
        },
      }),
    ),
  );

  return { count: optedInUserIds.length };
}
