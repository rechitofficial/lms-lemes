import { getIndividualCourse } from "@/app/data/course/get-course";
import { RenderDescription } from "@/components/rich-text-editor/RenderDescription";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";
import { Book, ChartBar, CheckIcon, ChevronDown, Clock3, GraduationCap, Play, School } from "lucide-react";
import Image from "next/image";
import { enrollInCourse } from "./action";
import { redirect } from "next/navigation";
import { checkIfCourseEnrolled } from "@/app/data/user/user-is-enrolled";
import Link from "next/link";
import { EnrollmentStatus } from "@/lib/generated/prisma";
import EnrollmentButton from "../_components/EnrollmentButton";

type Params = Promise<{ slug: string }>;

export default async function SlugPage({ params }: { params: Params }) {
    const { slug } = await params;
    const course = await getIndividualCourse(slug);
    const isEnrolled = await checkIfCourseEnrolled(course.id);
    return (
        <>
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 mt-5">
                <div className="order-1 lg:col-span-2">
                    <div className="relative aspect-video w-full overflow-hidden rounded-xl shadow-lg">
                        <Image src={`https://${process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME_IMAGES}.t3.tigrisfiles.io/${course.fileKey}`} alt={course.title} fill className="object-cover" priority />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                    </div>
                    <div className="mt-8 space-y-6">
                        <div className="space-y-4">
                            <h1 className="text-3xl font-bold tracking-light">{course.title}</h1>
                            <p className="text-lg text-muted-foreground leading-relaxed line-clamp-2">{course.smallDescription}</p>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-3 mt-2">
                        <Badge className="flex items-center gap-1 px-3 py-1">
                            <GraduationCap className="size-4" />
                            <span>{course.level}</span>
                        </Badge>
                        <Badge className="flex items-center gap-1 px-3 py-1">
                            <School className="size-4" />
                            <span>{course.category}</span>
                        </Badge>
                        <Badge className="flex items-center gap-1 px-3 py-1">
                            <Clock3 className="size-4" />
                            <span>{course.duration}</span>
                        </Badge>
                    </div>
                    <Separator className="my-8" />
                    <div className="space-y-6">
                        <h2 className="text-3xl font-semibold tracking-light">Course Description</h2>
                        <div>
                            <RenderDescription json={JSON.parse(course.description)} />
                        </div>

                    </div>

                    <div className="mt-12 space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-3xl font-semibold tracking-light">Course Content</h2>
                            <div>{course.chapter.length} Chapter{course.chapter.length > 1 ? "s" : ""} | {course.chapter.reduce((acc, chapter) => acc + chapter.lesson.length, 0) || 0} Lesson{course.chapter.reduce((acc, chapter) => acc + chapter.lesson.length, 0) > 1 ? "s" : ""}</div>
                        </div>
                    </div>

                    <div className="space-y-4 pb-32 mt-6">
                        {course.chapter.map((chapter, index) => (
                            <Collapsible key={chapter.id} defaultOpen={index === 0} className="border rounded-lg">
                                <Card className="group border-0 rounded-lg gap-0">
                                    <CollapsibleTrigger>
                                        <div className="p-4 space-y-3">
                                            <CardContent className="flex items-center justify-between py-2 hover:bg-accent transition-colors rounded-lg cursor-pointer">
                                                <div className="flex items-center justify-between w-full">
                                                    <div className="flex items-center gap-4">
                                                        <p className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold">{index + 1}</p>
                                                        <div>
                                                            <h3 className="text-lg font-semibold text-left">{chapter.title}</h3>
                                                            <p className="text-muted-foreground mt-1 text-left text-sm">{chapter.lesson.length} Lesson{chapter.lesson.length > 1 ? "s" : ""}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <Badge variant="outline" className="text-xs">{chapter.lesson.length} Lesson{chapter.lesson.length > 1 ? "s" : ""}</Badge>
                                                        <ChevronDown className="size-5" />
                                                    </div>


                                                </div>
                                            </CardContent>
                                        </div>
                                    </CollapsibleTrigger>
                                    <CollapsibleContent className="mt-1">
                                        <div className="border-t bg-muted/20 mt-1">
                                            <div className="p-6 space-y-3">
                                                {chapter.lesson.map((lesson, index) => (
                                                    <div key={lesson.id} className="flex items-center gap-4 rounded-lg p-3 hover:bg-accent transition-colors cursor-pointer">
                                                        <div className="flex size-8 items-center justify-center rounded-full bg-background border-2 border-primary/20">
                                                            <Play className="size-4 text-muted-foreground group-hover:text-primary transition-colors" />
                                                        </div>
                                                        <div className="flex-1 leading-tight">
                                                            <p className="text-sm font-medium">{lesson.title}</p>
                                                            <p>Lesson {index + 1}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                        </div>

                                    </CollapsibleContent>
                                </Card>
                            </Collapsible>
                        ))}

                    </div>
                </div>
                <div className="order-2 lg:col-span1">
                    <div className="sticky top-20">
                        <Card className="overflow-hidden border-0 bg-gradient-to-b from-background to-muted/30 shadow-xl">
                            <CardContent className="p-0">
                                {/* Header */}
                                <div className="border-b bg-background/80 p-6 backdrop-blur">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">
                                                Course Price
                                            </p>
                                            {/* TODO: add currency formatting for other currencies */}
                                            <h2 className="mt-1 text-3xl font-bold tracking-tight">
                                                {new Intl.NumberFormat("id-ID", {
                                                    style: "currency",
                                                    currency: "IDR",
                                                }).format(course.price)}
                                            </h2>
                                        </div>

                                        <div className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                                            Premium Access
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6 p-6">
                                    {/* Course Highlights */}
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2">
                                            <div className="h-5 w-1 rounded-full bg-primary" />
                                            <h4 className="text-base font-semibold">
                                                Course Highlights
                                            </h4>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="rounded-xl border bg-background/60 p-4">
                                                <p className="text-sm text-muted-foreground">
                                                    Course Duration
                                                </p>
                                                <p className="mt-1 font-semibold">
                                                    {course.duration} hours
                                                </p>
                                            </div>

                                            <div className="rounded-xl border bg-background/60 p-4">
                                                <p className="text-sm text-muted-foreground">
                                                    Skill Level
                                                </p>
                                                <p className="mt-1 font-semibold uppercase">
                                                    {course.level}
                                                </p>
                                            </div>

                                            <div className="rounded-xl border bg-background/60 p-4">
                                                <p className="text-sm text-muted-foreground">
                                                    Category
                                                </p>
                                                <p className="mt-1 font-semibold">
                                                    {course.category}
                                                </p>
                                            </div>

                                            <div className="rounded-xl border bg-background/60 p-4">
                                                <p className="text-sm text-muted-foreground">
                                                    Total Lessons
                                                </p>
                                                <p className="mt-1 font-semibold">
                                                    {course.chapter.reduce(
                                                        (acc, chapter) => acc + chapter.lesson.length,
                                                        0
                                                    )}{" "}
                                                    lesson
                                                    {course.chapter.reduce(
                                                        (acc, chapter) => acc + chapter.lesson.length,
                                                        0
                                                    ) > 1 && "s"}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Included Features */}
                                    <div className="space-y-4 rounded-2xl border bg-background/70 p-5">
                                        <div className="flex items-center gap-2">
                                            <div className="h-5 w-1 rounded-full bg-green-500" />
                                            <h4 className="text-base font-semibold">
                                                Included in this course
                                            </h4>
                                        </div>

                                        <ul className="space-y-3">
                                            {[
                                                "Full lifetime access",
                                                "Access on mobile & desktop",
                                                "Certificate of completion",
                                            ].map((item) => (
                                                <li
                                                    key={item}
                                                    className="flex items-center gap-3 text-sm"
                                                >
                                                    <div className="flex size-7 items-center justify-center rounded-full bg-green-500/10 text-green-500">
                                                        <CheckIcon className="size-4" />
                                                    </div>

                                                    <span className="text-muted-foreground">
                                                        {item}
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* CTA */}
                                    <div className="space-y-3">
                                        {/* <form action={async () => { (only for test)
                                            "use server"; 
                                            const response = await enrollInCourse(course.id);
                                            if (response.status === "success" && response.data) {
                                                redirect(response.data.redirectUrl)
                                            }
                                        }}> */}

                                        {isEnrolled ? (
                                            <Link className={buttonVariants({ className: "w-full" })} href={`/cusomer-dashboard`}>
                                                Watch Now
                                            </Link>
                                        ) : (
                                            <EnrollmentButton courseId={course.id} />
                                        )}
                                        {/* </form> */}

                                        <p className="text-center text-xs text-muted-foreground">
                                            7-day money-back guarantee
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

            </div>

        </>
    );
}