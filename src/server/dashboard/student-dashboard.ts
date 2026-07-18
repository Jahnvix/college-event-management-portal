import { AnnouncementStatus, EventStatus, RegistrationStatus } from "@prisma/client";

import { prisma } from "@/server/database";

export async function getStudentDashboard(userId: string) {
  const now = new Date();
  const [registrations, announcements, bookmarks] = await Promise.all([
    prisma.registration.findMany({
      include: { event: true },
      orderBy: { event: { startAt: "asc" } },
      where: {
        event: { startAt: { gte: now } },
        status: { in: [RegistrationStatus.APPROVED, RegistrationStatus.PENDING, RegistrationStatus.WAITLISTED] },
        userId,
      },
    }),
    prisma.announcement.findMany({
      include: { author: { select: { name: true } } },
      orderBy: [{ isPinned: "desc" }, { publishedAt: "desc" }],
      take: 4,
      where: {
        status: AnnouncementStatus.PUBLISHED,
        OR: [{ expiresAt: null }, { expiresAt: { gt: now } }],
      },
    }),
    prisma.bookmark.count({ where: { userId } }),
  ]);

  const upcomingEvents = await prisma.event.findMany({
    orderBy: [{ isFeatured: "desc" }, { startAt: "asc" }],
    take: 5,
    where: { startAt: { gte: now }, status: EventStatus.PUBLISHED },
  });

  return { announcements, bookmarks, registrations, upcomingEvents };
}
