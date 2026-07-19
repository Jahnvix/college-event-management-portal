import { AnnouncementStatus, EventStatus, RegistrationStatus, UserStatus } from "@prisma/client";

import { requireAdmin } from "@/server/auth/require-admin";
import { prisma } from "@/server/database";
import { apiError, apiSuccess } from "@/server/http/api-response";

function countByKey<T extends string>(values: T[]) {
  return values.reduce<Record<T, number>>(
    (accumulator, value) => ({
      ...accumulator,
      [value]: (accumulator[value] ?? 0) + 1,
    }),
    {} as Record<T, number>,
  );
}

export async function GET() {
  if (!await requireAdmin()) {
    return apiError("Administrator access is required.", 403);
  }

  const now = new Date();
  const [users, events, registrations, announcements, recentAudit] = await Promise.all([
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: { createdAt: true, role: true, status: true },
      take: 200,
    }),
    prisma.event.findMany({
      orderBy: { startAt: "asc" },
      select: {
        approvedRegistrationsCount: true,
        bookmarkCount: true,
        category: true,
        id: true,
        startAt: true,
        status: true,
        title: true,
        waitlistCount: true,
      },
      take: 200,
    }),
    prisma.registration.findMany({
      orderBy: { createdAt: "desc" },
      select: { createdAt: true, status: true },
      take: 400,
    }),
    prisma.announcement.count({
      where: { status: AnnouncementStatus.PUBLISHED },
    }),
    prisma.auditLog.findMany({
      include: {
        actor: {
          select: { name: true },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 6,
    }),
  ]);

  const activeStudents = users.filter((user) => user.role === "STUDENT" && user.status === UserStatus.ACTIVE).length;
  const upcomingEvents = events.filter((event) => event.startAt >= now && event.status === EventStatus.PUBLISHED);
  const totalApproved = registrations.filter((registration) =>
    [RegistrationStatus.APPROVED, RegistrationStatus.CHECKED_IN, RegistrationStatus.NO_SHOW].includes(
      registration.status,
    ),
  ).length;

  return apiSuccess({
    distributions: {
      eventsByCategory: countByKey(events.map((event) => event.category)),
      eventsByStatus: countByKey(events.map((event) => event.status)),
      registrationsByStatus: countByKey(registrations.map((registration) => registration.status)),
      usersByStatus: countByKey(users.map((user) => user.status)),
    },
    recentActivity: recentAudit,
    topEvents: [...events]
      .sort(
        (left, right) =>
          right.approvedRegistrationsCount + right.waitlistCount + right.bookmarkCount -
          (left.approvedRegistrationsCount + left.waitlistCount + left.bookmarkCount),
      )
      .slice(0, 5),
    totals: {
      activeStudents,
      approvalRate: registrations.length ? Math.round((totalApproved / registrations.length) * 100) : 0,
      publishedAnnouncements: announcements,
      publishedEvents: events.filter((event) => event.status === EventStatus.PUBLISHED).length,
      registrations: registrations.length,
      upcomingEvents: upcomingEvents.length,
      users: users.length,
    },
  });
}
