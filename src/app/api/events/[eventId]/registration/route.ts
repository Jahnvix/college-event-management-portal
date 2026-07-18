import { NextRequest } from "next/server";

import { getCurrentUser } from "@/server/auth";
import { cancelEventRegistration, registerForEvent } from "@/server/events/event-service";
import { apiError, apiSuccess } from "@/server/http/api-response";

type RouteContext = { params: Promise<{ eventId: string }> };

export async function POST(_: NextRequest, { params }: RouteContext) {
  const user = await getCurrentUser();
  if (!user?.id) return apiError("Authentication is required.", 401);
  try { return apiSuccess(await registerForEvent((await params).eventId, user.id), 201); }
  catch (error) { return apiError(messageFor(error), 409); }
}

export async function DELETE(_: NextRequest, { params }: RouteContext) {
  const user = await getCurrentUser();
  if (!user?.id) return apiError("Authentication is required.", 401);
  try { await cancelEventRegistration((await params).eventId, user.id); return apiSuccess({ cancelled: true }); }
  catch (error) { return apiError(messageFor(error), 409); }
}

function messageFor(error: unknown) {
  const code = error instanceof Error ? error.message : "UNKNOWN";
  return ({ ALREADY_REGISTERED: "You are already registered.", EVENT_FULL: "This event is full.", EVENT_NOT_FOUND: "Event not found.", REGISTRATION_CLOSED: "Registration is closed.", REGISTRATION_NOT_CANCELLABLE: "This registration cannot be cancelled." } as Record<string, string>)[code] ?? "The request could not be completed.";
}
