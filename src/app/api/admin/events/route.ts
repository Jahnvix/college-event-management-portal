import { EventCategory, EventDifficulty, EventStatus } from "@prisma/client";
import { z } from "zod";
import { requireAdmin } from "@/server/auth/require-admin";
import { prisma } from "@/server/database";
import { apiError, apiSuccess, validationError } from "@/server/http/api-response";

const schema = z.object({ title: z.string().min(3).max(120), shortDescription: z.string().min(10).max(280), description: z.string().min(20), venueName: z.string().min(2), venueAddress: z.string().min(2), venueCity: z.string().min(2), startAt: z.coerce.date(), endAt: z.coerce.date(), registrationClosesAt: z.coerce.date(), capacity: z.coerce.number().int().positive(), category: z.nativeEnum(EventCategory), difficulty: z.nativeEnum(EventDifficulty).default(EventDifficulty.OPEN), tags: z.array(z.string()).default([]) });

export async function GET() { if (!await requireAdmin()) return apiError("Administrator access is required.", 403); return apiSuccess(await prisma.event.findMany({ orderBy: { createdAt: "desc" } })); }
export async function POST(request: Request) { const admin = await requireAdmin(); if (!admin) return apiError("Administrator access is required.", 403); const parsed = schema.safeParse(await request.json()); if (!parsed.success) return validationError(parsed.error); const data = parsed.data; const slug = `${data.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}-${Date.now()}`; return apiSuccess(await prisma.event.create({ data: { ...data, endAt: data.endAt, galleryImageUrls: [], organizerId: admin.id, slug, status: EventStatus.DRAFT } }), 201); }
