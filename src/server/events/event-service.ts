import { EventStatus, RegistrationStatus } from "@prisma/client";
import { randomUUID } from "crypto";

import { prisma } from "@/server/database";

export async function registerForEvent(eventId: string, userId: string) {
  return prisma.$transaction(async (transaction) => {
    const event = await transaction.event.findFirst({ where: { id: eventId, status: EventStatus.PUBLISHED } });
    if (!event) throw new Error("EVENT_NOT_FOUND");
    if (event.registrationClosesAt <= new Date()) throw new Error("REGISTRATION_CLOSED");
    const existing = await transaction.registration.findUnique({ where: { userId_eventId: { eventId, userId } } });
    if (existing && existing.status !== RegistrationStatus.CANCELLED) throw new Error("ALREADY_REGISTERED");
    const isFull = event.approvedRegistrationsCount >= event.capacity;
    if (isFull && !event.allowWaitlist) throw new Error("EVENT_FULL");
    const status = isFull ? RegistrationStatus.WAITLISTED : event.requiresApproval ? RegistrationStatus.PENDING : RegistrationStatus.APPROVED;
    const registration = existing ? await transaction.registration.update({ data: { cancelledAt: null, status }, where: { id: existing.id } }) : await transaction.registration.create({ data: { eventId, qrCodeToken: randomUUID(), status, userId } });
    await transaction.event.update({ data: isFull ? { waitlistCount: { increment: 1 } } : { approvedRegistrationsCount: { increment: 1 } }, where: { id: event.id } });
    return registration;
  });
}

export async function cancelEventRegistration(eventId: string, userId: string) {
  return prisma.$transaction(async (transaction) => {
    const registration = await transaction.registration.findUnique({ where: { userId_eventId: { eventId, userId } } });
    if (!registration || ([RegistrationStatus.CANCELLED, RegistrationStatus.CHECKED_IN] as RegistrationStatus[]).includes(registration.status)) throw new Error("REGISTRATION_NOT_CANCELLABLE");
    await transaction.registration.update({ data: { cancelledAt: new Date(), status: RegistrationStatus.CANCELLED }, where: { id: registration.id } });
    await transaction.event.update({ data: registration.status === RegistrationStatus.WAITLISTED ? { waitlistCount: { decrement: 1 } } : { approvedRegistrationsCount: { decrement: 1 } }, where: { id: eventId } });
  });
}
