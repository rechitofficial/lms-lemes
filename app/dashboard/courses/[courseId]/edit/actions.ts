"use server";

import { requireAdmin } from "@/app/data/admin/require-admin";
import { prisma } from "@/lib/db";
import { APIResponse } from "@/lib/types";
import { chapterSchema, ChapterSchemaType, courseSchema, CourseSchemaType, lessonSchema, LessonSchemaType } from "@/lib/zod-schema";
import { revalidatePath } from "next/cache";
import { title } from "process";

export async function editCourse(data: CourseSchemaType, courseId: string): Promise<APIResponse<void>> {
    const user = await requireAdmin();

    try {
        const result = courseSchema.safeParse(data);
        if (!result.success) {
            return {
                status: "error",
                message: "Invalid course data",
            };
        }

        await prisma.course.update({
            where: {
                id: courseId,
                userId: user.user.id,
            },
            data: {
                ...result.data,
            },
        });

        return {
            status: "success",
            message: "Course updated successfully",
        };
    } catch (error) {
        console.error("EDIT COURSE ERROR:", error);
        return {
            status: "error",
            message: "An error occurred while editing the course",
        };
    }

}

export async function reorderLessons(courseId: string, chapterId: string, lessons: { id: string; position: number }[]): Promise<APIResponse<void>> {
    await requireAdmin();
    try {
        if (!lessons || lessons.length === 0) {
            return {
                status: "error",
                message: "No lessons provided for reordering.",
            };
        }

        const updates = lessons.map((lesson) => prisma.lesson.update({
            where: {
                id: lesson.id,
                chapterId: chapterId,
            },
            data: {
                position: lesson.position,
            },
        }));

        await prisma.$transaction(updates);

        revalidatePath(`/dashboard/courses/${courseId}/edit`);

        return {
            status: "success",
            message: "Lessons reordered successfully.",
        };
    } catch (error) {
        return {
            status: "error",
            message: "Failed to reorder lessons.",
        };
    }
}

export async function reorderChapters(courseId: string, chapters: { id: string; position: number }[]): Promise<APIResponse<void>> {
    await requireAdmin();
    try {
        if (!chapters || chapters.length === 0) {
            return {
                status: "error",
                message: "No chapters provided for reordering.",
            };
        }

        const updates = chapters.map((chapter) => prisma.chapter.update({
            where: {
                id: chapter.id,
                courseId: courseId,
            },
            data: {
                position: chapter.position,
            },
        }));

        await prisma.$transaction(updates);

        revalidatePath(`/dashboard/courses/${courseId}/edit`);

        return {
            status: "success",
            message: "Chapters reordered successfully.",
        };
    } catch (error) {
        return {
            status: "error",
            message: "Failed to reorder chapters.",
        };
    }
}

export async function createChapter(data: ChapterSchemaType): Promise<APIResponse<void>> {
    await requireAdmin();
    try {
        const result = chapterSchema.safeParse(data);
        if (!result.success) {
            return {
                status: "error",
                message: "Invalid chapter data",
            };
        }

        await prisma.$transaction(async (prisma) => {
            const maxPosition = await prisma.chapter.findFirst({
                where: {
                    courseId: data.courseId,
                },
                select: {
                    position: true,
                },
                orderBy: {
                    position: "desc",
                },
            });

            await prisma.chapter.create({
                data: {
                    title: result.data.title,
                    courseId: result.data.courseId,
                    position: (maxPosition?.position ?? 0) + 1,
                }
            });
        });
        revalidatePath(`/dashboard/courses/${data.courseId}/edit`);

        return {
            status: "success",
            message: "Chapter created successfully.",
        };
    } catch (error) {
        console.error("CREATE CHAPTER ERROR:", error);
        return {
            status: "error",
            message: "An error occurred while creating the chapter.",
        };
    }
}

export async function createLesson(data: LessonSchemaType): Promise<APIResponse<void>> {
    await requireAdmin();
    try {
        const result = lessonSchema.safeParse(data);
        if (!result.success) {
            return {
                status: "error",
                message: "Invalid lesson data",
            };
        }

        await prisma.$transaction(async (prisma) => {
            const maxPosition = await prisma.lesson.findFirst({
                where: {
                    chapterId: data.chapterId,
                },
                select: {
                    position: true,
                },
                orderBy: {
                    position: "desc",
                },
            });

            await prisma.lesson.create({
                data: {
                    title: result.data.title,
                    description: result.data.description,
                    videoKey: result.data.videoKey,
                    thumbnailKey: result.data.thumbnailKey,
                    content: result.data.content,
                    chapterId: result.data.chapterId,
                    position: (maxPosition?.position ?? 0) + 1,
                }
            });
        });
        revalidatePath(`/dashboard/courses/${data.courseId}/edit`);

        return {
            status: "success",
            message: "Lesson created successfully.",
        };
    } catch (error) {
        console.error("CREATE LESSON ERROR:", error);
        return {
            status: "error",
            message: "An error occurred while creating the lesson.",
        };
    }
}

export async function deleteLesson(chapterId: string, courseId: string, lessonId: string): Promise<APIResponse<void>> {
    await requireAdmin();
    try {
        // get all the lessons in the chapter to find the position of the lesson to be deleted
        const chapterWithLessons = await prisma.chapter.findUnique({
            where: {
                id: chapterId,
                courseId: courseId,
            },
            select: {
                lesson: {
                    orderBy: {
                        position: "asc",
                    },
                    select: {
                        id: true,
                        position: true,
                    },
                },
            },
        });

        if (!chapterWithLessons) {
            return {
                status: "error",
                message: "Chapter not found.",
            };
        }

        const lessons = chapterWithLessons.lesson;
        const lessonToDelete = lessons.find((lesson) => lesson.id === lessonId);

        if (!lessonToDelete) {
            return {
                status: "error",
                message: "Lesson not found.",
            };
        }

        const remainingLessons = lessons.filter((lesson) => lesson.id !== lessonId);

        // const updates = remainingLessons.map((lesson) => {
        //     if (lesson.position > lessonToDelete.position) {
        //         return prisma.lesson.update({
        //             where: {
        //                 id: lesson.id,
        //             },
        //             data: {
        //                 position: lesson.position - 1,
        //             },
        //         });
        //     }
        //     return null;
        // }).filter(Boolean);

        const updates = remainingLessons.map((lesson, index) => {
            return prisma.lesson.update({
                where: {
                    id: lesson.id,
                },
                data: {
                    position: index + 1,
                },
            });
        });

        await prisma.$transaction([
            ...updates,
            prisma.lesson.delete({
                where: {
                    id: lessonId,
                    chapterId: chapterId,
                },
            }),
        ]);

        revalidatePath(`/dashboard/courses/${courseId}/edit`);

        return {
            status: "success",
            message: "Lesson deleted successfully.",
        };  
    } catch (error) {
        console.error("DELETE LESSON ERROR:", error);
        return {
            status: "error",
            message: "An error occurred while deleting the lesson.",
        };
    }
}

export async function deleteChapter(chapterId: string, courseId: string): Promise<APIResponse<void>> {
    await requireAdmin();
    try {
        // get all the chapters in the course to find the position of the chapter to be deleted
        const courseWithChapters = await prisma.course.findUnique({
            where: {
                id: courseId,
            },
            select: {
                chapter: {
                    orderBy: {
                        position: "asc",
                    },
                    select: {
                        id: true,
                        position: true,
                    },
                },
            },
        });

        if (!courseWithChapters || courseWithChapters.chapter.length === 0) {
            return {
                status: "error",
                message: "Course not found.",
            };
        }

        const chapters = courseWithChapters.chapter;

        const chapterToDelete = chapters.find((chapter) => chapter.id === chapterId);

        if (!chapterToDelete) {
            return {
                status: "error",
                message: "Chapter not found.",
            };
        }

        const remainingChapters = chapters.filter((chapter) => chapter.id !== chapterId);

        // const updates = remainingLessons.map((lesson) => {
        //     if (lesson.position > lessonToDelete.position) {
        //         return prisma.lesson.update({
        //             where: {
        //                 id: lesson.id,
        //             },
        //             data: {
        //                 position: lesson.position - 1,
        //             },
        //         });
        //     }
        //     return null;
        // }).filter(Boolean);

        const updates = remainingChapters.map((chapter, index) => {
            return prisma.chapter.update({
                where: {
                    id: chapter.id,
                },
                data: {
                    position: index + 1,
                },
            });
        });

        await prisma.$transaction([
            ...updates,
            prisma.chapter.delete({
                where: {
                    id: chapterId,
                },
            }),
        ]);

        revalidatePath(`/dashboard/courses/${courseId}/edit`);

        return {
            status: "success",
            message: "Chapter deleted successfully.",
        };  
    } catch (error) {
        console.error("DELETE CHAPTER ERROR:", error);
        return {
            status: "error",
            message: "An error occurred while deleting the chapter.",
        };
    }
}