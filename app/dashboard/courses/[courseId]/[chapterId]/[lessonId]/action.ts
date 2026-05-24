"use server";

import { requireAdmin } from "@/app/data/admin/require-admin";
import { prisma } from "@/lib/db";
import { APIResponse } from "@/lib/types";
import { lessonSchema, LessonSchemaType } from "@/lib/zod-schema";

export async function UpdateLesson(values: LessonSchemaType, lessonId: string): Promise<APIResponse<void>> {
    await requireAdmin();

    try {
        const result = lessonSchema.safeParse(values);

        if (!result.success) {
            console.error("VALIDATION ERROR:", result.error);
            return {
                status: "error",
                message: "Invalid input data.",
            };
        }

        const data = result.data;

        await prisma.lesson.update({
            where: { id: lessonId },
            data: {
                title: data.title,
                description: data.description,
                videoKey: data.videoKey,
                thumbnailKey: data.thumbnailKey,
            },
        });
        return {
            status: "success",
            message: "Lesson updated successfully.",
        };
    } catch (error) {
        console.error("UPDATE LESSON ERROR:", error);
        return {
            status: "error",
            message: "An error occurred while updating the lesson.",
        };
    }
}