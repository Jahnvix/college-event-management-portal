import { getCurrentUser } from "@/server/auth";
import { apiError, apiSuccess } from "@/server/http/api-response";
import { markAllNotificationsRead } from "@/server/notifications/notification-service";
export async function PATCH() { const user = await getCurrentUser(); if (!user?.id) return apiError("Authentication is required.", 401); const result = await markAllNotificationsRead(user.id); return apiSuccess({ updated: result.count }); }
