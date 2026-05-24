"use client";

import { Button } from "@/components/ui/button";
import { tryCatch } from "@/hooks/try-catch";
import { useTransition } from "react";
import { enrollInCourse } from "../[slug]/action";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function EnrollmentButton({ courseId }: { courseId: string }) {
    const [isPending, startTransition] = useTransition();

    function onSubmit() {
        startTransition(async () => {
            const { data, error } = await tryCatch(enrollInCourse(courseId));

            if (error) {
                console.log("ERROR ENROLLING IN COURSE", error);
                toast.error("An error occurred while creating the course");
                return;
            }

            if (data?.status === "success") {
                toast.success(data.message);
            } else if (data?.status === "error") {
                toast.error(data.message);
            }
            // Call the server action to create the course
            // createCourse(data);
        })
    }
    return (
        <Button className="w-full" onClick={onSubmit} disabled={isPending}>
            {isPending ? (
                <>
                    <Loader2 className="animate-spin mr-2" />
                    Enrolling...
                </>
            ) : ("Enroll Now")}
        </Button>
    )
}