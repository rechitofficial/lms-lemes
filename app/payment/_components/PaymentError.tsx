import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { XCircleIcon } from "lucide-react";
import Link from "next/link";

export function PaymentError({ message }: { message?: string }) {
    return (
        <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4">
            <Card className="w-full max-w-md border-destructive/20 shadow-xl">
                <CardContent className="flex flex-col items-center gap-6 p-8 text-center">
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10">
                        <XCircleIcon className="h-10 w-10 text-destructive" />
                    </div>

                    <div className="space-y-2">
                        <h1 className="text-2xl font-bold tracking-tight">
                            Payment Issue
                        </h1>

                        <p className="text-sm leading-relaxed text-muted-foreground">
                            {message ??
                                "There was an issue processing your payment."}
                        </p>
                    </div>

                    <div className="flex w-full flex-col gap-3">
                        <Link
                            href="/"
                            className={buttonVariants({
                                className: "w-full",
                            })}
                        >
                            Back to Homepage
                        </Link>

                        <Link
                            href="/courses"
                            className={buttonVariants({
                                variant: "outline",
                                className: "w-full",
                            })}
                        >
                            Browse Courses
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}