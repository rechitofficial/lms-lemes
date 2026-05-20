import { prisma } from "@/lib/db";
import { requireAdmin } from "./require-admin";
import { notFound } from "next/navigation";

export async function adminGetLesson(lessonId: string) {
    await requireAdmin();
    const data = await prisma.lesson.findUnique({
        where: {
            id: lessonId,
        },
        select: {
            id: true,
            title: true,
            thumbnailKey: true,
            videoKey: true,
            position: true,
            description: true,
            // chapter: {
            //     select: {
            //         id: true,
            //         title: true,
            //         position: true,
            //         createdAt: true,
            //         updatedAt: true,
            //         course: {
            //             select: {
            //                 id: true,
            //                 title: true,
            //                 smallDescription: true,
            //                 description: true,
            //                 category: true,
            //                 createdAt: true,
            //                 duration: true,
            //                 level: true,
            //                 status: true,
            //                 price: true,
            //                 fileKey: true,
            //                 slug: true,
            //             }
            //         }
            //     }
            // }
        }
    });

    if (!data) {
        return notFound();
    }
    return data;
}

export type AdminLessonType = Awaited<ReturnType<typeof adminGetLesson>>;