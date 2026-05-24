// app/admin/users/user-role-actions.tsx
"use client";

import { UserRole } from "@/lib/generated/prisma";
import { useState, useTransition } from "react";
import { updateUserRole } from "./actions";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function UserRoleActions({ user }: any) {
  const [isPending, startTransition] = useTransition();
  const [role, setRole] = useState<UserRole>(user.role);

  function toggleRole() {
    startTransition(async () => {
      const newRole =
        user.role === UserRole.admin ? UserRole.user : UserRole.admin;

      const result = await updateUserRole(user.id, newRole);
      if (result?.status === "success") {
        setRole(newRole);
        toast.success(result.message);
      } else if (result?.status === "error") {
        toast.error(result.message);
      }
    });
  }

  return (
    <Button
      onClick={toggleRole}
      disabled={isPending}
      className="px-3 py-1 text-sm border rounded"
    >
      {isPending ? (
        <span>Updating...</span>
      ) : (
        <span>{role === UserRole.admin ? "Demote" : "Promote"}</span>
      )}
    </Button>
  );
}