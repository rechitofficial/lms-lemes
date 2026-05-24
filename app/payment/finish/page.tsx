import { prisma } from "@/lib/db";
import { Card, CardContent } from "@/components/ui/card";
import {
    CheckCircleIcon,
    XCircleIcon,
    ClockIcon,
} from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { PaymentError } from "../_components/PaymentError";

export default async function PaymentFinishPage({
    searchParams,
}: {
    searchParams: {
        enrollmentId?: string;
        transaction_status?: string;
        action?: string;
    };
}) {
    const params = await searchParams;

    const enrollmentId = params.enrollmentId;
    const transactionStatus = params.transaction_status;
    const action = params.action;

    if (!enrollmentId) {
        return <PaymentError message="Invalid payment link." />;
    }

    const enrollment = await prisma.enrollment.findUnique({
        where: { id: enrollmentId },
    });

    if (!enrollment) {
        return <PaymentError message="Enrollment not found." />;
    }

    // ✅ FIXED: get latest checkout session
    const checkoutSession = await prisma.checkoutSession.findFirst({
        where: {
            enrollmentId: enrollment.id,
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    const status = enrollment.status;

    const isSuccess = status === "COMPLETED";
    const isPending = status === "PENDING";

    const isUserReturn =
        transactionStatus === "pending" || action === "back";

    const showPending = isPending || isUserReturn;

    const checkoutUrl = checkoutSession?.redirectUrl;

    return (
        <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4">
            <Card className="w-full max-w-md border shadow-xl">
                <CardContent className="flex flex-col items-center gap-6 p-8 text-center">

                    {/* ICON */}
                    {isSuccess ? (
                        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
                            <CheckCircleIcon className="h-10 w-10 text-green-600" />
                        </div>
                    ) : showPending ? (
                        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-yellow-100">
                            <ClockIcon className="h-10 w-10 text-yellow-600" />
                        </div>
                    ) : (
                        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
                            <XCircleIcon className="h-10 w-10 text-red-600" />
                        </div>
                    )}

                    {/* TEXT */}
                    <div className="space-y-2">
                        <h1 className="text-2xl font-bold tracking-tight">
                            {isSuccess
                                ? "Payment Successful"
                                : showPending
                                    ? "Payment Pending"
                                    : "Payment Failed"}
                        </h1>

                        <p className="text-sm text-muted-foreground">
                            {isSuccess
                                ? "Your payment has been completed successfully."
                                : showPending
                                    ? "Your payment is still pending. You can continue payment below."
                                    : "Your payment was not successful."}
                        </p>
                    </div>

                    {/* ACTION BUTTONS */}
                    <div className="grid w-full gap-3">

                        <Link
                            href="/"
                            className={buttonVariants({
                                variant: "outline",
                                className: "w-full",
                            })}
                        >
                            Back to Home
                        </Link>

                        <Link
                            href="/customer"
                            className={buttonVariants({
                                className: "w-full",
                            })}
                        >
                            Continue Learning
                        </Link>

                        {/* 👇 ONLY SHOW WHEN PENDING */}
                        {showPending && checkoutUrl && (
                            <Link
                                href={checkoutUrl}
                                target="_blank"
                                className={buttonVariants({
                                    className:
                                        "w-full bg-yellow-500 hover:bg-yellow-600",
                                })}
                            >
                                Continue Payment
                            </Link>
                        )}
                    </div>

                </CardContent>
            </Card>
        </div>
    );
}