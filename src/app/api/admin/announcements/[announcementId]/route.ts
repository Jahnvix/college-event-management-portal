import { AnnouncementStatus, Prisma } from "@prisma/client";
import { z } from "zod";

import { requireAdmin } from "@/server/auth/require-admin";
import { prisma } from "@/server/database";
import { apiError, apiSuccess, validationError } from "@/server/http/api-response";

const updateSchema = z.object({ content: z.string().min(20).optional(), isPinned: z.boolean().optional(), scheduledFor: z.coerce.date().nullable().optional(), status: z.nativeEnum(AnnouncementStatus).optional(), summary: z.string().min(10).max(400).optional(), title: z.string().min(3).max(140).optional() });
type Context = { params: Promise<{ announcementId: string }> };

export async function PATCH(request: Request, { params }: Context) {
  if (!await requireAdmin()) return apiError("Administrator access is required.", 403);
  const parsed = updateSchema.safeParse(await request.json());
  if (!parsed.success) return validationError(parsed.error);
  const id = (await params).announcementId;
  const existing = await prisma.announcement.findUnique({ where: { id } });
  if (!existing) return apiError("Announcement not found.", 404);
  const data = Object.fromEntries(Object.entries(parsed.data).filter(([, value]) => value !== undefined)) as Prisma.AnnouncementUpdateInput;
  if (data.status === AnnouncementStatus.PUBLISHED && !existing.publishedAt) data.publishedAt = new Date();
  return apiSuccess(await prisma.announcement.update({ data, where: { id } }));
}

export async function DELETE(_: Request, { params }: Context) {
  if (!await requireAdmin()) return apiError("Administrator access is required.", 403);
  const id = (await params).announcementId;
  const result = await prisma.announcement.deleteMany({ where: { id } });
  if (!result.count) return apiError("Announcement not found.", 404);
  return apiSuccess({ deleted: true });
}
