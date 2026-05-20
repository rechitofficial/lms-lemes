import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Trash2 } from "lucide-react";
import { useState, useTransition } from "react";
import { deleteChapter } from "../actions";
import { tryCatch } from "@/hooks/try-catch";
import { toast } from "sonner";

export function DeleteChapter({ chapterId, courseId }: { chapterId: string, courseId: string }) {
    const [open, setOpen] = useState(false);
    const [isPending, startTransition] = useTransition();

    async function onSubmit() {
        // Call the delete lesson API here and handle the response
        // You can also show a toast notification based on the success or failure of the deletion

        startTransition(async () => {
            const { data: result, error } = await tryCatch(deleteChapter(chapterId, courseId)); // Pass the appropriate lesson ID to delete

            if (error) {
                toast.error("Error deleting chapter, please try again.");
            }

            if (result?.status === "success") {
                toast.success("Chapter deleted successfully!");
                setOpen(false);
            } else if (result?.status === "error") {
                toast.error(result.message || "Failed to delete chapter.");
            }
        });
    }
    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                <Button variant="outline" size="icon">
                    <Trash2 className="size-4" />
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure you want to delete this chapter?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. All the content of this chapter will be permanently deleted.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>
                        Cancel
                    </AlertDialogCancel>
                    <Button variant="destructive" onClick={onSubmit} disabled={isPending}>
                        {isPending ? (
                            <>
                                Deleting...
                                <Loader2 className="animate-spin ml-1" />
                            </>
                        ) : (
                            <>
                                Delete
                                <Trash2 className="size-4" />
                            </>
                        )}
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>             {/* AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter with actions would go here */}
        </AlertDialog>
    )
}