"use server";

import { requireUser } from "@/app/data/user/require-user";
import { prisma } from "@/lib/db";
import { APIResponse } from "@/lib/types";
import { revalidatePath } from "next/dist/server/web/spec-extension/revalidate";

export async function MarkLessonCompletedAction(lessonId: string, slug: string): Promise<APIResponse<void>> {
    const session = await requireUser();

    try {
        await prisma.lessonProgress.upsert({
            where: {
                userId_lessonId: {
                    userId: session.id,
                    lessonId: lessonId,
                }
            },
            update: {
                completed: true
            },
            create: {
                userId: session.id,
                lessonId: lessonId,
                completed: true
            }
        });

        revalidatePath(`/customer/${slug}`);
        
        return {
            status: "success",
            message: "Lesson marked as completed."
        }
    } catch (error) {
        return {
            status: "error",
            message: "An error occurred while marking the lesson as completed."
        }
    }
}