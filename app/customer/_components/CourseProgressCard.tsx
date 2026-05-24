"use client";

import { EnrolledCourseType } from "@/app/data/user/get-enrolled-courses";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { useConstruct } from "@/hooks/use-construct";
import { useCourseProgress } from "@/hooks/use-course-progress";
import { School, TimerIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface iAppProps {
    data: EnrolledCourseType
}

export function CourseProgressCard({ data }: iAppProps) {
    const thumbnailUrl = useConstruct(data.course.fileKey);
    const { totalLessons, completedLessons, progressPercentage } = useCourseProgress({ courseData: data.course as any });
    return (
        <Card className="group relative py-0 gap-0">
            <Badge className="absolute  top-2 right-2 z-10">{data.course.level}</Badge>
            <Image width={600} height={400} src={thumbnailUrl} alt="Thumbnail Image of Course" className="w-full rounded-t-xl aspect-video h-full object-cover" />
            <CardContent className="p-4">
                <Link href={`/customer/${data.course.slug}`} className="font-medium text-lg line-clamp-2 hover:underline group-hover:text-primary transition-colors">
                    {data.course.title}
                </Link>
                <p className="text-sm text-muted-foreground mt-2 line-clamp-2 leading-tight">{data.course.smallDescription}</p>
                <div className="space-y-4 mt-5">
                    <div className="flex justify-between mb-1 text-sm">
                        <p>Progress:</p>
                        <p className="font-medium">{progressPercentage}%</p>
                    </div>
                    <Progress value={progressPercentage} className="h-1.5" />
                    <p className="text-xs text-muted-foreground">{completedLessons}/{totalLessons} lessons completed</p>

                </div>
                <Link href={`/customer/${data.course.slug}`} className={buttonVariants({ variant: "outline", className: "w-full mt-6" })}>
                    Learn More
                </Link>
            </CardContent>

        </Card>
    )
}

export function PublicCourseCardSkeleton() {
    return (
        <Card className="group relative py-0 gap-0">
            <div className="absolute top-2 right-2 z-10 flex items-center">
                <Skeleton className="h-6 w-20 rounded-full" />
            </div>
            <div className="w-full relative h-fit">
                <Skeleton className="w-full aspect-video rounded-t-xl" />
            </div>

            <CardContent className="p-4">
                <div className="space-y-2">
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-6 w-3/4" />
                </div>
                <div className="mt-4 flex items-center gap-x-5">
                    <div className="flex items-center gap-x-2">
                        <Skeleton className="size-6 rounded-md" />
                        <Skeleton className="h-4 w-8" />
                    </div>
                    <div className="flex items-center gap-x-2">
                        <Skeleton className="size-6 rounded-md" />
                        <Skeleton className="h-4 w-8" />
                    </div>
                </div>

                <Skeleton className="mt-4 w-full h-10 rounded-md" />   
            </CardContent>

        </Card>
    )
}