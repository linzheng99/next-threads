import { useAuthActions } from "@convex-dev/auth/react";
import { TriangleAlert } from "lucide-react";
import { useState } from "react";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

import { type SignInFlow } from "../types";

interface SignUpCardProps {
    setState: (state: SignInFlow) => void;
}

export default function SignUpCard({ setState }: SignUpCardProps) {
    const { signIn } = useAuthActions();
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [pending, setPending] = useState(false);
    const [error, setError] = useState<string | null>(null);

    function onPasswordSignUp(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setPending(true);
        signIn('password', { name, email, password, flow: "signUp" }).catch(() => {
            setError("Something went wrong, please try again.");
        }).finally(() => {
            setPending(false);
        });
    }

    async function handleProviderSignIn(provider: 'github' | 'google') {
        setPending(true);
        await signIn(provider);
        setPending(false);
    }

    return (
        <Card className="w-full h-full p-6">
            <CardHeader className="px-0">
                <CardTitle>Create your account</CardTitle>
                <CardDescription>
                    Use your email and password to create an account.
                </CardDescription>
            </CardHeader>
            {!!error && <div className="text-sm text-center rounded-md bg-destructive/15 text-destructive p-3 flex items-center gap-x-2 mb-2.5">
                <TriangleAlert className="size-4" />
                <p>{error}</p>
            </div>}
            <CardContent className="space-y-5 px-0 pb-0">
                <form className="space-y-2.5" onSubmit={onPasswordSignUp}>
                    <Input type="text" placeholder="Name" required value={name} onChange={(e) => setName(e.target.value)} disabled={pending} />
                    <Input type="email" placeholder="Email" required value={email} onChange={(e) => setEmail(e.target.value)} disabled={pending} />
                    <Input type="password" placeholder="Password" required value={password} onChange={(e) => setPassword(e.target.value)} disabled={pending} />
                    <Input type="password" placeholder="Confirm password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} disabled={pending} />
                    <Button type="submit" className="w-full" disabled={pending}>Sign up</Button>
                </form>
                <Separator />
                <div className="flex flex-col gap-y-2.5">
                    <Button variant="outline" size="lg" className="w-full relative" onClick={() => handleProviderSignIn('google')} disabled={pending}>
                        <FcGoogle className="size-5 absolute left-2.5 top-1/2 -translate-y-1/2" />
                        Sign in with Google
                    </Button>
                    <Button variant="outline" size="lg" className="w-full relative" onClick={() => handleProviderSignIn('github')} disabled={pending}>
                        <FaGithub className="size-5 absolute left-2.5 top-1/2 -translate-y-1/2" />
                        Sign in with GitHub
                    </Button>
                </div>
                <p className="text-sm text-center text-muted-foreground">
                    Already have an account? <span className="text-sky-700 hover:underline cursor-pointer" onClick={() => setState("signIn")}>Sign in</span>
                </p>
            </CardContent>
        </Card>
    )
}
