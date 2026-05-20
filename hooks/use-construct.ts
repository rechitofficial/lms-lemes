
export function useConstruct(key: string): string {
    console.log("Constructing file URL for key:", key);
    console.log("return : ", `https://${process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME_IMAGES}.t3.tigrisfiles.io/${key}`);
    return `https://${process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME_IMAGES}.t3.tigrisfiles.io/${key}`;
}