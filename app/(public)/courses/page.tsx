import { getAllCourses } from "@/app/data/course/get-all-courses";
import { Public } from "@/lib/generated/prisma/runtime/client";
import { PublicCourseCard, PublicCourseCardSkeleton } from "../_components/PublicCourseCard";
import { Suspense } from "react";

export default function PublicCoursesRoute() {
    return (
        <div className="px-4 md:px-6 lg:px-8 py-10">
            <div className="flex flex-col space-y-2 mb-10">
                <h1 className="text-3xl md:text-4xl font-bold tracking">Explore Courses</h1>
                <p className="text-muted-foreground">Discover our wide range of courses and enhance your skills.</p>
            </div>
            <Suspense fallback={<LoadingSkeletonLayout />}>
                <RenderCourses />
            </Suspense>
        </div>
    );
}

async function RenderCourses() {
    const courses = await getAllCourses();

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
                <PublicCourseCard key={course.id} data={course} />
            ))}
        </div>
    )
}

function LoadingSkeletonLayout() {
    return <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
            <PublicCourseCardSkeleton key={index} />
        ))}
    </div>
}