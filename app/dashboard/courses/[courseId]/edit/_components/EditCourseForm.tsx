"use client";

import { Controller, Resolver, useForm } from "react-hook-form"
import { Button, buttonVariants } from "@/components/ui/button";
import { ArrowLeft, Loader2, PlusIcon, SparkleIcon } from "lucide-react";
import { courseCategories, courseLevels, courseSchema, CourseSchemaType, courseStatuses } from "@/lib/zod-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import slugify from 'slugify';
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RichTextEditor } from "@/components/rich-text-editor/Editor";
import { Uploader } from "@/components/file-uploader/Uploader";
import { useTransition } from "react";
import { tryCatch } from "@/hooks/try-catch";
// import { CreateCourse } from "./action";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { AdminCourseSingularType } from "@/app/data/admin/admin-get-course";
import { editCourse } from "../actions";


interface iAppProps {
    data: AdminCourseSingularType
}

export function EditCourseForm({ data }: iAppProps) {
    const [isPending, startTransition] = useTransition();
    const router = useRouter();
    const form = useForm<CourseSchemaType>({
        resolver: zodResolver(courseSchema) as Resolver<CourseSchemaType>,
        defaultValues: {
            title: data.title,
            description: data.description,
            category: data.category as CourseSchemaType["category"],
            fileKey: data.fileKey,
            price: data.price,
            duration: data.duration,
            level: data.level,
            smallDescription: data.smallDescription,
            slug: data.slug,
            status: data.status,
        },
    })

    function onSubmit(values: CourseSchemaType) {
        startTransition(async () => {
            const { data: result, error } = await tryCatch(editCourse(values, data.id));

            if (error) {
                toast.error("An error occurred while editing the course");
                return;
            }

            if (result?.status === "success") {
                toast.success(result.message);
                form.reset();
                router.push("/dashboard/courses");
            } else if (result?.status === "error") {
                toast.error(result.message);
            }
            // Call the server action to edit the course
            // editCourse(data);
        })
    }
    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid w-full gap-6">
            <FieldGroup>
                <Controller
                    name="title"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="form-rhf-demo-title">
                                Course Title
                            </FieldLabel>
                            <Input
                                {...field}
                                id="form-rhf-demo-title"
                                aria-invalid={fieldState.invalid}
                                placeholder="Enter the title of your course"
                                autoComplete="off"
                            />
                            {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                            )}
                        </Field>
                    )}
                />
                <Controller
                    name="slug"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="form-rhf-demo-slug">
                                Course Slug
                            </FieldLabel>
                            <Input
                                {...field}
                                id="form-rhf-demo-slug"
                                aria-invalid={fieldState.invalid}
                                placeholder="Enter the slug of your course"
                                autoComplete="off"
                            />
                            {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                            )}
                        </Field>
                    )}
                />
                <Button type="button" className="self-end" onClick={() => {
                    const titleValue = form.getValues("title")
                    const slug = slugify(titleValue, { lower: true })

                    form.setValue("slug", slug, { shouldValidate: true })
                }}>
                    Generate Slug <SparkleIcon className="size-4 ml-2" />
                </Button>
                <Controller
                    name="smallDescription"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="form-rhf-demo-smallDescription">
                                Small Description
                            </FieldLabel>
                            <Textarea
                                {...field}
                                id="form-rhf-demo-smallDescription"
                                aria-invalid={fieldState.invalid}
                                placeholder="Enter a small description of your course"
                                autoComplete="off"
                            />
                            {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                            )}
                        </Field>
                    )}
                />
                <Controller
                    name="description"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="form-rhf-demo-description">
                                Description
                            </FieldLabel>
                            <RichTextEditor field={field} />
                            {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                            )}
                        </Field>
                    )}
                />
                <Controller
                    name="fileKey"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="form-rhf-demo-fileKey">
                                File Key
                            </FieldLabel>
                            <Uploader fileTypeAccepted="image" value={field.value} onChange={field.onChange} />
                            {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                            )}
                        </Field>
                    )}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Controller
                        name="category"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor="form-rhf-demo-category">
                                    Category
                                </FieldLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select a category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {courseCategories.map((category) => (
                                            <SelectItem key={category} value={category}>
                                                {category}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                    />
                    <Controller
                        name="level"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor="form-rhf-demo-level">
                                    Level
                                </FieldLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select a level" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {courseLevels.map((level) => (
                                            <SelectItem key={level} value={level}>
                                                {level}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                    />
                    <Controller
                        name="duration"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor="form-rhf-demo-duration">
                                    Duration (in hours)
                                </FieldLabel>
                                <Input
                                    {...field}
                                    id="form-rhf-demo-duration"
                                    aria-invalid={fieldState.invalid}
                                    placeholder="Enter the duration of your course in hours"
                                    autoComplete="off"
                                />
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                    />
                    <Controller
                        name="price"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor="form-rhf-demo-price">
                                    Price (in IDR)
                                </FieldLabel>
                                <Input
                                    {...field}
                                    id="form-rhf-demo-price"
                                    aria-invalid={fieldState.invalid}
                                    placeholder="Enter the price of your course in IDR"
                                    autoComplete="off"
                                />
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                    />
                </div>

                <Controller
                    name="status"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="form-rhf-demo-status">
                                Status
                            </FieldLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select a status" />
                                </SelectTrigger>
                                <SelectContent>
                                    {courseStatuses.map((status) => (
                                        <SelectItem key={status} value={status}>
                                            {status}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                            )}
                        </Field>
                    )}
                />
                <Button type="submit" className="self-end" disabled={isPending}>
                    {isPending ? (
                        <>
                            Updating... <Loader2 className="animate-spin ml-1" />
                        </>
                    ) : (
                        <>
                            Update Course <PlusIcon className="size-4 ml-2" />
                        </>
                    )}
                </Button>
            </FieldGroup>
        </form>
    );
}