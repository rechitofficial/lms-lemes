import { cn } from "@/lib/utils";
import { CloudUploadIcon, ImageIcon, Loader2, XIcon } from "lucide-react";
import { Button } from "../ui/button";
import Image from "next/image";

export function RenderEmptyState({ isDragActive }: { isDragActive: boolean }) {
    return (
        <div className="text-center">
            <div className="flex items-center mx-auto justify-center size-12 rounded-full bg-muted mb-4">
                <CloudUploadIcon
                    className={cn(
                        "size-6 text-muted-foreground",
                        isDragActive ? "text-primary" : "text-muted-foreground"
                    )} />
            </div>
            <p className="text-base text-foreground">
                Drop your files here, or <span className="text-primary font-bold cursor-pointer">click to select files</span>
            </p>
            <Button type="button" variant="outline" className="mt-4">
                Select File
            </Button>
        </div>

    )
}

export function RenderErrorState() {
    return (
        <div className="text-destructive text-center">
            <div className="flex items-center mx-auto justify-center size-12 rounded-full bg-destructive/30 mb-4">
                <ImageIcon className={cn(
                    "size-6 text-destructive",
                )} />

            </div>
            <p className="text-base text-destructive">
                Something went wrong while uploading your files. Please try again.
            </p>
            <Button className="mt-4" type="button">
                Retry File Upload
            </Button>
        </div>
    )
}

export function RenderUploadedState({ previewUrl, isDeleting, handleRemoveFile }: { previewUrl: string, isDeleting: boolean, handleRemoveFile: () => void }) {
    return <div className="relative w-full h-full">
        <Image src={previewUrl} alt="Uploaded File" fill className="object-contain p-2" />
        <Button type="button" variant="destructive" size="icon" className={cn("absolute top-2 right-2")} onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleRemoveFile();
        }} disabled={isDeleting}>
            {isDeleting ? <Loader2 className="size-4 animate-spin" /> : <XIcon className="size-4" />}
        </Button>
    </div>
}

export function RenderUploadingState({ progress, file }: { progress: number, file: File }) {
    return <div className="text-center flex flex-col items-center justify-center">
        <p>{progress}</p>
        <p className="mt-2 text-sm font-medium text-foreground">Uploading...</p>

        <p className="mt-1 text-xs text-muted-foreground truncate max-w-xs">{file.name}</p>
    </div>
}