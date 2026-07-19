import type { AuditActionType, AuditEntityType, Prisma } from "@prisma/client";

import { prisma } from "@/server/database";

type CreateAuditLogInput = {
  actionType: AuditActionType;
  actorId?: string | null;
  entityId?: string | null;
  entityType: AuditEntityType;
  metadata?: Prisma.InputJsonValue;
  summary: string;
};

export function createAuditLog(input: CreateAuditLogInput) {
  return prisma.auditLog.create({
    data: {
      actionType: input.actionType,
      actorId: input.actorId ?? null,
      entityId: input.entityId ?? null,
      entityType: input.entityType,
      metadata: input.metadata,
      summary: input.summary,
    },
  });
}
