import { DashboardShell } from "@/components/layouts/dashboard-shell";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProfileForm } from "@/features/profile/components/profile-form";
import { getCurrentUser } from "@/server/auth";
import { prisma } from "@/server/database";

export default async function ProfilePage() {
  const user = await getCurrentUser();
  if (!user?.id) return null;
  const profile = await prisma.profile.findUnique({ where: { userId: user.id } });
  const fields = [["Campus ID", profile?.studentId], ["Department", profile?.department], ["Course", profile?.course], ["Year", profile?.yearOfStudy ? `Year ${profile.yearOfStudy}` : null]];
  return <DashboardShell><div className="mx-auto max-w-3xl space-y-7"><header><p className="text-xs font-bold tracking-[0.2em] text-accent uppercase">Your profile</p><h1 className="mt-2 font-display text-3xl font-bold">A little about you.</h1></header><Card><CardContent className="flex flex-col gap-5 p-7 sm:flex-row sm:items-center"><div className="flex size-20 items-center justify-center rounded-full bg-primary font-display text-2xl font-bold text-primary-foreground">{user.name?.slice(0, 1).toUpperCase()}</div><div><h2 className="font-display text-2xl font-bold">{user.name}</h2><p className="mt-1 text-sm text-muted">{user.email}</p><Badge className="mt-3" variant="success">Verified student</Badge></div></CardContent></Card><Card><CardHeader><CardTitle>Academic details</CardTitle></CardHeader><CardContent className="grid gap-5 sm:grid-cols-2">{fields.map(([label, value]) => <div key={label}><p className="text-xs font-bold tracking-[0.12em] text-muted uppercase">{label}</p><p className="mt-1 text-sm font-bold">{value ?? "Not added yet"}</p></div>)}</CardContent></Card><Card><CardHeader><CardTitle>Edit profile</CardTitle></CardHeader><CardContent><ProfileForm initialValues={{ bio: profile?.bio ?? "", course: profile?.course ?? "", department: profile?.department ?? "", studentId: profile?.studentId ?? "", yearOfStudy: profile?.yearOfStudy ?? null }} /></CardContent></Card></div></DashboardShell>;
}
