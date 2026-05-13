import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

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
        </>
    )
}