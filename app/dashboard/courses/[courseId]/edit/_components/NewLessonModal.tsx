import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { chapterSchema, ChapterSchemaType, lessonSchema, LessonSchemaType } from "@/lib/zod-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useState, useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { createLesson } from "../actions";
import { tryCatch } from "@/hooks/try-catch";
import { toast } from "sonner";

export function NewLessonModal({ courseId, chapterId }: { courseId: string, chapterId: string }) {
    const [isOpen, setIsOpen] = useState(false);
    const [isPending, startTransition] = useTransition();

    const form = useForm<LessonSchemaType>({
        resolver: zodResolver(lessonSchema),
        defaultValues: {
            title: "",
            courseId: courseId,
            chapterId: chapterId,
        },
    })

    function handleOpenChange(open: boolean) {
        if (!open) {
            form.reset();
        }
        setIsOpen(open);
    }

    async function onSubmit(data: LessonSchemaType) {
        console.log("SUBMIT TRIGGERED", data);
        startTransition(async () => {
            const { data: result, error } = await tryCatch(createLesson(data));

            if (error) {
                toast.error("Error creating lesson, please try again.");
                // You can also show a toast notification here to inform the user
            }

            if (result?.status === "success") {
                toast.success("Lesson created successfully!");
                form.reset();
                setIsOpen(false);
            } else if (result?.status === "error") {
                toast.error(result.message || "Failed to create lesson.");
            }
        });
    }
    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button variant="outline" className="w-full justify-center gap-1">
                    <Plus className="size-4" />
                    Add New Lesson
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[452px]">
                <DialogTitle>Add New Lesson</DialogTitle>
                <DialogDescription>
                    Enter the details for the new lesson you want to add to this course.
                </DialogDescription>
                <DialogHeader />
                <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
                    <FieldGroup>
                        <Controller
                            name="title"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="form-rhf-demo-title">
                                        Lesson Name
                                    </FieldLabel>
                                    <Input
                                        {...field}
                                        id="form-rhf-demo-title"
                                        aria-invalid={fieldState.invalid}
                                        placeholder="Enter the lesson name"
                                        autoComplete="off"
                                    />
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />

                    </FieldGroup>

                    <DialogFooter>
                        <Button type="submit" disabled={isPending}>
                            {isPending ? "Saving..." : "Save Lesson"}
                        </Button>
                    </DialogFooter>

                </form>
                {/* Form fields for lesson title, description, etc. would go here */}
            </DialogContent>

        </Dialog>
    );
}