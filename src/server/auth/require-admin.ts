import { UserRole } from "@prisma/client";
import { getCurrentUser } from "@/server/auth";

export async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user?.id || user.role !== UserRole.ADMIN) return null;
  return user;
}
