import { prisma } from "@/lib/db";
import { requireAdmin } from "./require-admin";

export async function adminGetRecentCourses() {
    await requireAdmin()

    const data = await prisma.course.findMany({
        orderBy: {
            createdAt: "desc",
        },
        take: 5,
        select: {
            id: true,
            title: true,
            smallDescription: true,
            createdAt: true,
            duration: true,
            level: true,
            status: true,
            price: true,
            fileKey: true,
            slug: true,
        }
    });

    return data;
}