import { Ban, PlusCircle } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "../ui/button";

interface iAppProps {
    title: string;
    description: string;
    buttonText: string;
    href: string;
    // You can add props here if needed
}

export function EmptyState({ buttonText, title, description, href }: iAppProps) {
    return (
        <div className="flex h-full flex-col items-center justify-center gap-4 rounded-md border-2 border-dashed p-6 animate-in fade-in-50">
            <div className="flex size-20 items-center justify-center rounded-full bg-primary/10">
                <Ban className="size-8 text-muted-foreground" />
            </div>
            <h2 className="mt-6 text-xl font-semibold">
                {title}
            </h2>
            <p className="mb-8 mt-2 text-center text-sm leading-tight text-muted-foreground">
                {description}
            </p>
            <Link href={href} className={buttonVariants({ variant: "outline" })}>
                <PlusCircle className="size-4 mr-2" />
                {buttonText}
            </Link>
        </div>
    );
}