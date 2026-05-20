"use client";

import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Card, CardContent } from "../ui/card";
import { cn } from "@/lib/utils";
import { RenderEmptyState, RenderErrorState, RenderUploadedState, RenderUploadingState } from "./RenderState";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import { useConstruct } from "@/hooks/use-construct";

interface UploaderState {
    id: string | null;
    file: File | null;
    uploading: boolean;
    progress: number;
    key?: string;
    isDeleting: boolean;
    error: boolean;
    objectUrl?: string;
    fileType: "image" | "video";
}

interface iAppProps {
    value?: string;
    onChange?: (value: string) => void;
    fileTypeAccepted: "image" | "video";
}

export function Uploader({ value, onChange, fileTypeAccepted }: iAppProps) {
    const fileUrl = useConstruct(value || '');
    const [fileState, setFileState] = useState<UploaderState>({
        error: false,
        file: null,
        id: null,
        isDeleting: false,
        progress: 0,
        uploading: false,
        fileType: fileTypeAccepted,
        key: value,
        objectUrl: value ? fileUrl : undefined,
    });

    const uploadFile = useCallback(
        async (file: File) => {
            if (fileState.uploading) return;
            setFileState((prev) => ({
                ...prev,
                uploading: true,
                progress: 0,
            }));

            try {
                //1. Get presigned URL from the server
                const presignedUrlResponse = await fetch("/api/s3/upload", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        fileName: file.name,
                        contentType: file.type,
                        size: file.size,
                        isImage: fileTypeAccepted == "image" ? true : false,
                    })
                });

                console.log("📡 PRESIGNED RESPONSE STATUS:", presignedUrlResponse.status);

                if (!presignedUrlResponse.ok) {
                    toast.error("Failed to get presigned URL. Please try again.");
                    setFileState((prev) => ({
                        ...prev,
                        uploading: false,
                        error: true,
                        progress: 0,
                    }));

                    return;
                }

                const { presignedUrl, key } = await presignedUrlResponse.json();
                console.log("🔐 FULL PRESIGNED URL:");
                console.log(presignedUrl);
                console.log("🔐 END OF FULL PRESIGNED URL:");


                await new Promise<void>((resolve, reject) => {
                    const xhr = new XMLHttpRequest();
                    xhr.upload.onprogress = (event) => {
                        if (event.lengthComputable) {
                            const progress = Math.round((event.loaded / event.total) * 100);
                            setFileState((prev) => ({
                                ...prev,
                                progress: progress,
                            }));
                        }
                    }

                    xhr.onload = () => {
                        console.log("📨 S3 RESPONSE STATUS:", xhr.status);
                        console.log("📨 S3 RESPONSE BODY:", xhr.responseText);
                        if (xhr.status == 200 || xhr.status == 204) {
                            setFileState((prev) => ({
                                ...prev,
                                uploading: false,
                                key,
                                progress: 100,
                            }));
                            onChange?.(key);
                            toast.success("File uploaded successfully!");
                            resolve();
                        } else {
                            reject(new Error("Upload failed"));
                        }
                    };
                    xhr.onerror = () => {
                        reject(new Error("Upload failed"));
                    };
                    xhr.open("PUT", presignedUrl);
                    xhr.setRequestHeader("Content-Type", file.type);
                    xhr.send(file);
                });
            } catch (error) {
                setFileState((prev) => ({
                    ...prev,
                    uploading: false,
                    error: true,
                    progress: 0,
                }));
                toast.error("An error occurred during file upload. Please try again.");
            }

            // if (!fileState.file) {
            //     toast.error("No file to upload. Please select a file first.");
            //     setFileState((prev) => ({
            //         ...prev,
            //         error: true,
            //         uploading: false,
            //         progress: 0,
            //     }));
            //     return;
            // }
        }, [onChange, fileTypeAccepted]
    );

    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length === 0) {
            toast.error("No valid files were dropped. Please try again.");
            return;
        }
        // if (fileState.objectUrl && !fileState.objectUrl.startsWith("http")) {
        //     URL.revokeObjectURL(fileState.objectUrl);
        // }
        const file = acceptedFiles[0];
        setFileState((prev) => {
            if (prev.uploading) {
                toast.error("Please wait for current upload to finish.");
                return prev;
            }

            if (prev.objectUrl && !prev.objectUrl.startsWith("http")) {
                URL.revokeObjectURL(prev.objectUrl);
            }

            return {
                ...prev,
                file,
                uploading: false,
                progress: 0,
                objectUrl: URL.createObjectURL(file),
                error: false,
                id: uuidv4(),
                isDeleting: false,
                fileType: fileTypeAccepted,
                key: prev.key,
            };
        });

        uploadFile(file);
    }, [fileState.objectUrl, uploadFile, fileTypeAccepted]);

    async function handleRemoveFile() {
        if (fileState.isDeleting || !fileState.objectUrl) return;

        const key = fileState.key;
        if (!key) {
            toast.error("No file key found.");
            return;
        }

        try {
            setFileState((prev) => {
                if (prev.objectUrl && !prev.objectUrl.startsWith("http")) {
                    URL.revokeObjectURL(prev.objectUrl);
                }

                return {
                    ...prev,
                    isDeleting: true,
                };
            });

            const response = await fetch("/api/s3/delete", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ key }),
            });

            if (!response.ok) {
                toast.error("Failed to delete file. Please try again.");
                setFileState((prev) => ({
                    ...prev,
                    isDeleting: false,
                    error: true,
                }));

                return;
            }

            // if (fileState.objectUrl && !fileState.objectUrl.startsWith("http")) {
            //     URL.revokeObjectURL(fileState.objectUrl);
            // }

            onChange?.("");

            setFileState((prev) => ({
                file: null,
                uploading: false,
                progress: 0,
                objectUrl: undefined,
                error: false,
                id: null,
                isDeleting: false,
                fileType: fileTypeAccepted,
            }));
            toast.success("File removed successfully!");
        } catch (error) {
            toast.error("An error occurred while removing the file. Please try again.");
            setFileState((prev) => ({
                ...prev,
                error: true,
                isDeleting: false,
            }));
        }
    }

    function renderContent() {
        if (fileState.uploading) {
            return (
                <RenderUploadingState progress={fileState.progress} file={fileState.file!} />
            )
        }

        if (fileState.error) {
            return <RenderErrorState />;
        }

        if (fileState.objectUrl) {
            return <RenderUploadedState previewUrl={fileState.objectUrl} isDeleting={fileState.isDeleting} handleRemoveFile={handleRemoveFile} fileType={fileState.fileType} />;
        }

        return <RenderEmptyState isDragActive={isDragActive} />;
    }

    // useEffect(() => {
    //     return () => {
    //         if (fileState.objectUrl && !fileState.objectUrl.startsWith("http")) {
    //             URL.revokeObjectURL(fileState.objectUrl);
    //         }
    //     }
    // }, []);
    useEffect(() => {
        setFileState((prev) => ({
            ...prev,
            key: value,
            objectUrl: value ? useConstruct(value) : undefined,
        }));
    }, [value]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: fileTypeAccepted === "image" ? { "image/*": [] } : { "video/*": [] },
        maxFiles: 1,
        multiple: false,
        maxSize: fileTypeAccepted === "image" ? 5 * 1024 * 1024 : 5000 * 1024 * 1024,
        onDropRejected: (fileRejections) => {
            fileRejections.forEach(({ file, errors }) => {
                errors.forEach((err) => {
                    toast.error(`Error with file ${file.name}: ${err.message}`);
                    console.error(`Error with file ${file.name}: ${err.message}`);
                });
            });
        },
        disabled: fileState.uploading || fileState.isDeleting,
    });
    return (
        <Card {...getRootProps()} className={cn(
            "relative border-2 border-dashed transition-colors hover:border-primary data-[drag-active]:border-primary duration-200 ease-in-out w-full h-64",
            isDragActive ? "border-primary" : "border-muted"
        )}>
            <CardContent className="flex items-center justify-center h-full w-full p-4">
                <input {...getInputProps()} />
                {renderContent()}
            </CardContent>
        </Card>
    )
}