import { prisma } from "@/lib/db";

export async function getAllCourses() {
    await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate network delay
    const data = await prisma.course.findMany({
        where: {
            status: "PUBLISHED",
        },
        orderBy: {
            createdAt: "desc",
        },
        select: {
            price: true,
            title: true,
            smallDescription: true,
            duration: true,
            level: true,
            id: true,
            category: true,
            fileKey: true,
            slug: true,

        },

    });
    return data;
}

export type PublicCourseType = Awaited<ReturnType<typeof getAllCourses>>[0];