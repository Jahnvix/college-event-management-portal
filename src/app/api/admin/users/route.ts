import { UserRole, UserStatus } from "@prisma/client";

import { requireAdmin } from "@/server/auth/require-admin";
import { prisma } from "@/server/database";
import { apiError, apiSuccess } from "@/server/http/api-response";

export async function GET(request: Request) {
  if (!await requireAdmin()) {
    return apiError("Administrator access is required.", 403);
  }

  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search")?.trim();
  const role = searchParams.get("role");
  const status = searchParams.get("status");

  const users = await prisma.user.findMany({
    include: {
      profile: true,
    },
    orderBy: { createdAt: "desc" },
    take: 60,
    where: {
      ...(search
        ? {
            OR: [
              { email: { contains: search, mode: "insensitive" } },
              { name: { contains: search, mode: "insensitive" } },
              { profile: { is: { studentId: { contains: search, mode: "insensitive" } } } },
            ],
          }
        : {}),
      ...(role && role in UserRole ? { role: role as UserRole } : {}),
      ...(status && status in UserStatus ? { status: status as UserStatus } : {}),
    },
  });

  return apiSuccess(users);
}
