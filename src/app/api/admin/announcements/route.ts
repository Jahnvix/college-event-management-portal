import { AnnouncementScope, AnnouncementStatus } from "@prisma/client";
import { z } from "zod";
import { requireAdmin } from "@/server/auth/require-admin";
import { prisma } from "@/server/database";
import { apiError, apiSuccess, validationError } from "@/server/http/api-response";

const schema = z.object({ title: z.string().min(3).max(140), summary: z.string().min(10).max(400), content: z.string().min(20), scope: z.nativeEnum(AnnouncementScope).default(AnnouncementScope.GLOBAL), status: z.nativeEnum(AnnouncementStatus).default(AnnouncementStatus.DRAFT), isPinned: z.boolean().default(false), scheduledFor: z.coerce.date().nullable().optional() });

export async function GET() { if (!await requireAdmin()) return apiError("Administrator access is required.", 403); return apiSuccess(await prisma.announcement.findMany({ orderBy: { createdAt: "desc" } })); }
export async function POST(request: Request) { const admin = await requireAdmin(); if (!admin) return apiError("Administrator access is required.", 403); const parsed = schema.safeParse(await request.json()); if (!parsed.success) return validationError(parsed.error); const data = parsed.data; const slug = `${data.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}-${Date.now()}`; return apiSuccess(await prisma.announcement.create({ data: { ...data, authorId: admin.id, publishedAt: data.status === AnnouncementStatus.PUBLISHED ? new Date() : null, scheduledFor: data.scheduledFor ?? null, slug } }), 201); }
