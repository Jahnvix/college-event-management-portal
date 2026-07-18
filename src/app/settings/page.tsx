import { BellRing, CalendarClock, Mail } from "lucide-react";

import { DashboardShell } from "@/components/layouts/dashboard-shell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getCurrentUser } from "@/server/auth";
import { prisma } from "@/server/database";

export default async function SettingsPage() {
  const user = await getCurrentUser();
  if (!user?.id) return null;
  const profile = await prisma.profile.findUnique({ where: { userId: user.id } });
  const preferences = [{ icon: Mail, label: "Email announcements", enabled: profile?.emailAnnouncementsEnabled ?? true }, { icon: BellRing, label: "In-app notifications", enabled: profile?.inAppNotificationsEnabled ?? true }, { icon: CalendarClock, label: "Calendar sync", enabled: profile?.calendarSyncEnabled ?? false }];
  return <DashboardShell><div className="mx-auto max-w-3xl space-y-7"><header><p className="text-xs font-bold tracking-[0.2em] text-accent uppercase">Preferences</p><h1 className="mt-2 font-display text-3xl font-bold">Stay informed your way.</h1></header><Card><CardHeader><CardTitle>Notification channels</CardTitle><CardDescription>These preferences are stored with your student profile.</CardDescription></CardHeader><CardContent className="divide-y divide-border">{preferences.map(({ icon: Icon, label, enabled }) => <div className="flex items-center justify-between gap-5 py-4" key={label}><div className="flex items-center gap-3"><div className="rounded-xl bg-secondary p-2 text-primary"><Icon className="size-4" /></div><span className="text-sm font-bold">{label}</span></div><span className={enabled ? "rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-bold text-emerald-700 dark:text-emerald-300" : "rounded-full bg-secondary px-3 py-1 text-xs font-bold text-muted"}>{enabled ? "Enabled" : "Off"}</span></div>)}</CardContent></Card></div></DashboardShell>;
}
