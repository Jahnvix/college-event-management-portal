"use client";

import { UserRole, UserStatus } from "@prisma/client";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type UserItem = {
  createdAt: string;
  email: string;
  id: string;
  lastLoginAt: string | null;
  name: string;
  profile: {
    course: string | null;
    department: string | null;
    studentId: string | null;
    yearOfStudy: number | null;
  } | null;
  role: UserRole;
  status: UserStatus;
};

type UserResponse = { data: UserItem[] };

const selectClassName =
  "h-10 rounded-xl border border-border bg-background-elevated px-3 text-sm outline-none transition focus-visible:ring-4 focus-visible:ring-ring";

export function UserManager() {
  const [items, setItems] = useState<UserItem[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [pendingId, setPendingId] = useState<string | null>(null);

  async function refreshUsers(nextSearch = search) {
    setLoading(true);

    try {
      const query = nextSearch.trim() ? `?search=${encodeURIComponent(nextSearch.trim())}` : "";
      const response = await fetch(`/api/admin/users${query}`);

      if (!response.ok) {
        throw new Error("Unable to load users.");
      }

      const payload = (await response.json()) as UserResponse;
      setItems(payload.data);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to load users.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void refreshUsers();
  }, []);

  async function updateUser(userId: string, data: Partial<Pick<UserItem, "role" | "status">>) {
    setPendingId(userId);

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
        method: "PATCH",
      });

      if (!response.ok) {
        throw new Error("Unable to update the user.");
      }

      await refreshUsers();
      toast.success("User updated.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to update the user.");
    } finally {
      setPendingId(null);
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <CardTitle>User management</CardTitle>
          <p className="mt-1 text-sm text-muted">Search students, adjust access, and handle account status changes.</p>
        </div>
        <div className="flex w-full max-w-md gap-2">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" />
            <Input
              className="pl-9"
              placeholder="Search by name, email, or student ID"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
          <Button size="sm" variant="outline" onClick={() => void refreshUsers()}>
            Search
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {items.length ? (
          items.map((user) => (
            <article className="rounded-3xl border border-border p-4" key={user.id}>
              <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-bold">{user.name}</p>
                    <Badge variant={user.role === UserRole.ADMIN ? "warning" : "secondary"}>
                      {user.role.toLowerCase()}
                    </Badge>
                    <Badge variant={user.status === UserStatus.ACTIVE ? "success" : "outline"}>
                      {user.status.toLowerCase().replaceAll("_", " ")}
                    </Badge>
                  </div>
                  <p className="mt-1 text-sm text-muted">{user.email}</p>
                  <div className="mt-3 flex flex-wrap gap-4 text-xs font-bold text-muted">
                    <span>{user.profile?.studentId ?? "No student ID"}</span>
                    <span>{user.profile?.department ?? "No department"}</span>
                    <span>{user.profile?.yearOfStudy ? `Year ${user.profile.yearOfStudy}` : "Year not set"}</span>
                  </div>
                </div>
                <div className="grid gap-2 sm:grid-cols-2">
                  <select
                    aria-label={`Role for ${user.name}`}
                    className={selectClassName}
                    disabled={pendingId === user.id}
                    value={user.role}
                    onChange={(event) =>
                      void updateUser(user.id, {
                        role: event.target.value as UserRole,
                      })
                    }
                  >
                    {Object.values(UserRole).map((role) => (
                      <option key={role} value={role}>
                        {role.toLowerCase()}
                      </option>
                    ))}
                  </select>
                  <select
                    aria-label={`Status for ${user.name}`}
                    className={selectClassName}
                    disabled={pendingId === user.id}
                    value={user.status}
                    onChange={(event) =>
                      void updateUser(user.id, {
                        status: event.target.value as UserStatus,
                      })
                    }
                  >
                    {Object.values(UserStatus).map((status) => (
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
            {loading ? "Loading users..." : "No users matched the current filters."}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
