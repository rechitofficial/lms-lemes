"use server";

import { requireUser } from "@/app/data/user/require-user";
import { prisma } from "@/lib/db";
import { APIResponse } from "@/lib/types";
import { stat } from "fs";

export async function enrollInCourse(courseId: string): Promise<APIResponse> {
    const user =await requireUser();
    try {
        const course = await prisma.course.findUnique({
            where: { id: courseId },
            select: { title: true, price: true, slug: true, id: true }
        });

        if (!course) {
            return {
                status: "error",
                message: "Course not found."
            };
        }
        let paymentCustomerId = null;
        const userWithPaymentCustomerId = await prisma.user.findUnique({
            where: { id: user.id },
            select: { paymentCustomerId: true }
        });

        // if (userWithPaymentCustomerId?.paymentCustomerId){
        //     paymentCustomerId = userWithPaymentCustomerId.paymentCustomerId;
        // } else {

        // }
        
    } catch (error) {
        return (
            status: "error",
            message: "Failed to enroll in course. Please try again later."
        )
       
    }
}