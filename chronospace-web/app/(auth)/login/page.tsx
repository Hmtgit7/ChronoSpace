'use client';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Mail, Lock, Feather, ArrowRight, Loader2 } from 'lucide-react';
import { useLogin } from '@/lib/hooks/useAuth';
import { AxiosError } from 'axios';
import type { ApiError } from '@/types';
import { ThemeToggle } from '@/components/layout/ThemeToggle';

const schema = z.object({
    email: z.string().email('Please enter a valid email'),
    password: z.string().min(1, 'Password is required'),
});
type FormData = z.infer<typeof schema>;

export default function LoginPage() {
    const login = useLogin();

    const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(schema),
    });

    const onSubmit = (data: FormData) => login.mutate(data);

    const serverError = login.error instanceof AxiosError
        ? (() => {
            const d = login.error.response?.data as ApiError;
            const m = d?.message;
            return Array.isArray(m) ? m[0] : (m ?? 'Login failed');
        })()
        : null;

    return (
        <div className="min-h-screen flex">
            {/* Left panel */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-primary/20 via-primary/10 to-background items-center justify-center p-12 overflow-hidden">
                <div className="absolute inset-0">
                    <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-primary/20 rounded-full blur-3xl" />
                    <div className="absolute bottom-1/4 right-1/4 w-60 h-60 bg-violet-500/15 rounded-full blur-3xl" />
                </div>
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.7 }}
                    className="relative z-10 max-w-md"
                >
                    <Link href="/" className="flex items-center gap-2 mb-12">
                        <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/30">
                            <Feather className="w-5 h-5 text-primary-foreground" />
                        </div>
                        <span className="text-2xl font-bold">Chrono<span className="text-primary">Space</span></span>
                    </Link>
                    <h2 className="text-4xl font-bold mb-4 leading-tight">
                        Welcome back,<br />writer.
                    </h2>
                    <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
                        Your stories are waiting. Sign in to continue crafting and sharing your work.
                    </p>
                    <div className="space-y-4">
                        {[
                            '✦ Private drafts only you can see',
                            '✦ Public slugs for sharing',
                            '✦ Like & comment system',
                        ].map((t) => (
                            <p key={t} className="text-sm text-muted-foreground">{t}</p>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* Right panel */}
            <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-12">
                <div className="absolute top-4 right-4">
                    <ThemeToggle />
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-md"
                >
                    {/* Mobile logo */}
                    <Link href="/" className="flex lg:hidden items-center gap-2 mb-8 justify-center">
                        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                            <Feather className="w-4 h-4 text-primary-foreground" />
                        </div>
                        <span className="font-bold text-lg">Chrono<span className="text-primary">Space</span></span>
                    </Link>

                    <div className="mb-8">
                        <h1 className="text-3xl font-bold mb-2">Sign in</h1>
                        <p className="text-muted-foreground">
                            Don't have an account?{' '}
                            <Link href="/register" className="text-primary font-medium hover:underline">
                                Create one free
                            </Link>
                        </p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        {/* Server error */}
                        {serverError && (
                            <motion.div
                                initial={{ opacity: 0, y: -8 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm"
                            >
                                {serverError}
                            </motion.div>
                        )}

                        {/* Email */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <input
                                    {...register('email')}
                                    type="email"
                                    placeholder="you@example.com"
                                    autoComplete="email"
                                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-secondary border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm"
                                />
                            </div>
                            {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
                        </div>

                        {/* Password */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <input
                                    {...register('password')}
                                    type="password"
                                    placeholder="••••••••"
                                    autoComplete="current-password"
                                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-secondary border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm"
                                />
                            </div>
                            {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={login.isPending}
                            className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 disabled:opacity-60 disabled:cursor-not-allowed transition-all shadow-lg shadow-primary/25 hover:shadow-primary/40 text-sm mt-2"
                        >
                            {login.isPending ? (
                                <><Loader2 className="w-4 h-4 animate-spin" /> Signing in...</>
                            ) : (
                                <>Sign in <ArrowRight className="w-4 h-4" /></>
                            )}
                        </button>
                    </form>
                </motion.div>
            </div>
        </div>
    );
}
