"use client";

import { AdminLessonType } from "@/app/data/admin/admin-get-lesson";
import { Uploader } from "@/components/file-uploader/Uploader";
import { RichTextEditor } from "@/components/rich-text-editor/Editor";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { tryCatch } from "@/hooks/try-catch";
import { lessonSchema, LessonSchemaType } from "@/lib/zod-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { UpdateLesson } from "../action";
import { toast } from "sonner";

interface iAppProps {
    data: AdminLessonType;
    chapterId: string;
    courseId: string;
}

export function LessonForm({ data, chapterId, courseId }: iAppProps) {
    const [isPending, startTransition] = React.useTransition();
    const form = useForm<LessonSchemaType>({
        resolver: zodResolver(lessonSchema),
        defaultValues: {
            title: data.title,
            chapterId: chapterId,
            courseId: courseId,
            description: data.description ?? undefined,
            videoKey: data.videoKey ?? undefined,
            thumbnailKey: data.thumbnailKey ?? undefined,
        },
    })

     function onSubmit(values: LessonSchemaType) {
        startTransition(async () => {
            const { data: result, error } = await tryCatch(UpdateLesson(values, data.id));

            if (error) {
                toast.error("An error occurred while updating the lesson.");
                return;
            }

            if (result?.status === "success") {
                toast.success(result.message);
            } else if (result?.status === "error") {
                toast.error(result.message);
            }
            // Call the server action to create the course
            // createCourse(data);
        })
    }
    return (
        <div>
            <Link className={buttonVariants({ variant: "ghost", className: "mb-6" })} href={`/dashboard/courses/${courseId}/edit`}>
                <ArrowLeft className="inline mr-2" />
                <span>Back to chapter</span>
            </Link>
            <Card>
                <CardHeader>
                    <CardTitle>Lesson Configuration</CardTitle>
                    <CardDescription>
                        Edit the lesson details, such as title, content, and resources.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {/* You can add a form here to edit the lesson details */}
                    <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
                        <FieldGroup>
                            <Controller
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <Field>
                                        <FieldLabel>Lesson Title</FieldLabel>
                                        <Input
                                            {...field}
                                            id="form-rhf-demo-title"
                                            aria-invalid={form.formState.errors.title ? "true" : "false"}
                                            placeholder="Enter the title of your lesson"
                                            autoComplete="off"
                                        />
                                        {form.formState.errors.title && (
                                            <FieldError role="alert">{form.formState.errors.title.message}</FieldError>
                                        )}
                                    </Field>
                                )}
                            />
                            <Controller
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <Field>
                                        <FieldLabel>Lesson Description</FieldLabel>
                                        <RichTextEditor
                                            field={field}
                                        />
                                        {form.formState.errors.description && (
                                            <FieldError role="alert">{form.formState.errors.description.message}</FieldError>
                                        )}
                                    </Field>
                                )}
                            />
                            <Controller
                                control={form.control}
                                name="thumbnailKey"
                                render={({ field }) => (
                                    <Field>
                                        <FieldLabel>Lesson Thumbnail</FieldLabel>
                                        <Uploader fileTypeAccepted="image" onChange={(key) => field.onChange(key)} value={field.value} />
                                        {form.formState.errors.thumbnailKey && (
                                            <FieldError role="alert">{form.formState.errors.thumbnailKey.message}</FieldError>
                                        )}
                                    </Field>
                                )}
                            />
                            <Controller
                                control={form.control}
                                name="videoKey"
                                render={({ field }) => (
                                    <Field>
                                        <FieldLabel>Lesson Video</FieldLabel>
                                        <Uploader fileTypeAccepted="video" onChange={(key) => field.onChange(key)} value={field.value}/>
                                        {form.formState.errors.videoKey && (
                                            <FieldError role="alert">{form.formState.errors.videoKey.message}</FieldError>
                                        )}
                                    </Field>
                                )}
                            />
                        </FieldGroup>
                        <Button disabled={isPending} type="submit">
                            {isPending ? "Saving..." : "Save Changes"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
            {/* You can add more details about the lesson here */}
        </div>
    )
}