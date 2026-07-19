import { DashboardShell } from "@/components/layouts/dashboard-shell";
import { NotificationList } from "@/features/notifications/components/notification-list";
import { getCurrentUser } from "@/server/auth";
import { prisma } from "@/server/database";

export default async function NotificationsPage() {
  const user = await getCurrentUser();
  if (!user?.id) return null;
  const notifications = await prisma.notification.findMany({ orderBy: { createdAt: "desc" }, take: 30, where: { userId: user.id } });
  return <DashboardShell><div className="mx-auto max-w-3xl"><header><p className="text-xs font-bold tracking-[0.2em] text-accent uppercase">Updates</p><h1 className="mt-2 font-display text-3xl font-bold">Notifications</h1></header><NotificationList initialNotifications={notifications.map((item) => ({ id: item.id, message: item.message, readAt: item.readAt?.toISOString() ?? null, title: item.title }))} /></div></DashboardShell>;
}
