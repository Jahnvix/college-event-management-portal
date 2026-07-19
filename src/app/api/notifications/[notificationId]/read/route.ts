import { NextRequest } from "next/server";

import { getCurrentUser } from "@/server/auth";
import { apiError, apiSuccess } from "@/server/http/api-response";
import { deleteNotification, markNotificationRead } from "@/server/notifications/notification-service";

export async function PATCH(_: NextRequest, { params }: { params: Promise<{ notificationId: string }> }) {
  const user = await getCurrentUser();
  if (!user?.id) return apiError("Authentication is required.", 401);
  const result = await markNotificationRead((await params).notificationId, user.id);
  if (!result.count) return apiError("Notification not found.", 404);
  return apiSuccess({ read: true });
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ notificationId: string }> }) { const user = await getCurrentUser(); if (!user?.id) return apiError("Authentication is required.", 401); const result = await deleteNotification((await params).notificationId, user.id); if (!result.count) return apiError("Notification not found.", 404); return apiSuccess({ deleted: true }); }
