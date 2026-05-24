import "server-only";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
import { UserRole } from "@/lib/generated/prisma";

export const requireAdmin = cache(async () => {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        return redirect("/login");
    }

    if (session.user.role !== UserRole.admin) {
        return redirect("/not-admin");
    }

    return session;
});

// export async function requireAdmin() {
//     const session = await auth.api.getSession({
//         headers: await headers(),
//     });

//     if (!session) {
//         return redirect("/login");
//     }

//     if (session.user.role !== UserRole.admin) {
//         return redirect("/not-admin");
//     }

//     return session;
// }