import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { chapterSchema, ChapterSchemaType } from "@/lib/zod-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useState, useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { createChapter } from "../actions";
import { tryCatch } from "@/hooks/try-catch";
import { toast } from "sonner";

export function NewChapterModal({ courseId }: { courseId: string }) {
    const [isOpen, setIsOpen] = useState(false);
    const [isPending, startTransition] = useTransition();

    const form = useForm<ChapterSchemaType>({
        resolver: zodResolver(chapterSchema),
        defaultValues: {
            title: "",
            courseId: courseId,
        },
    })

    function handleOpenChange(open: boolean) {
        if(!open) {
            form.reset();
        }
        setIsOpen(open);
    }

    async function onSubmit(data: ChapterSchemaType) {
        startTransition(async () => {
            const { data: result, error } = await tryCatch(createChapter(data)) ;

            if (error) {
                toast.error("Error creating chapter, please try again.");
                // You can also show a toast notification here to inform the user
            }

            if (result?.status === "success") {
                toast.success("Chapter created successfully!");
                form.reset();
                setIsOpen(false);
            } else if (result?.status === "error") {
                toast.error(result.message || "Failed to create chapter.");
            }
        });
    }
    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                    <Plus className="size-4" />
                    Add New Chapter
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[452px]">
                <DialogTitle>Add New Chapter</DialogTitle>
                <DialogDescription>
                    Enter the details for the new chapter you want to add to this course.
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
                                        Chapter Name
                                    </FieldLabel>
                                    <Input
                                        {...field}
                                        id="form-rhf-demo-title"
                                        aria-invalid={fieldState.invalid}
                                        placeholder="Enter the chapter name"
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
                            {isPending ? "Saving..." : "Save Chapter"}
                        </Button>
                    </DialogFooter>

                </form>
                {/* Form fields for chapter title, description, etc. would go here */}
            </DialogContent>

        </Dialog>
    );
}