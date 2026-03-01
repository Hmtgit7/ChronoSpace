"use client";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Mail, Lock, Feather, ArrowRight, Loader2 } from "lucide-react";
import { useLogin } from "@/lib/hooks/useAuth";
import { AxiosError } from "axios";
import type { ApiError } from "@/types";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { cn } from "@/lib/utils";

const schema = z.object({
    email: z.string().email("Please enter a valid email"),
    password: z.string().min(1, "Password is required"),
});

type FormData = z.infer<typeof schema>;

export default function LoginPage() {
    const login = useLogin();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>({ resolver: zodResolver(schema) });

    const onSubmit = (data: FormData) => login.mutate(data);

    const serverError =
        login.error instanceof AxiosError
            ? (() => {
                const d = login.error.response?.data as ApiError;
                const m = d?.message;
                return Array.isArray(m) ? m[0] : (m ?? "Login failed");
            })()
            : null;

    return (
        <div className="min-h-screen flex">
            {/* Left panel */}
            <div className="hidden lg:flex lg:w-5/12 relative bg-card border-r border-border flex-col justify-between p-12 overflow-hidden">
                {/* Subtle dot pattern */}
                <div
                    className="absolute inset-0 opacity-[0.04]"
                    style={{
                        backgroundImage: "radial-gradient(currentColor 1px, transparent 1px)",
                        backgroundSize: "24px 24px",
                    }}
                />
                {/* Single top glow */}
                <div className="absolute top-0 left-0 w-64 h-64 bg-primary/15 rounded-full blur-3xl -z-0" />

                {/* Logo */}
                <Link href="/" className="relative flex items-center gap-2 z-10">
                    <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-md">
                        <Feather className="w-4.5 h-4.5 text-primary-foreground" />
                    </div>
                    <span className="font-bold text-xl">
                        Chrono<span className="text-primary">Space</span>
                    </span>
                </Link>

                {/* Middle content */}
                <div className="relative z-10">
                    <h2 className="text-3xl font-extrabold mb-4 leading-tight">
                        Welcome back,<br />writer.
                    </h2>
                    <p className="text-muted-foreground leading-relaxed mb-8 max-w-xs">
                        Your drafts are waiting. Sign in to continue crafting and sharing
                        your stories.
                    </p>
                    <div className="space-y-2">
                        {[
                            "Private drafts only you can see",
                            "Public slugs for sharing",
                            "Like & comment system",
                        ].map((t) => (
                            <div key={t} className="flex items-center gap-2 text-sm text-muted-foreground">
                                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                                {t}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer note */}
                <p className="relative z-10 text-xs text-muted-foreground/60">
                    Free forever · No ads · No tracking
                </p>
            </div>

            {/* Right panel */}
            <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-12 relative">
                <div className="absolute top-4 right-4">
                    <ThemeToggle />
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="w-full max-w-md"
                >
                    {/* Mobile logo */}
                    <Link
                        href="/"
                        className="flex lg:hidden items-center gap-2 mb-8 justify-center"
                    >
                        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                            <Feather className="w-4 h-4 text-primary-foreground" />
                        </div>
                        <span className="font-bold text-lg">
                            Chrono<span className="text-primary">Space</span>
                        </span>
                    </Link>

                    <div className="mb-8">
                        <h1 className="text-2xl font-bold mb-1.5">Sign in</h1>
                        <p className="text-sm text-muted-foreground">
                            Don&apos;t have an account?{" "}
                            <Link
                                href="/register"
                                className="text-primary font-medium hover:underline underline-offset-4"
                            >
                                Create one free
                            </Link>
                        </p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        {/* Server error */}
                        {serverError && (
                            <motion.div
                                initial={{ opacity: 0, y: -6 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="p-3.5 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm"
                            >
                                {serverError}
                            </motion.div>
                        )}

                        {/* Email */}
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <input
                                    {...register("email")}
                                    type="email"
                                    placeholder="you@example.com"
                                    autoComplete="email"
                                    className={cn(
                                        "w-full pl-10 pr-4 py-2.5 rounded-xl bg-card border text-sm transition-all outline-none",
                                        "focus:border-primary focus:ring-2 focus:ring-primary/15",
                                        errors.email ? "border-destructive" : "border-border"
                                    )}
                                />
                            </div>
                            {errors.email && (
                                <p className="text-xs text-destructive">{errors.email.message}</p>
                            )}
                        </div>

                        {/* Password */}
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <input
                                    {...register("password")}
                                    type="password"
                                    placeholder="••••••••"
                                    autoComplete="current-password"
                                    className={cn(
                                        "w-full pl-10 pr-4 py-2.5 rounded-xl bg-card border text-sm transition-all outline-none",
                                        "focus:border-primary focus:ring-2 focus:ring-primary/15",
                                        errors.password ? "border-destructive" : "border-border"
                                    )}
                                />
                            </div>
                            {errors.password && (
                                <p className="text-xs text-destructive">{errors.password.message}</p>
                            )}
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={login.isPending}
                            className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 disabled:opacity-60 disabled:cursor-not-allowed transition-all shadow-md shadow-primary/20 text-sm mt-1"
                        >
                            {login.isPending ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Signing in…
                                </>
                            ) : (
                                <>
                                    Sign in
                                    <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </form>
                </motion.div>
            </div>
        </div>
    );
}
