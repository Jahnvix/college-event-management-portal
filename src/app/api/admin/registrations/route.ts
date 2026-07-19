import { RegistrationStatus } from "@prisma/client";

import { requireAdmin } from "@/server/auth/require-admin";
import { prisma } from "@/server/database";
import { apiError, apiSuccess } from "@/server/http/api-response";

export async function GET(request: Request) {
  if (!await requireAdmin()) {
    return apiError("Administrator access is required.", 403);
  }

  const { searchParams } = new URL(request.url);
  const eventId = searchParams.get("eventId");
  const search = searchParams.get("search")?.trim();
  const status = searchParams.get("status");

  const registrations = await prisma.registration.findMany({
    include: {
      event: {
        select: {
          id: true,
          startAt: true,
          title: true,
        },
      },
      user: {
        select: {
          email: true,
          id: true,
          name: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 80,
    where: {
      ...(eventId ? { eventId } : {}),
      ...(search
        ? {
            OR: [
              { event: { title: { contains: search, mode: "insensitive" } } },
              { user: { email: { contains: search, mode: "insensitive" } } },
              { user: { name: { contains: search, mode: "insensitive" } } },
            ],
          }
        : {}),
      ...(status && status in RegistrationStatus
        ? { status: status as RegistrationStatus }
        : {}),
    },
  });

  return apiSuccess(registrations);
}
