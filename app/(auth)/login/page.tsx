import { Card, CardDescription, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
export default function LoginPage() {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-2xl font-bold">Welcome!</CardTitle>
                <CardDescription className="text-muted-foreground">
                    Please sign in to your account to continue.
                </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
                <Button>Sign in with GitHub</Button>
                <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                    <span className="relative z-10 bg-card px-2 text-muted-foreground">Or continue with</span>
                </div>
                <div className="grid gap-3">
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input type="email" placeholder="Enter your email" id="email" />
                    </div>

                    <Button>Sign in with Email</Button>
                </div>
            </CardContent>
        </Card>
    )
}