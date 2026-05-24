"use server";

import { requireAdmin } from "@/app/data/admin/require-admin";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { APIResponse } from "@/lib/types";
import { courseSchema, CourseSchemaType } from "@/lib/zod-schema";
import { headers } from "next/headers";

function getErrorMessage(error: unknown) {
    // console.log("availablenya:", Object.keys(PrismaAll));
    // console.error(" masuk getErrorMessage:", error, "valuenya:", error instanceof Prisma.PrismaClientKnownRequestError), "end";
    if (
        typeof error === "object" &&
        error !== null &&
        "code" in error
    ) {
        const code = (error as { code: string }).code;

        if (code === "P2002") {
            const meta = (error as any).meta;
            // your prisma version stores it here
            const fields = meta?.driverAdapterError?.cause?.constraint?.fields;
            const field = Array.isArray(fields) ? fields[0] : "Field";
            return `${field} already exists`;
        }

        if (code === "P2003") return "Invalid relation data";
        if (code === "P2025") return "Record not found";
    }

    return "An error occurred while creating the course";
}

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

        const errorMessage = getErrorMessage(error);

        return {
            status: "error",
            message: errorMessage,
        };
    }
}