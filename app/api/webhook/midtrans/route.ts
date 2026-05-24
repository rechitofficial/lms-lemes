import crypto from "crypto";
import { prisma } from "@/lib/db";
import { EnrollmentStatus } from "@/lib/generated/prisma";

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // Verify signature
        const signature = crypto
            .createHash("sha512")
            .update(
                body.order_id +
                body.status_code +
                body.gross_amount +
                process.env.MIDTRANS_SECRET_KEY!
            )
            .digest("hex");

        if (signature !== body.signature_key) {
            return Response.json(
                { message: "Invalid signature" },
                { status: 403 }
            );
        }

        const orderId = body.order_id;
        const transactionStatus = body.transaction_status;

        // Find checkout session
        const checkoutSession =
            await prisma.checkoutSession.findUnique({
                where: {
                    orderId,
                },
                include: {
                    enrollment: true,
                },
            });

        if (!checkoutSession) {
            return Response.json(
                { message: "Checkout session not found" },
                { status: 404 }
            );
        }

        // Store Midtrans transaction ID if available
        if (body.transaction_id) {
            await prisma.checkoutSession.update({
                where: {
                    id: checkoutSession.id,
                },
                data: {
                    midtransTransactionId: body.transaction_id,
                },
            });
        }

        switch (transactionStatus) {
            case "settlement":
            case "capture":
                await prisma.enrollment.update({
                    where: {
                        id: checkoutSession.enrollmentId,
                    },
                    data: {
                        status: EnrollmentStatus.COMPLETED,
                    },
                });
                break;

            case "pending":
                await prisma.enrollment.update({
                    where: {
                        id: checkoutSession.enrollmentId,
                    },
                    data: {
                        status: EnrollmentStatus.PENDING,
                    },
                });
                break;

            case "expire":
            case "cancel":
            case "deny":
                await prisma.enrollment.update({
                    where: {
                        id: checkoutSession.enrollmentId,
                    },
                    data: {
                        status: EnrollmentStatus.CANCELLED,
                    },
                });
                break;
        }

        return Response.json({
            success: true,
        });
    } catch (error) {
        console.error(error);

        return Response.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}