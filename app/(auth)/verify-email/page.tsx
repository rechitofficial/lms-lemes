"use client";

import { Suspense, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp";

import { authClient } from "@/lib/auth-client";

function VerifyRequestContent() {
    const router = useRouter();
    const [otp, setOtp] = useState("");
    const [emailPending, startTransition] = useTransition();

    const param = useSearchParams();
    const email = param.get("email") || "";

    const isOtpComplete = otp.length === 6;

    function handleVerify() {
        startTransition(async () => {
            await authClient.signIn.emailOtp({
                email,
                otp,
                fetchOptions: {
                    onSuccess: () => {
                        toast.success("Email verified successfully!");
                        router.push("/");
                    },
                    onError: () => {
                        toast.error("Invalid OTP. Please try again.");
                    },
                },
            });
        });
    }

    return (
        <Card className="w-full mx-auto">
            <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold">
                    Check your email
                </CardTitle>

                <CardDescription className="text-muted-foreground">
                    A sign in link has been sent to your email address.
                </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
                <div className="flex flex-col items-center space-y-2">
                    <InputOTP
                        maxLength={6}
                        value={otp}
                        onChange={setOtp}
                        className="gap-2"
                    >
                        <InputOTPGroup>
                            <InputOTPSlot index={0} />
                            <InputOTPSlot index={1} />
                            <InputOTPSlot index={2} />
                        </InputOTPGroup>

                        <InputOTPGroup>
                            <InputOTPSlot index={3} />
                            <InputOTPSlot index={4} />
                            <InputOTPSlot index={5} />
                        </InputOTPGroup>
                    </InputOTP>

                    <p className="text-sm text-muted-foreground">
                        Please enter the 6-digit code from the email
                    </p>
                </div>

                <Button
                    onClick={handleVerify}
                    className="w-full"
                    disabled={emailPending || !isOtpComplete}
                >
                    {emailPending ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Verifying...
                        </>
                    ) : (
                        "Verify Account"
                    )}
                </Button>
            </CardContent>
        </Card>
    );
}

export default function VerifyRequestPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <VerifyRequestContent />
        </Suspense>
    );
}