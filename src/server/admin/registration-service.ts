import { AuditActionType, AuditEntityType, RegistrationStatus } from "@prisma/client";

import { createNotification } from "@/server/notifications/notification-service";
import { prisma } from "@/server/database";

function usesApprovedSeat(status: RegistrationStatus) {
  return [RegistrationStatus.APPROVED, RegistrationStatus.CHECKED_IN, RegistrationStatus.NO_SHOW].includes(
    status,
  );
}

function usesWaitlistSlot(status: RegistrationStatus) {
  return status === RegistrationStatus.WAITLISTED;
}

function getActionType(status: RegistrationStatus) {
  switch (status) {
    case RegistrationStatus.APPROVED:
      return AuditActionType.APPROVE;
    case RegistrationStatus.REJECTED:
      return AuditActionType.REJECT;
    case RegistrationStatus.CANCELLED:
      return AuditActionType.CANCEL;
    case RegistrationStatus.CHECKED_IN:
      return AuditActionType.CHECK_IN;
    default:
      return AuditActionType.UPDATE;
  }
}

export async function updateRegistrationByAdmin(input: {
  actorId: string;
  notes?: string;
  registrationId: string;
  status?: RegistrationStatus;
}) {
  const result = await prisma.$transaction(async (transaction) => {
    const registration = await transaction.registration.findUnique({
      include: {
        event: {
          select: {
            id: true,
            title: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      where: { id: input.registrationId },
    });

    if (!registration) {
      throw new Error("REGISTRATION_NOT_FOUND");
    }

    const nextStatus = input.status ?? registration.status;
    const wasApproved = usesApprovedSeat(registration.status);
    const isApproved = usesApprovedSeat(nextStatus);
    const wasWaitlisted = usesWaitlistSlot(registration.status);
    const isWaitlisted = usesWaitlistSlot(nextStatus);

    const updatedRegistration = await transaction.registration.update({
      data: {
        approvedAt: nextStatus === RegistrationStatus.APPROVED ? new Date() : registration.approvedAt,
        attendedAt: nextStatus === RegistrationStatus.CHECKED_IN ? new Date() : registration.attendedAt,
        cancelledAt: nextStatus === RegistrationStatus.CANCELLED ? new Date() : registration.cancelledAt,
        notes: input.notes ?? registration.notes,
        rejectedAt: nextStatus === RegistrationStatus.REJECTED ? new Date() : registration.rejectedAt,
        status: nextStatus,
        waitlistedAt: nextStatus === RegistrationStatus.WAITLISTED ? new Date() : registration.waitlistedAt,
      },
      where: { id: registration.id },
    });

    if (wasApproved !== isApproved || wasWaitlisted !== isWaitlisted) {
      await transaction.event.update({
        data: {
          approvedRegistrationsCount: {
            decrement: wasApproved && !isApproved ? 1 : 0,
            increment: !wasApproved && isApproved ? 1 : 0,
          },
          waitlistCount: {
            decrement: wasWaitlisted && !isWaitlisted ? 1 : 0,
            increment: !wasWaitlisted && isWaitlisted ? 1 : 0,
          },
        },
        where: { id: registration.event.id },
      });
    }

    await transaction.auditLog.create({
      data: {
        actionType: getActionType(nextStatus),
        actorId: input.actorId,
        entityId: registration.id,
        entityType: AuditEntityType.REGISTRATION,
        metadata: {
          eventId: registration.event.id,
          nextStatus,
          previousStatus: registration.status,
          userId: registration.user.id,
        },
        summary: `${registration.user.name} was moved to ${nextStatus.toLowerCase()} for ${registration.event.title}.`,
      },
    });

    return {
      eventTitle: registration.event.title,
      registration: updatedRegistration,
      userId: registration.user.id,
    };
  });

  await createNotification({
    actionUrl: "/dashboard",
    message: `Your registration for ${result.eventTitle} is now ${result.registration.status.toLowerCase()}.`,
    title: "Registration updated",
    type:
      result.registration.status === RegistrationStatus.WAITLISTED
        ? "WAITLIST_UPDATE"
        : "REGISTRATION_UPDATE",
    userId: result.userId,
  });

  return result.registration;
}
