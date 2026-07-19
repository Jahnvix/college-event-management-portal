import { CalendarDays } from "lucide-react";
import { RegistrationStatus } from "@prisma/client";
import { DashboardShell } from "@/components/layouts/dashboard-shell";
import { Card, CardContent } from "@/components/ui/card";
import { getCurrentUser } from "@/server/auth";
import { prisma } from "@/server/database";

const formatter = new Intl.DateTimeFormat("en-IN", { dateStyle: "full", timeStyle: "short" });
export default async function CalendarPage() { const user = await getCurrentUser(); if (!user?.id) return null; const registrations = await prisma.registration.findMany({ include: { event: true }, orderBy: { event: { startAt: "asc" } }, where: { status: { in: [RegistrationStatus.APPROVED, RegistrationStatus.PENDING, RegistrationStatus.WAITLISTED] }, userId: user.id } }); return <DashboardShell><div className="space-y-7"><header><p className="text-xs font-bold tracking-[0.2em] text-accent uppercase">Schedule</p><h1 className="mt-2 font-display text-3xl font-bold">Your event calendar</h1></header><div className="space-y-3">{registrations.length ? registrations.map(({ event, id }) => <Card key={id}><CardContent className="flex gap-4 p-5"><CalendarDays className="size-5 text-primary" /><div><p className="font-bold">{event.title}</p><p className="mt-1 text-sm text-muted">{formatter.format(event.startAt)} · {event.venueName}</p></div></CardContent></Card>) : <Card><CardContent className="p-10 text-center text-sm text-muted">Register for an event to add it to your calendar.</CardContent></Card>}</div></div></DashboardShell>; }
