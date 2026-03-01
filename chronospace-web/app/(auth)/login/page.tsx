'use client';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, Lock, Feather, ArrowRight, Loader2 } from 'lucide-react';
import { useLogin } from '@/lib/hooks/useAuth';
import { AxiosError } from 'axios';
import type { ApiError } from '@/types';
import { ThemeToggle } from '@/components/layout/ThemeToggle';
import { AuthPanel } from '@/components/auth/AuthPanel';
import { AuthFormField } from '@/components/auth/AuthFormField';
import { Button } from '@/components/ui/button';

const schema = z.object({
    email: z.string().email('Enter a valid email'),
    password: z.string().min(1, 'Password is required'),
});
type FormData = z.infer<typeof schema>;

const LOGIN_PANEL = {
    heading: 'Welcome back, writer.',
    subheading: 'Your stories are waiting. Sign in to continue crafting and sharing your work.',
    bullets: [
        'Private drafts only you can see',
        'Public slugs for sharing anywhere',
        'Like and comment system',
        'Async AI summaries for your posts',
    ],
};

export default function LoginPage() {
    const login = useLogin();
    const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(schema),
    });

    const serverError = login.error instanceof AxiosError
        ? (() => {
            const d = login.error.response?.data as ApiError;
            const m = d?.message;
            return Array.isArray(m) ? m[0] : (m ?? 'Login failed');
        })()
        : null;

    return (
        <div className="min-h-screen flex bg-background">
            <AuthPanel {...LOGIN_PANEL} />

            {/* Right panel */}
            <div className="flex-1 flex flex-col">
                {/* Top bar */}
                <div className="flex items-center justify-between p-4 sm:p-6 border-b border-border">
                    <Link href="/" className="flex lg:hidden items-center gap-2">
                        <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center">
                            <Feather className="w-3.5 h-3.5 text-primary-foreground" />
                        </div>
                        <span className="font-semibold text-sm">ChronoSpace</span>
                    </Link>
                    <div className="ml-auto flex items-center gap-3">
                        <span className="text-sm text-muted-foreground hidden sm:block">
                            No account?
                        </span>
                        <Link
                            href="/register"
                            className="text-sm font-medium text-primary hover:underline underline-offset-4"
                        >
                            Sign up free
                        </Link>
                        <ThemeToggle />
                    </div>
                </div>

                {/* Form area */}
                <div className="flex-1 flex items-center justify-center px-6 py-10">
                    <div className="w-full max-w-sm space-y-6">
                        <div>
                            <h1 className="text-2xl font-bold text-foreground mb-1">Sign in</h1>
                            <p className="text-sm text-muted-foreground">
                                Enter your credentials to access your dashboard.
                            </p>
                        </div>

                        {serverError && (
                            <div className="px-4 py-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                                {serverError}
                            </div>
                        )}

                        <form onSubmit={handleSubmit((d) => login.mutate(d))} className="space-y-4">
                            <AuthFormField
                                label="Email"
                                icon={<Mail className="w-4 h-4" />}
                                type="email"
                                placeholder="you@example.com"
                                autoComplete="email"
                                error={errors.email?.message}
                                {...register('email')}
                            />
                            <AuthFormField
                                label="Password"
                                icon={<Lock className="w-4 h-4" />}
                                type="password"
                                placeholder="Your password"
                                autoComplete="current-password"
                                error={errors.password?.message}
                                {...register('password')}
                            />

                            <Button
                                type="submit"
                                disabled={login.isPending}
                                className="w-full mt-2"
                                size="lg"
                            >
                                {login.isPending ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                        Signing in…
                                    </>
                                ) : (
                                    <>
                                        Sign in
                                        <ArrowRight className="w-4 h-4 ml-2" />
                                    </>
                                )}
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
