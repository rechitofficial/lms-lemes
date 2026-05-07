import { buttonVariants } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import Logo from "@/public/logo.png"

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="relative flex min-h-svh flex-col items-center justify-center">
            <Link href="/" className={buttonVariants({ variant: "ghost", size: "sm" }) + " absolute left-4 top-4"}>
                <ArrowLeft className="size-4" />
                Back
            </Link>
            <div className="flex w-full max-w-sm flex-col gap-6">
                <Link className="flex items-center gap-2 self-center font-medium" href="/">
                    <Image src={Logo} alt="Logo" width={32} height={32} />
                    My LMS
                </Link>
                {children}

                <div className="text-balance text-center text-xs text-muted-foreground">
                    By clicking continue, do you agree to our <Link href="/terms" className="underline">Terms of Service</Link> and <Link href="/privacy" className="underline">Privacy Policy</Link>?
                </div>
            </div>
        </div>
    )
}