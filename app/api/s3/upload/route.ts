import { PutObjectCommand } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";
import z from "zod";
import { v4 as uuidv4 } from "uuid";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { S3 } from "@/lib/S3Client";
import { requireAdmin } from "@/app/data/admin/require-admin";

const fileUploadSchema = z.object({
    fileName: z.string().min(1, "File name is required"),
    contentType: z.string().min(1, "Content type is required"),
    size: z.number().min(1, "File is required"),
    isImage: z.boolean(),
})

export async function POST(request: Request) {
    await requireAdmin();

    try {
        const body = await request.json();

        const validation = fileUploadSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json({ error: "Invalid file data" }, { status: 400 });
        }

        const { fileName, contentType, size, isImage } = validation.data;

        const uniqueKey = `${uuidv4()}-${fileName}`;

        const command = new PutObjectCommand({
            Bucket: process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME_IMAGES,
            Key: uniqueKey,
            ContentType: contentType,
            ContentLength: size,
        })

        const presignedUrl = await getSignedUrl(S3, command, { expiresIn: 3600 });

        console.log("🔐 FULL PRESIGNED URL:");
        console.log(presignedUrl);

        const response = {
            presignedUrl,
            key: uniqueKey,
        };

        return NextResponse.json(response);
    } catch (error) {
        return NextResponse.json({ error: "Failed to generate presigned URL" }, { status: 500 });
    }
}