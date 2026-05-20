"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { tryCatch } from "@/hooks/try-catch";
import Link from "next/link";
import React from "react";
import { deleteCourse } from "./action";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Trash2 } from "lucide-react";

export default function DeleteCoursePage() {
    const [isPending, startTransition] = React.useTransition();
    const { courseId } = useParams<{ courseId: string }>(); // must be the same name as in the file name [courseId]
    const router = useRouter();
    function onSubmit() {
        startTransition(async () => {
            const { data, error } = await tryCatch(deleteCourse(courseId));

            if (error) {
                toast.error("An error occurred while deleting the course");
                return;
            }

            if (data?.status === "success") {
                toast.success(data.message);
                router.push("/dashboard/courses");
            } else if (data?.status === "error") {
                toast.error(data.message);
            }
        })
    }
    return (
        <div className="max-w-xl mx-auto w-full">
            <Card className="mt-32">
                <CardHeader>
                    <CardTitle>Are you sure you want to delete this course?</CardTitle>
                    <CardDescription>This action cannot be undone.</CardDescription>
                </CardHeader>
                <CardContent className="flex items-center justify-between">
                    <Link href="/dashboard/courses" className={buttonVariants({ variant: "destructive", className: "mr-4" })}>
                        Cancel
                    </Link>

                    <Button variant="destructive" onClick={onSubmit} disabled={isPending}>
                        {isPending ?
                            (<>
                                <Loader2 className="animate-spin mr-2 size-4" />
                                Deleting...
                            </>) : (<>
                                <Trash2 className="mr-2 size-4" />
                                Yes, delete it
                            </>)}
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}