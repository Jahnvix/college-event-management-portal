import { prisma } from "@/server/database";

export function markNotificationRead(notificationId: string, userId: string) {
  return prisma.notification.updateMany({ data: { readAt: new Date() }, where: { id: notificationId, userId } });
}

export function markAllNotificationsRead(userId: string) {
  return prisma.notification.updateMany({ data: { readAt: new Date() }, where: { readAt: null, userId } });
}

export function deleteNotification(notificationId: string, userId: string) {
  return prisma.notification.deleteMany({ where: { id: notificationId, userId } });
}
