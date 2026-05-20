"use server";

import { requireAdmin } from "@/app/data/admin/require-admin";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { APIResponse } from "@/lib/types";
import { courseSchema, CourseSchemaType } from "@/lib/zod-schema";
import { headers } from "next/headers";

export async function CreateCourse(input: CourseSchemaType): Promise<APIResponse<null>> {
    await requireAdmin();
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session?.user?.id) {
            return {
                status: "error",
                message: "Unauthorized",
            };
        }

        const validation = courseSchema.safeParse(input);

        if (!validation.success) {
            return {
                status: "error",
                message: "Invalid course data",
            };
        }

        await prisma.course.create({
            data: {
                ...validation.data,
                userId: session?.user.id as string,
            },
        })

        return {
            status: "success",
            message: "Course created successfully",
        };
    } catch (error) {
        console.error("CREATE COURSE ERROR:", error);

        return {
            status: "error",
            message: "An error occurred while creating the course",
        };
    }
}