"use client"

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeToggle } from "@/components/ui/themeToggle";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { title } from "process";
import { toast } from "sonner";

interface featurePrps {
    title: string;
    description: string;
    icon: string;
}

const features = [
    {
        title: "Course Management",
        description: "Easily create and manage your courses with our intuitive interface.",
        icon: "book-open"
    },
    {
        title: "Progress Tracking",
        description: "Track your learning progress and stay motivated with our progress tracking features.",
        icon: "chart-line"
    },
    {
        title: "Community Support",
        description: "Join a vibrant community of learners and get support whenever you need it.",
        icon: "users"
    },
    {
        title: "Mobile Friendly",
        description: "Learn on the go with our fully responsive and mobile-friendly design.",
        icon: "smartphone"
    }
]

export default function Home() {
    const { data: session } = authClient.useSession();
    return (
        <>
            <section className="relative py-20">
                <div className="flex flex-col items-center text-center space-y-8">
                    <Badge variant="outline" className="mb-4">
                        The Lemes Stands for LMS - Learning Management System
                    </Badge>
                    <h1 className="mt-6 text-4xl font-bold tracking-tight text-center">
                        Welcome to <span className="text-primary">Lemes</span>
                    </h1>
                    <p className="max-w-[700px] text-muted-foreground md:text-xl">Discover a new way to learn and manage your courses effectively.</p>
                    <div className="flex flex-col sm:flex-row gap-4 mt-8">
                        <Link href="/courses">
                            <Button size="lg">Explore Courses</Button>
                        </Link>
                        <Link href="/login">
                            <Button variant="outline" size="lg">Sign In</Button>
                        </Link>
                    </div>
                </div>
            </section>
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {features.map((feature) => (
                    <Card key={feature.title} className="p-6">
                        <CardHeader>
                            <i className={`lucide-${feature.icon} h-6 w-6 text-primary`} />
                            <CardTitle className="text-lg font-semibold">{feature.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">{feature.description}</p>
                        </CardContent>
                    </Card>
                ))}
            </section>
        </>
    );
}
