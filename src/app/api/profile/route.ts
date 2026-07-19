import { z } from "zod";

import { getCurrentUser } from "@/server/auth";
import { prisma } from "@/server/database";
import { apiError, apiSuccess, validationError } from "@/server/http/api-response";

const profileSchema = z.object({
  bio: z.string().max(500).optional(),
  city: z.string().max(100).optional(),
  country: z.string().max(100).optional(),
  course: z.string().max(100).optional(),
  department: z.string().max(100).optional(),
  emailAnnouncementsEnabled: z.boolean().optional(),
  emailReminderEnabled: z.boolean().optional(),
  inAppNotificationsEnabled: z.boolean().optional(),
  interests: z.array(z.string().max(60)).max(12).optional(),
  calendarSyncEnabled: z.boolean().optional(),
  studentId: z.string().max(100).optional(),
  yearOfStudy: z.number().int().min(1).max(10).nullable().optional(),
});

export async function PATCH(request: Request) {
  const user = await getCurrentUser();
  if (!user?.id) return apiError("Authentication is required.", 401);
  const parsed = profileSchema.safeParse(await request.json());
  if (!parsed.success) return validationError(parsed.error);
  const data = Object.fromEntries(Object.entries(parsed.data).filter(([, value]) => value !== undefined));
  return apiSuccess(await prisma.profile.upsert({ create: { ...data, interests: [], userId: user.id }, update: data, where: { userId: user.id } }));
}
