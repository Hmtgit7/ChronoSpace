'use client';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, Lock, User, Feather, ArrowRight, Loader2 } from 'lucide-react';
import { useRegister } from '@/lib/hooks/useAuth';
import { AxiosError } from 'axios';
import type { ApiError } from '@/types';
import { ThemeToggle } from '@/components/layout/ThemeToggle';
import { AuthPanel } from '@/components/auth/AuthPanel';
import { AuthFormField } from '@/components/auth/AuthFormField';
import { PasswordStrength } from '@/components/auth/PasswordStrength';
import { Button } from '@/components/ui/button';

const schema = z.object({
    username: z
        .string()
        .min(3, 'Min 3 characters')
        .max(20, 'Max 20 characters')
        .regex(/^[a-zA-Z0-9_-]+$/, 'Letters, numbers, _ and - only'),
    email: z.string().email('Enter a valid email'),
    password: z.string().min(8, 'Min 8 characters').max(64, 'Max 64 characters'),
});
type FormData = z.infer<typeof schema>;

const REGISTER_PANEL = {
    heading: 'Join a community of writers.',
    subheading: 'Free forever. No ads. No tracking. Just you, your words, and readers who care.',
    bullets: [
        'Create your account in seconds',
        'Write and save private drafts',
        'Publish to the public feed',
        'Get AI-generated post summaries',
    ],
};

export default function RegisterPage() {
    const register_ = useRegister();
    const { register, handleSubmit, formState: { errors }, watch } = useForm<FormData>({
        resolver: zodResolver(schema),
    });
    const password = watch('password', '');

    const serverError = register_.error instanceof AxiosError
        ? (() => {
            const d = register_.error.response?.data as ApiError;
            const m = d?.message;
            return Array.isArray(m) ? m[0] : (m ?? 'Registration failed');
        })()
        : null;

    return (
        <div className="min-h-screen flex bg-background">
            <AuthPanel {...REGISTER_PANEL} />

            <div className="flex-1 flex flex-col">
                <div className="flex items-center justify-between p-4 sm:p-6 border-b border-border">
                    <Link href="/" className="flex lg:hidden items-center gap-2">
                        <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center">
                            <Feather className="w-3.5 h-3.5 text-primary-foreground" />
                        </div>
                        <span className="font-semibold text-sm">ChronoSpace</span>
                    </Link>
                    <div className="ml-auto flex items-center gap-3">
                        <span className="text-sm text-muted-foreground hidden sm:block">
                            Have an account?
                        </span>
                        <Link
                            href="/login"
                            className="text-sm font-medium text-primary hover:underline underline-offset-4"
                        >
                            Sign in
                        </Link>
                        <ThemeToggle />
                    </div>
                </div>

                <div className="flex-1 flex items-center justify-center px-6 py-10">
                    <div className="w-full max-w-sm space-y-6">
                        <div>
                            <h1 className="text-2xl font-bold text-foreground mb-1">Create account</h1>
                            <p className="text-sm text-muted-foreground">
                                Start writing and sharing your stories today.
                            </p>
                        </div>

                        {serverError && (
                            <div className="px-4 py-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                                {serverError}
                            </div>
                        )}

                        <form onSubmit={handleSubmit((d) => register_.mutate(d))} className="space-y-4">
                            <AuthFormField
                                label="Username"
                                icon={<User className="w-4 h-4" />}
                                placeholder="your_username"
                                autoComplete="username"
                                error={errors.username?.message}
                                {...register('username')}
                            />
                            <AuthFormField
                                label="Email"
                                icon={<Mail className="w-4 h-4" />}
                                type="email"
                                placeholder="you@example.com"
                                autoComplete="email"
                                error={errors.email?.message}
                                {...register('email')}
                            />
                            <div className="space-y-1.5">
                                <AuthFormField
                                    label="Password"
                                    icon={<Lock className="w-4 h-4" />}
                                    type="password"
                                    placeholder="Min. 8 characters"
                                    autoComplete="new-password"
                                    error={errors.password?.message}
                                    {...register('password')}
                                />
                                <PasswordStrength password={password} />
                            </div>

                            <Button
                                type="submit"
                                disabled={register_.isPending}
                                className="w-full mt-2"
                                size="lg"
                            >
                                {register_.isPending ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                        Creating account…
                                    </>
                                ) : (
                                    <>
                                        Create account
                                        <ArrowRight className="w-4 h-4 ml-2" />
                                    </>
                                )}
                            </Button>

                            <p className="text-xs text-muted-foreground text-center">
                                By creating an account you agree to our terms of service.
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
