// app/admin/users/page.tsx
import { prisma } from "@/lib/db";
import { requireUser } from "@/app/data/user/require-user";
import { UserRole } from "@/lib/generated/prisma";
import { UserRoleActions } from "./user-role-actions";
import { redirect } from "next/navigation";

export default async function AdminUsersPage() {
  const currentUser = await requireUser();

  if (currentUser.role !== UserRole.admin) {
    redirect("/not-admin");
  }

  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      role: true,
    },
    orderBy: { email: "asc" },
  });

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">User Management</h1>

      <div className="space-y-2">
        {users.map((user) => (
          <div
            key={user.id}
            className="flex items-center justify-between border p-3 rounded"
          >
            <div>
              <p className="font-medium">{user.email}</p>
              <p className="text-sm text-muted-foreground">{user.role}</p>
            </div>

            <UserRoleActions user={user} />
          </div>
        ))}
      </div>
    </div>
  );
}