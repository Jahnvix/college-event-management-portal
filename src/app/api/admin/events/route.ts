import { EventCategory, EventDifficulty, EventStatus } from "@prisma/client";
import { z } from "zod";
import { requireAdmin } from "@/server/auth/require-admin";
import { prisma } from "@/server/database";
import { apiError, apiSuccess, validationError } from "@/server/http/api-response";

const schema = z.object({
  allowWaitlist: z.boolean().default(true),
  capacity: z.coerce.number().int().positive(),
  category: z.nativeEnum(EventCategory),
  description: z.string().min(20),
  difficulty: z.nativeEnum(EventDifficulty).default(EventDifficulty.OPEN),
  endAt: z.coerce.date(),
  isFeatured: z.boolean().default(false),
  registrationClosesAt: z.coerce.date(),
  requiresApproval: z.boolean().default(false),
  shortDescription: z.string().min(10).max(280),
  startAt: z.coerce.date(),
  tags: z.array(z.string()).default([]),
  title: z.string().min(3).max(120),
  venueAddress: z.string().min(2),
  venueCity: z.string().min(2),
  venueName: z.string().min(2),
});

export async function GET() { if (!await requireAdmin()) return apiError("Administrator access is required.", 403); return apiSuccess(await prisma.event.findMany({ orderBy: { createdAt: "desc" } })); }
export async function POST(request: Request) { const admin = await requireAdmin(); if (!admin) return apiError("Administrator access is required.", 403); const parsed = schema.safeParse(await request.json()); if (!parsed.success) return validationError(parsed.error); const data = parsed.data; const slug = `${data.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}-${Date.now()}`; return apiSuccess(await prisma.event.create({ data: { ...data, galleryImageUrls: [], organizerId: admin.id, publishedAt: null, slug, status: EventStatus.DRAFT } }), 201); }
