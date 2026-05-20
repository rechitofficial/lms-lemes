"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DndContext, DragEndEvent, DraggableSyntheticListeners, KeyboardSensor, PointerSensor, rectIntersection, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useEffect, useState } from "react";
import { CSS } from "@dnd-kit/utilities";
import { AdminCourseSingularType } from "@/app/data/admin/admin-get-course";
import { cn } from "@/lib/utils";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronRight, FileText, GripVertical, Trash2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { reorderChapters, reorderLessons } from "../actions";
import { NewChapterModal } from "./NewChapterModal";
import { NewLessonModal } from "./NewLessonModal";
import { DeleteLesson } from "./DeleteLesson";
import { DeleteChapter } from "./DeleteChapter";

interface iAppProps {
    data: AdminCourseSingularType;
}

interface SortableItemProps {
    id: string;
    children: (listeners: DraggableSyntheticListeners) => React.ReactNode;
    className?: string;
    data?: {
        type: 'chapter' | 'lesson';
        chapterId?: string;
        lessonId?: string;
    }
}


export function CourseStructure({ data }: iAppProps) {
    const initialItems = data.chapter.map((chapter) => ({
        id: chapter.id,
        title: chapter.title,
        order: chapter.position,
        isOpen: true, // default to true
        lessons: chapter.lesson.map((lesson) => ({
            id: lesson.id,
            title: lesson.title,
            order: lesson.position,
        }))
    })) || [];
    const [items, setItems] = useState(initialItems);

    useEffect(() => {
        setItems((prevItems) => {
            const updatedItems = data.chapter.map((chapter) => ({
                id: chapter.id,
                title: chapter.title,
                order: chapter.position,
                isOpen: prevItems.find((item) => item.id === chapter.id)?.isOpen ?? true,
                lessons: chapter.lesson.map((lesson) => ({
                    id: lesson.id,
                    title: lesson.title,
                    order: lesson.position,
                })),
            })) || [];
            return updatedItems;
        });
    }, [data]);


    function SortableItem({ id, children, className, data }: SortableItemProps) {
        const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: id, data: data });

        const style = {
            transform: CSS.Transform.toString(transform),
            transition,
        }
        return (
            <div key={id} ref={setNodeRef} style={style} {...attributes} className={cn("touch-none", className, isDragging ? "z-10" : "")}>
                {children(listeners)}
            </div>
        )
    }
    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;

        if (!over || active.id === over.id) {
            return;
        }

        const activeId = active.id;
        const overId = over.id;
        const activeType = active.data.current?.type as 'chapter' | 'lesson';
        const overType = over.data.current?.type as 'chapter' | 'lesson';
        const courseId = data.id;

        if (activeType === 'chapter') {
            let targetChapterId = null;
            if (overType === 'chapter') {
                targetChapterId = overId;
            } else if (overType === 'lesson') {
                targetChapterId = over.data.current?.chapterId ?? null;
            }
            if (!targetChapterId) {
                toast.error("Invalid drop target");
                return;
            }

            const oldIndex = items.findIndex((item) => item.id === activeId);
            const newIndex = items.findIndex((item) => item.id === targetChapterId);

            if (oldIndex === -1 || newIndex === -1) {
                toast.error("Invalid chapter");
                return;
            }

            const reorderedLocalChapters = arrayMove(items, oldIndex, newIndex).map((item, index) => ({
                ...item,
                order: index + 1,
            }));

            const previousItems = [...items];
            setItems(reorderedLocalChapters);

            if (courseId) {
                const chaptersToUpdate = reorderedLocalChapters.map(chapter => ({
                    id: chapter.id,
                    position: chapter.order,
                }));

                const reorderChaptersPromise = () => reorderChapters(courseId, chaptersToUpdate);

                toast.promise(reorderChaptersPromise(), {
                    loading: "Reordering chapters...",
                    success: (result) => {
                        if (result.status === "success") {
                            return result.message;
                        } else {
                            setItems(previousItems);
                            return result.message || "An error occurred while reordering chapters";
                        }
                    },
                    error: () => {
                        setItems(previousItems);
                        return "An error occurred while reordering chapters";
                    },
                });
            }
            return;
        }

        if (activeType === 'lesson' && overType === 'lesson') {
            const chapterId = active.data.current?.chapterId;
            const overChapterId = over.data.current?.chapterId;

            if (!chapterId || chapterId !== overChapterId) {
                toast.error("Lesson move between chapters is not supported yet or invalid drop target");
                return;
            }

            const chapterIndex = items.findIndex((item) => item.id === chapterId);
            if (chapterIndex === -1) {
                toast.error("Invalid chapter");
                return;
            }

            const chapterToUpdate = items[chapterIndex];

            const oldIndex = chapterToUpdate.lessons.findIndex((lesson) => lesson.id === activeId);
            const newIndex = chapterToUpdate.lessons.findIndex((lesson) => lesson.id === overId);

            if (oldIndex === -1 || newIndex === -1) {
                toast.error("Could not find lesson for reordering");
                return;
            }

            const reorderedLessons = arrayMove(chapterToUpdate.lessons, oldIndex, newIndex).map((lesson, index) => ({
                ...lesson,
                order: index + 1,
            }));
            const newItems = [...items];
            newItems[chapterIndex] = {
                ...chapterToUpdate,
                lessons: reorderedLessons,
            }

            const previousItems = [...items];
            setItems(newItems);

            if (courseId) {
                const lessonToUpdate = reorderedLessons.map(lesson => ({
                    id: lesson.id,
                    position: lesson.order,
                }));

                const reorderLessonsPromise = () => reorderLessons(courseId, chapterId, lessonToUpdate);

                toast.promise(reorderLessonsPromise(), {
                    loading: "Reordering lessons...",
                    success: (result) => {
                        if (result.status === "success") {
                            return result.message;
                        } else {
                            setItems(previousItems);
                            return result.message || "An error occurred while reordering lessons";
                        }
                    },
                    error: () => {
                        setItems(previousItems);
                        return "An error occurred while reordering lessons";
                    },
                });
            }

            return;
        }
    }

    function toggleChapter(chapterId: string) {
        setItems((items) =>
            items.map((item) =>
                item.id === chapterId ? { ...item, isOpen: !item.isOpen } : item
            )
        );
    }

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    return (

        <DndContext collisionDetection={rectIntersection} onDragEnd={handleDragEnd} sensors={sensors}>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between border-b border-border">
                    <CardTitle>Chapters</CardTitle>
                    <NewChapterModal courseId={data.id} />
                </CardHeader>
                <CardContent className="space-y-8">
                    <SortableContext items={items} strategy={verticalListSortingStrategy}>
                        {items.map((item) => (
                            <SortableItem key={item.id} id={item.id} data={{ type: 'chapter', chapterId: item.id }}>
                                {(listeners) => (
                                    <Card>
                                        <Collapsible open={item.isOpen} onOpenChange={() => toggleChapter(item.id)}>
                                            <div className="flex items-center justify-between px-2 py-2 border-b border-border">
                                                <div className="flex items-center gap-2">
                                                    <Button variant="ghost" size="icon" {...listeners}>
                                                        <GripVertical className="size-4" />
                                                    </Button>
                                                    <CollapsibleTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="flex items-center">
                                                            {item.isOpen ? (
                                                                <ChevronDown className="size-4" />
                                                            ) : <ChevronRight className="size-4" />}
                                                        </Button>
                                                    </CollapsibleTrigger>
                                                    <p className="cursor-pointer hover:text-primary">{item.title}</p>
                                                </div>
                                                <DeleteChapter chapterId={item.id} courseId={data.id} />
                                            </div>
                                            <CollapsibleContent>
                                                <div className="pl-2">
                                                    <SortableContext items={item.lessons} strategy={verticalListSortingStrategy}>
                                                        {item.lessons.map((lesson) => (
                                                            <SortableItem key={lesson.id} id={lesson.id} data={{ type: 'lesson', chapterId: item.id, lessonId: lesson.id }}>
                                                                {(listeners) => (
                                                                    <div className="flex items-center justify-between p-2 hover:bg-accent rounded-sm">
                                                                        <div className="flex items-center gap-2">
                                                                            <Button variant="ghost" size="icon" {...listeners}>
                                                                                <GripVertical className="size-4" />
                                                                            </Button>
                                                                            <FileText className="size-4" />
                                                                            <Link href={`/dashboard/courses/${data.id}/${item.id}/${lesson.id}`}>{lesson.title}</Link>
                                                                        </div>
                                                                        <DeleteLesson chapterId={item.id} courseId={data.id} lessonId={lesson.id} />
                                                                    </div>
                                                                )}
                                                            </SortableItem>
                                                        ))}
                                                    </SortableContext>
                                                    <div className="p-2">
                                                        <NewLessonModal courseId={data.id} chapterId={item.id} />
                                                    </div>
                                                </div>
                                            </CollapsibleContent>
                                        </Collapsible>
                                    </Card>
                                    // <div {...listeners}>
                                    //     {item.title}
                                    // </div>
                                )}
                            </SortableItem>
                        ))}
                    </SortableContext>
                </CardContent>
            </Card>
        </DndContext>
    )
}