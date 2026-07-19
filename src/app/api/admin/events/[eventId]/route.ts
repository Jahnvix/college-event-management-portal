import { EventStatus, Prisma } from "@prisma/client";
import { z } from "zod";

import { requireAdmin } from "@/server/auth/require-admin";
import { prisma } from "@/server/database";
import { apiError, apiSuccess, validationError } from "@/server/http/api-response";

const updateSchema = z.object({ title: z.string().min(3).max(120).optional(), shortDescription: z.string().min(10).max(280).optional(), description: z.string().min(20).optional(), venueName: z.string().min(2).optional(), venueAddress: z.string().min(2).optional(), venueCity: z.string().min(2).optional(), capacity: z.number().int().positive().optional(), status: z.nativeEnum(EventStatus).optional() });
type Context = { params: Promise<{ eventId: string }> };

export async function PATCH(request: Request, { params }: Context) {
  if (!await requireAdmin()) return apiError("Administrator access is required.", 403);
  const parsed = updateSchema.safeParse(await request.json());
  if (!parsed.success) return validationError(parsed.error);
  const id = (await params).eventId;
  const event = await prisma.event.findUnique({ where: { id } });
  if (!event) return apiError("Event not found.", 404);
  const data = Object.fromEntries(Object.entries(parsed.data).filter(([, value]) => value !== undefined)) as Prisma.EventUpdateInput;
  return apiSuccess(await prisma.event.update({ data, where: { id } }));
}

export async function DELETE(_: Request, { params }: Context) {
  if (!await requireAdmin()) return apiError("Administrator access is required.", 403);
  const id = (await params).eventId;
  const event = await prisma.event.findUnique({ where: { id } });
  if (!event) return apiError("Event not found.", 404);
  await prisma.event.delete({ where: { id } });
  return apiSuccess({ deleted: true });
}
