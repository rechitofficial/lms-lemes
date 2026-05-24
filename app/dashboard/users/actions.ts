// app/admin/users/actions.ts
"use server";

import { requireUser } from "@/app/data/user/require-user";
import { prisma } from "@/lib/db";
import { UserRole } from "@/lib/generated/prisma";
import { APIResponse } from "@/lib/types";
import { revalidatePath } from "next/cache";

export async function updateUserRole(userId: string, role: UserRole): Promise<APIResponse<null>> {
  const currentUser = await requireUser();

  if (currentUser.role !== UserRole.admin) {
    throw new Error("Unauthorized");
  }

  await prisma.user.update({
    where: { id: userId },
    data: { role },
  });

  revalidatePath("/dashboard/users");

  return {
    status: "success",
    message: "User role updated successfully",
  };
}