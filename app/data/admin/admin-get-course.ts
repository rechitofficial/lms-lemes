import 'server-only';

import { requireAdmin } from './require-admin';
import { prisma } from '@/lib/db';
import { notFound } from 'next/navigation';

export async function adminGetCourse(courseId: string) {
    await requireAdmin();
    const data = await prisma.course.findUnique({
        where: {
            id: courseId,
        },
        select: {
            id: true,
            title: true,
            smallDescription: true,
            description: true,
            category: true,
            createdAt: true,
            duration: true,
            level: true,
            status: true,
            price: true,
            fileKey: true,
            slug: true,
            chapter: {
                select: {
                    id: true,
                    title: true,
                    position: true,
                    createdAt: true,
                    updatedAt: true,
                    lesson: {
                        select: {
                            id: true,
                            title: true,
                            thumbnailKey: true,
                            videoKey: true,
                            position: true,
                            createdAt: true,
                            updatedAt: true,
                        }
                    }
                }
            }
        }
    });

    if (!data) {
        return notFound();
    }

    return data;
}

export type AdminCourseSingularType = Awaited<ReturnType<typeof adminGetCourse>>;