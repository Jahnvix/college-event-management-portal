import { RegistrationStatus } from "@prisma/client";
import { z } from "zod";

import { requireAdmin } from "@/server/auth/require-admin";
import { updateRegistrationByAdmin } from "@/server/admin/registration-service";
import { apiError, apiSuccess, validationError } from "@/server/http/api-response";

const updateRegistrationSchema = z.object({
  notes: z.string().max(500).optional(),
  status: z.nativeEnum(RegistrationStatus).optional(),
});

type Context = { params: Promise<{ registrationId: string }> };

export async function PATCH(request: Request, { params }: Context) {
  const admin = await requireAdmin();

  if (!admin) {
    return apiError("Administrator access is required.", 403);
  }

  const json = await request.json().catch(() => null);
  const parsed = updateRegistrationSchema.safeParse(json);

  if (!parsed.success) {
    return validationError(parsed.error);
  }

  try {
    const registration = await updateRegistrationByAdmin({
      actorId: admin.id,
      notes: parsed.data.notes,
      registrationId: (await params).registrationId,
      status: parsed.data.status,
    });

    return apiSuccess(registration);
  } catch (error) {
    if (error instanceof Error && error.message === "REGISTRATION_NOT_FOUND") {
      return apiError("Registration not found.", 404);
    }

    throw error;
  }
}
