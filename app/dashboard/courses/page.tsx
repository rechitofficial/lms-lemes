import { adminGetCourses } from "@/app/data/admin/admin-get-courses";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { AdminCourseCard, AdminCourseCardSkeleton } from "./_components/AdminCourseCard";
import { EmptyState } from "@/components/general/EmptyState";
import { Suspense } from "react";

export default function CoursesPage() {
    return (
        <>
            <div className="container mx-auto px-4 md:px-6 lg:px-8 py-10">
                <h1 className="text-3xl font-bold mb-6">Courses</h1>
                <Link href="/dashboard/courses/create" className={buttonVariants({})}>
                    Create New Course
                </Link>
            </div>
            <div className="text-lg text-gray-600">
                This is the courses page. You can manage your courses here.
            </div>

            <Suspense fallback={<AdminCourseCardSkeletonLayout />}>
                <RenderCourses />
            </Suspense>
        </>
    )
}

async function RenderCourses() {
    const data = await adminGetCourses();

    return (
        <>
            {data.length === 0 ? (
                <EmptyState href="/dashboard/courses/create" title="No courses found" description="You haven't created any courses yet." buttonText="Create New Course" />
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 gap-7">
                    {data.map((course) => (
                        <AdminCourseCard key={course.id} data={course} />
                    ))}
                </div>
            )}
        </>
    );
}

function AdminCourseCardSkeletonLayout() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 gap-7">
            {Array.from({ length: 4 }).map((_, index) => (
                <AdminCourseCardSkeleton key={index} />
            ))}
        </div>
    );
}
