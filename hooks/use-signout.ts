"use client";

import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function useSignOut() {
    const router = useRouter();
    const handleSignout = async function handleSignOut() {
        await authClient.signOut({
            fetchOptions: {
                onSuccess: () => {
                    router.push("/")
                    toast.success("Signed out successfully!");
                },
                onError: (error) => {
                    toast.error(error.error.message);
                },
            },
        });
    }
    return handleSignout;
}