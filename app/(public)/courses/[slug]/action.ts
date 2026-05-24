"use server";

import { requireUser } from "@/app/data/user/require-user";
import { prisma } from "@/lib/db";
// import { stripe } from "@/lib/stripe";
import midtransClient from "midtrans-client";
import { APIResponse } from "@/lib/types";
import { EnrollmentStatus } from "@/lib/generated/prisma";
import { redirect } from "next/navigation";

// type CreatePaymentData = {
//     token: string;
//     redirectUrl: string;
//     orderId: string;
// };

export async function enrollInCourse(courseId: string): Promise<APIResponse<void>> {
    const user = await requireUser();
    let checkoutUrl: string;
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

        // Midtrans Snap instance
        const snap = new midtransClient.Snap({
            isProduction: false,
            serverKey: process.env.MIDTRANS_SECRET_KEY!,
            clientKey: process.env.MIDTRANS_CLIENT_KEY!,
        });

        // const orderId = `course-${course.id}-${Date.now()}`;

        // (testing code)
        // const parameter = {
        //     "transaction_details": {
        //         "order_id": "test-transaction-678",
        //         "gross_amount": 200
        //     }, "credit_card": {
        //         "secure": true
        //     }
        // }
        // const transaction = await snap.createTransaction(parameter);
        // console.log("MIDTRANS RESPONSE:", transaction);

        // maybe for stripe in the future
        // let paymentCustomerId = null;
        // const userWithPaymentCustomerId = await prisma.user.findUnique({
        //     where: { id: user.id },
        //     select: { paymentCustomerId: true }
        // });

        // if (userWithPaymentCustomerId?.paymentCustomerId){
        //     paymentCustomerId = userWithPaymentCustomerId.paymentCustomerId;
        // } else {
        //     const customer = await stripe.customers.create({
        //         email: user.email,
        //         name: user.name,
        //         metadata: {
        //             userId: user.id,
        //         },
        //     });

        //     paymentCustomerId = customer.id;
        //     await prisma.user.update({
        //         where: { id: user.id },
        //         data: { paymentCustomerId },
        //     })
        // }
        const result = await prisma.$transaction(async (tx) => {
            const orderId = `crs-${course.id.slice(0, 8)}-${Date.now()}`;
            const existingEnrollment = await tx.enrollment.findUnique({
                where: {
                    courseId_userId: {
                        courseId: course.id,
                        userId: user.id,
                    },
                },
            });

            // Already paid
            if (existingEnrollment?.status === EnrollmentStatus.COMPLETED) {
                return {
                    status: "error",
                    message: "You are already enrolled in this course.",
                };
            }

            let enrollment;

            // Existing pending enrollment
            if (existingEnrollment) {
                enrollment = await tx.enrollment.update({
                    where: {
                        id: existingEnrollment.id,
                    },
                    data: {
                        status: EnrollmentStatus.PENDING,
                        amount: course.price,
                    },
                });
            } else {
                // New enrollment
                enrollment = await tx.enrollment.create({
                    data: {
                        userId: user.id,
                        courseId: course.id,
                        amount: course.price,
                        status: EnrollmentStatus.PENDING,
                    },
                });
            }

            // Create Midtrans transaction
            const transaction = await snap.createTransaction({
                transaction_details: {
                    order_id: orderId,
                    gross_amount: course.price,
                },
                customer_details: {
                    first_name: user.name,
                    email: user.email,
                },
                item_details: [
                    {
                        id: course.id,
                        name: course.title,
                        price: course.price,
                        quantity: 1,
                    },
                ],
                callbacks: {
                    finish: `${process.env.BETTER_AUTH_URL}/payment/finish?enrollmentId=${enrollment.id}`,
                    pending: `${process.env.BETTER_AUTH_URL}/payment/pending?enrollmentId=${enrollment.id}`,
                    error: `${process.env.BETTER_AUTH_URL}/payment/error?enrollmentId=${enrollment.id}`,
                }
            });


            // Save checkout session
            await tx.checkoutSession.create({
                data: {
                    enrollmentId: enrollment.id,
                    orderId,
                    midtransTransactionId: transaction.transaction_id,

                    token: transaction.token,
                    redirectUrl: transaction.redirect_url,
                },
            });

            // use for testing
            // return {
            //     status: "success",
            //     message: "Checkout session created successfully.",
            //     data: {
            //         token: transaction.token,
            //         redirectUrl: transaction.redirect_url,
            //         orderId,
            //     },
            // };

            return {
                enrollment: enrollment,
                checkoutUrl: transaction.redirect_url,
            };
        });
        checkoutUrl = result.checkoutUrl as string;
    } catch (error) {
        console.error("Enrollment error:", error);
        return {
            status: "error",
            message: "Failed to enroll in course. Please try again later."
        };
    }

    redirect(checkoutUrl);
}