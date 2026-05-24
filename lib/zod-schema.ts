import { description } from "@/components/sidebar/chart-area-interactive";
import { z } from "zod";

export const courseLevels = [
    "BEGINNER",
    "INTERMEDIATE",
    "ADVANCED",
] as const;

export const courseStatuses = [
    "DRAFT",
    "PUBLISHED",
    "ARCHIVED",
] as const;

export const courseCategories = [
    "Programming",
    "Design",
    "Marketing",
    "Business",
    "Photography",
    "Music",
    "Personal Development",
    "Health & Fitness",
    "Other",
] as const;

export const courseSchema = z.object({
    title: z
        .string()
        .min(3, "Title must be at least 3 characters")
        .max(100, "Title must be less than 100 characters"),

    description: z
        .string()
        .min(10, "Description is required")
        .max(2500, "Description must be less than 2500 characters"),

    fileKey: z
        .string()
        .min(1, "File is required"),

    price: z.coerce
        .number()
        .min(1, "Price must be a positive number"),

    duration: z.coerce
        .number()
        .min(1, "Duration must be minimum 1 hour")
        .max(500, "Duration must be less than 500 hours"),

    level: z.enum(courseLevels),

    category: z
        .enum(courseCategories, "Category is required"),

    smallDescription: z
        .string()
        .min(3, "Small description must be at least 3 characters")
        .max(300, "Small description must be less than 300 characters"),

    slug: z
        .string()
        .min(3, "Slug must be at least 3 characters")
        .max(100, "Slug must be less than 100 characters")
        .regex(
            /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
            "Slug must be URL friendly (lowercase letters, numbers, and hyphens only)"
        ),

    status: z
        .enum(courseStatuses)
        .default("DRAFT"),
});

export const chapterSchema = z.object({
    title: z
        .string()
        .min(3, "Title must be at least 3 characters")
        .max(100, "Title must be less than 100 characters"),
    courseId: z.uuid("Invalid course ID"),
});

export const lessonSchema = z.object({
    title: z
        .string()
        .min(3, "Title must be at least 3 characters")
        .max(100, "Title must be less than 100 characters"),
    chapterId: z.uuid("Invalid chapter ID"),
    courseId: z.uuid("Invalid course ID"),
    description: z
        .string()
        .min(3, "Description must be at least 3 characters")
        .max(2500, "Description must be less than 2500 characters")
        .optional(),
    thumbnailKey: z
        .string()
        .optional(),
    videoKey: z
        .string()
        .optional(),
    content: z
        .string()
        .optional(),
});

export type CourseSchemaType = z.infer<typeof courseSchema>;
export type ChapterSchemaType = z.infer<typeof chapterSchema>;
export type LessonSchemaType = z.infer<typeof lessonSchema>;