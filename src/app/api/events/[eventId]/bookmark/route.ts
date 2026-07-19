import { NextRequest } from "next/server";

import { getCurrentUser } from "@/server/auth";
import { prisma } from "@/server/database";
import { apiError, apiSuccess } from "@/server/http/api-response";

export async function POST(_: NextRequest, { params }: { params: Promise<{ eventId: string }> }) {
  const user = await getCurrentUser();
  if (!user?.id) return apiError("Authentication is required.", 401);
  const eventId = (await params).eventId;
  const event = await prisma.event.findUnique({ where: { id: eventId } });
  if (!event) return apiError("Event not found.", 404);
  const bookmark = await prisma.bookmark.upsert({ create: { eventId, userId: user.id }, update: {}, where: { userId_eventId: { eventId, userId: user.id } } });
  return apiSuccess(bookmark, 201);
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ eventId: string }> }) {
  const user = await getCurrentUser();
  if (!user?.id) return apiError("Authentication is required.", 401);
  const eventId = (await params).eventId;
  await prisma.bookmark.deleteMany({ where: { eventId, userId: user.id } });
  return apiSuccess({ bookmarked: false });
}
