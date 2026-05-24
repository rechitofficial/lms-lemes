"use client";

import type { AdminCourseType } from "@/app/data/admin/admin-get-courses";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { useConstruct } from "@/hooks/use-construct";
import { BadgeDollarSign, CircleCheckBig, Clock3, Eye, GraduationCap, MoreVertical, Pencil, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface iAppProps {
    data: AdminCourseType;
}

export function AdminCourseCard({ data }: iAppProps) {
    const thumbnailUrl = useConstruct(data.fileKey);
    return (
        <Card className="group relative mb-4 overflow-hidden">
            <div className="absolute right-2 top-2 z-10">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="secondary"
                            size="icon"
                            className="h-8 w-8"
                        >
                            <MoreVertical className="size-4" />
                        </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                            <Link href={`/dashboard/courses/${data.id}/edit`} className="flex items-center">
                                <Pencil className="mr-2 size-4" />
                                Edit
                            </Link>
                        </DropdownMenuItem>

                        {/* <DropdownMenuItem asChild>
                            <Link href={`/dashboard/courses/${data.id}/preview`} className="flex items-center">
                                <Eye className="mr-2 size-4" />
                                Preview
                            </Link>
                        </DropdownMenuItem> */}

                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild className="text-destructive focus:text-destructive">
                            <Link href={`/dashboard/courses/${data.id}/delete`} className="flex items-center">
                                <Trash2 className="mr-2 size-4 text-destructive" />
                                Delete
                            </Link>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <div className="overflow-hidden">
                <Image
                    src={thumbnailUrl}
                    alt={data.title}
                    width={600}
                    height={400}
                    className="aspect-video h-full w-full object-cover transition-transform duration-300"
                />
            </div>

            <CardHeader>
                <CardTitle>
                    <Link
                        href={`/dashboard/courses/${data.id}/edit`}
                        className="line-clamp-2 transition-colors hover:underline group-hover:text-primary"
                    >
                        {data.title}
                    </Link>
                </CardTitle>

                <CardDescription className="line-clamp-2">
                    {data.smallDescription}
                </CardDescription>
            </CardHeader>

            <CardContent className="space-y-3 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                    <BadgeDollarSign className="size-4" />

                    <p>
                        <span className="font-medium text-foreground">
                            Price:
                        </span>{" "}
                        {new Intl.NumberFormat("id-ID", {
                            style: "currency",
                            currency: "IDR",
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0,
                        }).format(data.price)}
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <Clock3 className="size-4" />

                    <p>
                        <span className="font-medium text-foreground">
                            Duration:
                        </span>{" "}
                        {data.duration} hours
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <GraduationCap className="size-4" />

                    <p>
                        <span className="font-medium text-foreground">
                            Level:
                        </span>{" "}
                        {data.level}
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <CircleCheckBig className="size-4" />

                    <p>
                        <span className="font-medium text-foreground">
                            Status:
                        </span>{" "}
                        {data.status}
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}

export function AdminCourseCardSkeleton() {
    return (
        <Card className="group relative py-0 gap-0">
            <div className="absolute top-2 right-2 z-10 flex items-center gap-2">
                <Skeleton className="h-6 w-16 rounded-full" />
                <Skeleton className="size-8 rounded-md" />
            </div>
            <div className="w-full relative h-fit">
                <Skeleton className="w-full rounded-t-lg aspect-video h-[250px] object-cover" />
            </div>
            <CardContent className="p-4">
                <Skeleton className="h-6 w-3/4 mb-2 rounded" />
                <Skeleton className="h-4 w-full mb-4 rounded" />
                <div className="mt-4 flex items-center gap-x-5">
                    <div className="flex items-center gap-x-2">
                        <Skeleton className="size-6 rounded-md" />
                        <Skeleton className="h-4 w-10 rounded" />
                    </div>
                    <div className="flex items-center gap-x-2">
                        <Skeleton className="size-6 rounded-md" />
                        <Skeleton className="h-4 w-10 rounded" />
                    </div>
                </div>

                <Skeleton className="h-10 w-full mt-4 rounded" />
            </CardContent>
        </Card>
    )
}

// https://lemes.t3.tigrisfiles.io/