"use client"

import {
    BadgeCheckIcon,
    BellIcon,
    BookOpen,
    CreditCardIcon,
    HomeIcon,
    LayoutDashboardIcon,
    LogOutIcon,
} from "lucide-react"

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { authClient } from "@/lib/auth-client"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { signOut } from "better-auth/api"
import { useSignOut } from "@/hooks/use-signout"

interface iAppProps {
    name: string;
    email: string;
    image: string;
}

export function UserDropdown({ name, email, image }: iAppProps) {
    const handleSignOut = useSignOut();
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                    <Avatar>
                        <AvatarImage
                            src={image}
                            alt="User Avatar"
                        />
                        <AvatarFallback>LR</AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuGroup>
                    <DropdownMenuLabel className="flex flex-col min-w-0">
                        <span>{name}</span>
                        <span className="text-xs text-muted-foreground truncate">{email}</span>
                    </DropdownMenuLabel>
                    <DropdownMenuItem>
                        <Link href="/account" className="flex items-center w-full">
                            <BadgeCheckIcon className="mr-2" />
                            Account
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <Link href="/dashboard" className="flex items-center w-full">
                            <LayoutDashboardIcon className="mr-2" />
                            Dashboard
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <Link href="/dashboard/courses" className="flex items-center w-full">
                            <BookOpen className="mr-2" />
                            Courses
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <CreditCardIcon className="mr-2" />
                        Billing
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <BellIcon className="mr-2" />
                        Notifications
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                    <LogOutIcon className="mr-2" />
                    Sign Out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
