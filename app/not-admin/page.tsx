import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, ShieldX } from "lucide-react";
import Link from "next/link";

export default function NotAdminPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <Card className="w-full max-w-md shadow-md">
                <CardHeader className="flex flex-col items-center text-center space-y-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
                        <ShieldX className="h-7 w-7 text-destructive" />
                    </div>

                    <div className="space-y-1">
                        <CardTitle className="text-2xl">
                            Access Denied
                        </CardTitle>

                        <CardDescription>
                            You do not have permission to access this page.
                        </CardDescription>
                    </div>
                </CardHeader>

                <CardContent>
                    <Link
                        href="/"
                        className={buttonVariants({
                            variant: "outline",
                            className: "w-full",
                        })}
                    >
                        <ArrowLeft className="mr-2 size-4" />
                        Back to Home
                    </Link>
                </CardContent>
            </Card>
        </div>
    );
}