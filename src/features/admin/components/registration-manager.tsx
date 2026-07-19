"use client";

import { RegistrationStatus } from "@prisma/client";
import { Search, TicketCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type RegistrationItem = {
  createdAt: string;
  event: {
    id: string;
    startAt: string;
    title: string;
  };
  id: string;
  notes: string | null;
  status: RegistrationStatus;
  user: {
    email: string;
    id: string;
    name: string;
  };
};

type RegistrationResponse = { data: RegistrationItem[] };

const selectClassName =
  "h-10 rounded-xl border border-border bg-background-elevated px-3 text-sm outline-none transition focus-visible:ring-4 focus-visible:ring-ring";

function getBadgeVariant(status: RegistrationStatus) {
  switch (status) {
    case RegistrationStatus.APPROVED:
    case RegistrationStatus.CHECKED_IN:
      return "success";
    case RegistrationStatus.WAITLISTED:
    case RegistrationStatus.PENDING:
      return "warning";
    default:
      return "outline";
  }
}

export function RegistrationManager() {
  const [items, setItems] = useState<RegistrationItem[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [pendingId, setPendingId] = useState<string | null>(null);

  async function refreshRegistrations(nextSearch = search) {
    setLoading(true);

    try {
      const query = nextSearch.trim() ? `?search=${encodeURIComponent(nextSearch.trim())}` : "";
      const response = await fetch(`/api/admin/registrations${query}`);

      if (!response.ok) {
        throw new Error("Unable to load registrations.");
      }

      const payload = (await response.json()) as RegistrationResponse;
      setItems(payload.data);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to load registrations.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void refreshRegistrations();
  }, []);

  async function updateRegistration(registrationId: string, status: RegistrationStatus) {
    setPendingId(registrationId);

    try {
      const response = await fetch(`/api/admin/registrations/${registrationId}`, {
        body: JSON.stringify({ status }),
        headers: { "Content-Type": "application/json" },
        method: "PATCH",
      });

      if (!response.ok) {
        throw new Error("Unable to update the registration.");
      }

      await refreshRegistrations();
      toast.success("Registration updated.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to update the registration.");
    } finally {
      setPendingId(null);
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <CardTitle>Registration management</CardTitle>
          <p className="mt-1 text-sm text-muted">Approve, waitlist, reject, and check in attendees quickly.</p>
        </div>
        <div className="relative w-full max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" />
          <Input
            className="pl-9"
            placeholder="Search by student or event"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                void refreshRegistrations(event.currentTarget.value);
              }
            }}
          />
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {items.length ? (
          items.map((registration) => (
            <article className="rounded-3xl border border-border p-4" key={registration.id}>
              <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-bold">{registration.user.name}</p>
                    <Badge variant={getBadgeVariant(registration.status)}>
                      {registration.status.toLowerCase().replaceAll("_", " ")}
                    </Badge>
                  </div>
                  <p className="mt-1 text-sm text-muted">{registration.user.email}</p>
                  <div className="mt-3 flex flex-wrap items-center gap-4 text-xs font-bold text-muted">
                    <span className="inline-flex items-center gap-1.5">
                      <TicketCheck className="size-4 text-primary" />
                      {registration.event.title}
                    </span>
                    <span>
                      {new Date(registration.event.startAt).toLocaleString("en-IN", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </span>
                  </div>
                </div>
                <div className="grid gap-2 sm:grid-cols-2">
                  <select
                    aria-label={`Registration status for ${registration.user.name}`}
                    className={selectClassName}
                    disabled={pendingId === registration.id}
                    value={registration.status}
                    onChange={(event) =>
                      void updateRegistration(registration.id, event.target.value as RegistrationStatus)
                    }
                  >
                    {Object.values(RegistrationStatus).map((status) => (
                      <option key={status} value={status}>
                        {status.toLowerCase().replaceAll("_", " ")}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </article>
          ))
        ) : (
          <div className="rounded-3xl border border-dashed border-border px-6 py-10 text-center text-sm text-muted">
            {loading ? "Loading registrations..." : "No registrations matched the current filters."}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
