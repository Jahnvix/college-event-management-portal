"use client";

import { useEffect, useState } from "react";
import { BarChart3, TrendingUp } from "lucide-react";
import { toast } from "sonner";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type AnalyticsResponse = {
  data: {
    distributions: {
      eventsByCategory: Record<string, number>;
      eventsByStatus: Record<string, number>;
      registrationsByStatus: Record<string, number>;
      usersByStatus: Record<string, number>;
    };
    topEvents: Array<{
      approvedRegistrationsCount: number;
      bookmarkCount: number;
      id: string;
      title: string;
      waitlistCount: number;
    }>;
    totals: {
      activeStudents: number;
      approvalRate: number;
      publishedAnnouncements: number;
      publishedEvents: number;
      registrations: number;
      upcomingEvents: number;
      users: number;
    };
  };
};

function DistributionList({
  icon: Icon,
  items,
  title,
}: Readonly<{
  icon: typeof BarChart3;
  items: Record<string, number>;
  title: string;
}>) {
  const entries = Object.entries(items).sort((left, right) => right[1] - left[1]);
  const maxValue = Math.max(...entries.map(([, value]) => value), 1);

  return (
    <div className="rounded-3xl border border-border p-4">
      <div className="flex items-center gap-2">
        <Icon className="size-4 text-primary" />
        <p className="font-bold">{title}</p>
      </div>
      <div className="mt-4 space-y-3">
        {entries.map(([label, value]) => (
          <div key={label}>
            <div className="mb-1 flex items-center justify-between gap-4 text-xs font-bold uppercase tracking-[0.08em] text-muted">
              <span>{label.replaceAll("_", " ")}</span>
              <span>{value}</span>
            </div>
            <div className="h-2 rounded-full bg-secondary">
              <div
                className="h-full rounded-full bg-primary"
                style={{ width: `${Math.max(12, (value / maxValue) * 100)}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function AnalyticsDashboard() {
  const [analytics, setAnalytics] = useState<AnalyticsResponse["data"] | null>(null);

  useEffect(() => {
    void fetch("/api/admin/analytics")
      .then(async (response) => {
        if (!response.ok) {
          throw new Error("Unable to load analytics.");
        }

        return response.json() as Promise<AnalyticsResponse>;
      })
      .then((payload) => setAnalytics(payload.data))
      .catch((error) => {
        toast.error(error instanceof Error ? error.message : "Unable to load analytics.");
      });
  }, []);

  if (!analytics) {
    return (
      <Card>
        <CardContent className="p-10 text-center text-sm text-muted">Loading analytics...</CardContent>
      </Card>
    );
  }

  const statCards = [
    { label: "Active students", value: analytics.totals.activeStudents },
    { label: "Upcoming events", value: analytics.totals.upcomingEvents },
    { label: "Approval rate", value: `${analytics.totals.approvalRate}%` },
    { label: "Published announcements", value: analytics.totals.publishedAnnouncements },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Analytics dashboard</CardTitle>
        <p className="text-sm text-muted">Operational snapshots across growth, demand, and event throughput.</p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {statCards.map((stat) => (
            <div className="rounded-3xl border border-border p-4" key={stat.label}>
              <p className="text-xs font-bold tracking-[0.12em] text-muted uppercase">{stat.label}</p>
              <p className="mt-2 font-display text-3xl font-bold">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="grid gap-4 xl:grid-cols-2">
          <DistributionList icon={BarChart3} items={analytics.distributions.usersByStatus} title="Users by status" />
          <DistributionList
            icon={BarChart3}
            items={analytics.distributions.registrationsByStatus}
            title="Registrations by status"
          />
          <DistributionList icon={BarChart3} items={analytics.distributions.eventsByStatus} title="Events by status" />
          <DistributionList
            icon={BarChart3}
            items={analytics.distributions.eventsByCategory}
            title="Events by category"
          />
        </div>

        <div className="rounded-3xl border border-border p-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="size-4 text-primary" />
            <p className="font-bold">Top-performing events</p>
          </div>
          <div className="mt-4 space-y-3">
            {analytics.topEvents.map((event) => (
              <div className="rounded-2xl border border-border px-4 py-3" key={event.id}>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <p className="font-bold">{event.title}</p>
                  <div className="flex flex-wrap gap-3 text-xs font-bold text-muted">
                    <span>{event.approvedRegistrationsCount} approved</span>
                    <span>{event.waitlistCount} waitlisted</span>
                    <span>{event.bookmarkCount} saved</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
