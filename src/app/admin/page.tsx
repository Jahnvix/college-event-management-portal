import { Activity, CalendarDays, Megaphone, Users } from "lucide-react";

import { DashboardShell } from "@/components/layouts/dashboard-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AnalyticsDashboard } from "@/features/admin/components/analytics-dashboard";
import { EventManager } from "@/features/admin/components/event-manager";
import { NotificationManager } from "@/features/admin/components/notification-manager";
import { RegistrationManager } from "@/features/admin/components/registration-manager";
import { UserManager } from "@/features/admin/components/user-manager";
import { getCurrentUser } from "@/server/auth";
import { prisma } from "@/server/database";

export default async function AdminPage() {
  const user = await getCurrentUser();
  if (!user?.id) return null;
  const [users, events, announcements, registrations, auditLogs] = await Promise.all([
    prisma.user.count(), prisma.event.count(), prisma.announcement.count(), prisma.registration.count(),
    prisma.auditLog.findMany({ include: { actor: { select: { name: true } } }, orderBy: { createdAt: "desc" }, take: 6 }),
  ]);
  const metrics = [{ label: "Students", value: users, icon: Users }, { label: "Events", value: events, icon: CalendarDays }, { label: "Registrations", value: registrations, icon: Activity }, { label: "Announcements", value: announcements, icon: Megaphone }];
  return <DashboardShell><div className="space-y-8"><header><p className="text-xs font-bold tracking-[0.2em] text-accent uppercase">Administration</p><h1 className="mt-2 font-display text-3xl font-bold">Campus operations, at a glance.</h1><p className="mt-2 max-w-3xl text-sm text-muted">Manage events, students, registrations, outreach, and platform health without leaving the control center.</p></header><section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{metrics.map(({ label, value, icon: Icon }) => <Card key={label}><CardContent className="flex items-center gap-4 p-5"><div className="rounded-2xl bg-secondary p-3 text-primary"><Icon className="size-5" /></div><div><p className="font-display text-2xl font-bold">{value}</p><p className="text-xs text-muted">{label}</p></div></CardContent></Card>)}</section><EventManager /><UserManager /><RegistrationManager /><AnalyticsDashboard /><NotificationManager /><Card><CardHeader><CardTitle>Recent audit activity</CardTitle></CardHeader><CardContent className="space-y-3">{auditLogs.length ? auditLogs.map((log) => <div className="flex items-center justify-between gap-4 rounded-xl border border-border p-4 text-sm" key={log.id}><span>{log.summary}</span><span className="shrink-0 text-xs text-muted">{log.actor?.name ?? "System"}</span></div>) : <p className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted">Administrative activity will appear here.</p>}</CardContent></Card></div></DashboardShell>;
}
