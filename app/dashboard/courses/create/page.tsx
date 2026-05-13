"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Loader2, PlusIcon, SparkleIcon } from "lucide-react";
import { Controller, useForm } from "react-hook-form"
import Link from "next/link";
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
import { CreateCourse } from "./action";
import { da } from "zod/v4/locales";
import { toast } from "sonner";
import { useRouter } from "next/navigation";


export default function CourseCreationPage() {
    const [isPending, startTransition] = useTransition();
    const router = useRouter();
    const form = useForm<CourseSchemaType>({
        resolver: zodResolver(courseSchema),
        defaultValues: {
            title: "",
            description: "",
            category: "Business",
            fileKey: "",
            price: 0,
            duration: 0,
            level: "BEGINNER",
            smallDescription: "",
            slug: "",
            status: "DRAFT",
        },
    })

    function onSubmit(values: CourseSchemaType) {
        startTransition(async () => {
            const { data, error } = await tryCatch(CreateCourse(values));

            if (error) {
                toast.error("An error occurred while creating the course");
                return;
            }

            if (data?.status === "success") {
                toast.success(data.message);
                form.reset();
                router.push("/dashboard/courses");
            } else if (data?.status === "error") {
                toast.error(data.message);
            }
            // Call the server action to create the course
            // createCourse(data);
        })
    }
    return (
        <>
            <div className="flex items-center gap-4">
                <Link href="/dashboard/courses" className={buttonVariants({
                    variant: "outline",
                    size: "icon",
                })}>
                    <ArrowLeft className="size-4" />
                </Link>
                <h1 className="text-2xl font-bold">Create New Course</h1>
            </div>
            <Card className="mt-6">
                <CardHeader>
                    <CardTitle>
                        Basic Information
                    </CardTitle>
                    <CardDescription>
                        Start by providing the basic information about your course, such as the title, description, and category.
                    </CardDescription>
                </CardHeader>
                <CardContent>
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
                                        <Uploader value={field.value} onChange={field.onChange} />
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
                                                Price (in USD)
                                            </FieldLabel>
                                            <Input
                                                {...field}
                                                id="form-rhf-demo-price"
                                                aria-invalid={fieldState.invalid}
                                                placeholder="Enter the price of your course in USD"
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
                                        "Creating..." <Loader2 className="animate-spin ml-1" />
                                    </>
                                ) : (
                                    <>
                                        Create Course <PlusIcon className="size-4 ml-2" />
                                    </>
                                )}
                            </Button>
                        </FieldGroup>
                    </form>
                    {/* Form fields for course creation will go here */}
                </CardContent>
            </Card>
            <div className="container mx-auto px-4 md:px-6 lg:px-8 py-10">
                <h1 className="text-3xl font-bold mb-6">Create New Course</h1>
                <p className="text-lg text-gray-600">
                    This is the course creation page. You can create a new course here.
                </p>

            </div>
        </>
    )
}