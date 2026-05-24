import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { EnrollmentStatus } from "@/lib/generated/prisma";
import { headers } from "next/headers";

export async function checkIfCourseEnrolled(courseId: string): Promise<boolean> {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session || !session.user) {
        return false
    }

    const enrollment = await prisma.enrollment.findUnique({
        where: {
            courseId_userId: {
                courseId,
                userId: session.user.id,
            },
        },
        select: {
            status: true,
        },
    });
    
    return enrollment?.status === EnrollmentStatus.COMPLETED ? true : false;
}