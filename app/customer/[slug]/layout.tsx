import { getCourseSidebarData } from "@/app/data/course/get-course-sidebar-data";
import { CourseSidebar } from "../_components/CourseSidebar";

interface iAppProps {
    params: Promise<{slug: string}>
    children: React.ReactNode;
}

export default async function CourseLayout({ children, params }: iAppProps) {
    const { slug } = await params;

    const course = await getCourseSidebarData(slug);
    return (
        <div className="flex flex-1">
            {/* sidebar - 30% */}
            <div className="w-80 border-border shrink-0">
                <CourseSidebar course={course.course} />
                {/* <ul>
                    <li><a href="#" className="text-blue-500 hover:underline">Overview</a></li>
                    <li><a href="#" className="text-blue-500 hover:underline">Lessons</a></li>
                    <li><a href="#" className="text-blue-500 hover:underline">Assignments</a></li>
                </ul> */}
            </div>
            {/* main content - 70% */}
            <div className="flex-1 overflow-hidden">{children}</div>
            {/* <div className="w-2/3 p-4">
                {children}
            </div> */}
        </div>
    )
}