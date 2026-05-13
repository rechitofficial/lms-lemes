"use client";

import { Card, CardDescription, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { authClient } from "@/lib/auth-client"
import { toast } from "sonner"
import { useState, useTransition } from "react"
import { Loader, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"

export function LoginForm() {
    const router = useRouter();
    const [githubPending, startGithubTransition] = useTransition()
    const [emailPending, startEmailTransition] = useTransition()
    const [email, setEmail] = useState("")
    async function handleGitHubSignIn() {
        startGithubTransition(async () => {
            await authClient.signIn.social(
                {
                    provider: "github", callbackURL: "/", fetchOptions: {
                        onSuccess: () => { toast.success("Signed in successfully!") },
                        onError: (error) => { toast.error(error.error.message) }
                    }
                }
            )
        })
    }
    function handleEmailSignIn() {
        startEmailTransition(async () => {
            await authClient.emailOtp.sendVerificationOtp({
                email: email,
                type: "sign-in",
                fetchOptions: {
                    onSuccess: () => {
                        toast.success("OTP sent to your email!");
                        router.push("/verify-email?email=" + email);
                    },
                    onError: (error) => {
                        toast.error(error.error.message);
                    }
                }
            })
        })
    }
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-2xl font-bold">Welcome!</CardTitle>
                <CardDescription className="text-muted-foreground">
                    Please sign in to your account to continue.
                </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
                <Button disabled={githubPending} onClick={handleGitHubSignIn}>
                    {githubPending ? (
                        <>
                            <Loader className="mr-2 h-4 w-4 animate-spin" />
                            Signing in with GitHub...
                        </>
                    ) : (
                        "Sign in with GitHub"
                    )}
                </Button>
                <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                    <span className="relative z-10 bg-card px-2 text-muted-foreground">Or continue with</span>
                </div>
                <div className="grid gap-3">
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Enter your email" id="email" required />
                    </div>

                    <Button onClick={handleEmailSignIn} disabled={emailPending}>
                        {emailPending ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Signing in with Email...
                            </>
                        ) : (
                            "Sign in with Email"
                        )}
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}