import { adminGetCourse } from "@/app/data/admin/admin-get-course";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EditCourseForm } from "./_components/EditCourseForm";
import { Courgette } from "next/font/google";
import { CourseStructure } from "./_components/CourseStructure";

type Params = Promise<{ courseId: string }>;

export default async function EditCoursePage({ params }: { params: Params }) {
    const { courseId } = await params;
    const data = await adminGetCourse(courseId);
    return (
        <div>
            <h1 className="text-3xl font-bold mb-8">
                Edit Course: <span className="text-primary underline">{data.title}</span>
            </h1>

            <Tabs defaultValue="general" className="w-full">
                <TabsList className="grid grid-cols-2 w-full">
                    <TabsTrigger value="general">General</TabsTrigger>
                    <TabsTrigger value="course-structure">Course Structure</TabsTrigger>
                </TabsList>
                <TabsContent value="general">
                    <Card>
                        <CardHeader>
                            <CardTitle>General Information</CardTitle>
                            <CardDescription>
                                Edit the general information of the course, such as title, description, category, etc.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <EditCourseForm data={data} />
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="course-structure">
                    <Card>
                        <CardHeader>
                            <CardTitle>Course Structure</CardTitle>
                            <CardDescription>
                                Edit the course structure, such as modules, lessons, and quizzes.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <CourseStructure data={data} />
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}