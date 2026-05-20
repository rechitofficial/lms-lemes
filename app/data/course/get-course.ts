import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";

export async function getIndividualCourse(slug: string) {
    const course = await prisma.course.findUnique({
        where: {
            slug: slug,
        },
        select: {
            price: true,
            title: true,
            smallDescription: true,
            description: true,
            duration: true,
            level: true,
            id: true,
            fileKey: true,
            category: true,
            chapter: {
                select: {
                    title: true,
                    id: true,
                    lesson: {
                        select: {
                            id: true,
                            title: true,
                        },
                        orderBy: {
                            position: "asc",
                        },
                    },
                },
                orderBy: {
                    position: "asc",
                },
            }
        },
    });

    if (!course) {
        return notFound();
    }

    return course;
}