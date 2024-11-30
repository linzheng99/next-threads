import { useState } from "react";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

import { type SignInFlow } from "../types";

interface SignInCardProps {
    setState: (state: SignInFlow) => void;
}

export default function SignInCard({ setState }: SignInCardProps) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    return (
        <Card className="w-full h-full p-6">
            <CardHeader className="px-0">
                <CardTitle>Sign in to Threads</CardTitle>
                <CardDescription>
                    Use your email and password to sign in.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5 px-0 pb-0">
                <form className="space-y-2.5">
                <Input type="email" placeholder="Email" required value={email} onChange={(e) => setEmail(e.target.value)} />
                <Input type="password" placeholder="Password" required value={password} onChange={(e) => setPassword(e.target.value)} />
                    <Button type="submit" className="w-full">Sign in</Button>
                </form>
                <Separator />
                <div className="flex flex-col gap-y-2.5">
                    <Button variant="outline" size="lg" className="w-full relative">
                        <FcGoogle className="size-5 absolute left-2.5 top-1/2 -translate-y-1/2" />
                        Sign in with Google
                    </Button>
                    <Button variant="outline" size="lg" className="w-full relative">
                        <FaGithub className="size-5 absolute left-2.5 top-1/2 -translate-y-1/2" />
                        Sign in with GitHub
                    </Button>
                </div>
                <p className="text-sm text-center text-muted-foreground">
                    Don&apos;t have an account? <span className="text-sky-700 hover:underline cursor-pointer" onClick={() => setState("signUp")}>Sign up</span>
                </p>
            </CardContent>
        </Card>
    )
}
