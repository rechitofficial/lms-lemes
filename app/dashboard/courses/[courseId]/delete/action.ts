"use server";

import { requireAdmin } from "@/app/data/admin/require-admin";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function deleteCourse(courseId: string): Promise<APIResponse> {
    await requireAdmin();
    
    try {
        await prisma.course.delete({
            where: {
                id: courseId,
            },
        });

        revalidatePath("/dashboard/courses");

        return {
            status: "success",
            message: "Course deleted successfully.",
        };
    } catch (error) {
        console.error("DELETE COURSE ERROR:", error);
        return {
            status: "error",
            message: "An error occurred while deleting the course.",
        };
    }
}