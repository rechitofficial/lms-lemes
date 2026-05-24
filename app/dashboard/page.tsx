import { ChartAreaInteractive } from "@/components/sidebar/chart-area-interactive"
// import { DataTable } from "@/components/sidebar/data-table"
import { SectionCards } from "@/components/sidebar/section-cards"
import { adminGetEnrollmentStats } from "../data/admin/admin-get-enrollment-stats"
import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"
import { adminGetRecentCourses } from "../data/admin/admin-get-recent-courses"
import { EmptyState } from "@/components/general/EmptyState"
import { AdminCourseCard } from "./courses/_components/AdminCourseCard"
import { Suspense } from "react"
// import data from "./data.json";

export default async function AdminIndexPage() {
  const enrollmentData = await adminGetEnrollmentStats()
  return (
    <>
      <SectionCards />
      {/* <div className="px-4 lg:px-6"> */}
      <ChartAreaInteractive data={enrollmentData} />
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Recent Courses</h2>
          <Link href="/admin/courses" className={buttonVariants({ variant: "outline" })}>
            View All
          </Link>
        </div>
        <Suspense fallback={<RenderRecentCoursesSkeleton />}>
          <RenderRecentCourses />
        </Suspense>


      </div>
      {/* </div> */}
      {/* <DataTable data={data} /> */}
    </>
  )
}

async function RenderRecentCourses() {
  const data = await adminGetRecentCourses()
  if (data.length === 0) {
    return (
      <EmptyState
        buttonText="Create Course"
        description="No courses found. Start by creating a new course."
        title="No Courses"
        href="/admin/courses/create" />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {data.map(course => (
        <AdminCourseCard key={course.id} data={course} />
      ))}

    </div>
  )
}

function RenderRecentCoursesSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="animate-pulse rounded-lg bg-muted p-4">
          <div className="mb-4 h-32 w-full rounded-md bg-muted" />
          <div className="h-4 w-3/4 rounded-md bg-muted mb-2" />
          <div className="h-3 w-1/2 rounded-md bg-muted" />
        </div>
      ))}

    </div>

  )
}